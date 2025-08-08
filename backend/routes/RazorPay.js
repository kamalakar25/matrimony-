const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../modals/userSchema.js');
const Payment = require('../modals/payment.js');
const { config } = require('dotenv');

config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Middleware to parse JSON bodies
router.use(express.json());

// 🟢 Initiate Payment
router.post('/initiate', async (req, res) => {
  const { plan, price, userId } = req.body;

  // Validate inputs
  if (!plan || !price || !userId) {
    console.warn('Missing required fields:', { plan, price, userId });
    return res
      .status(400)
      .json({
        success: false,
        message:
          'Missing required fields: plan, price, and userId are required',
      });
  }

  // Validate plan
  const validPlans = ['premium', 'premium plus'];
  if (!validPlans.includes(plan.toLowerCase())) {
    console.warn('Invalid plan:', plan);
    return res
      .status(400)
      .json({ success: false, message: 'Invalid plan specified' });
  }

  // Validate price
  const parsedPrice = parseInt(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    console.warn('Invalid price:', price);
    return res
      .status(400)
      .json({ success: false, message: 'Invalid price value' });
  }

  // Validate user by profileId
  const user = await User.findOne({ profileId: userId });
  if (!user) {
    console.warn('User not found for profileId:', userId);
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  try {
    const amount = parsedPrice * 100; // Convert to paise
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    const payment = new Payment({
      userId: user._id, // Store MongoDB _id in Payment document
      plan: plan.toLowerCase(),
      price: amount / 100,
      razorpayOrderId: order.id,
      status: 'created',
    });

    await payment.save();

    res.json({ success: true, order, paymentId: payment._id });
  } catch (err) {
    console.error('Payment initiation error:', err.message);
    res
      .status(500)
      .json({ success: false, message: 'Payment initiation failed' });
  }
});

// ✅ Verify Payment
router.post('/verify', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paymentId,
  } = req.body;

  // Validate inputs
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !paymentId
  ) {
    console.warn('Missing verification fields:', req.body);
    return res
      .status(400)
      .json({
        success: false,
        message: 'Missing required verification fields',
      });
  }

  // Verify signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    console.warn('Invalid signature received');
    return res
      .status(400)
      .json({ success: false, message: 'Invalid signature' });
  }

  try {
    // Update payment status
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
      },
      { new: true }
    );

    if (!payment) {
      console.warn('Payment not found:', paymentId);
      return res
        .status(404)
        .json({ success: false, message: 'Payment not found' });
    }

    // Update user subscription
    const user = await User.findById(payment.userId);
    if (!user) {
      console.warn('User not found for payment:', payment.userId);
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const now = new Date();
    const duration = payment.plan === 'premium' ? 90 : 180; // Days
    const expiry = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

    user.subscription = {
      current: payment.plan,
      details: {
        startDate: now,
        expiryDate: expiry,
        paymentId: payment._id,
        autoRenew: false,
      },
      history: [
        ...(user.subscription?.history || []),
        {
          type: payment.plan,
          startDate: now,
          expiryDate: expiry,
          paymentId: payment._id,
          status: 'active',
          upgradedAt: now,
        },
      ],
    };

    await user.save();

    res.json({
      success: true,
      message: 'Payment verified and subscription updated',
    });
  } catch (err) {
    console.error('Payment verification error:', err.message);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

module.exports = router;
