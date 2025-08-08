import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plan = searchParams.get('plan') || 'premium';
  const price = searchParams.get('price') || '2999';

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  const planDetails = {
    premium: { name: 'Premium', duration: '3 Months', price: '2,999' },
    'premium plus': {
      name: 'Premium Plus',
      duration: '6 Months',
      price: '4,999',
    },
  };

  const currentPlan = planDetails[plan] || planDetails.premium;

  // Load Razorpay script dynamically
  useEffect(() => {
    if (window.Razorpay) {
      setIsRazorpayLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setIsRazorpayLoaded(true);
    };
    script.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to load payment gateway. Please try again later.',
        variant: 'destructive',
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  // Pre-fill form with user data from localStorage
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setFormData({
        email: loggedInUser.email || '',
        phone: loggedInUser.mobile || '',
      });
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+91[0-9]{10}$/;

    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: 'Invalid Phone',
        description:
          'Please enter a valid phone number starting with +91 followed by 10 digits.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser?.profileId) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to proceed with payment.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    // Check if Razorpay is loaded
    if (!isRazorpayLoaded || !window.Razorpay) {
      toast({
        title: 'Payment Error',
        description: 'Payment gateway not loaded. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/payment/initiate`, {
        plan: currentPlan.name.toLowerCase(),
        price: currentPlan.price.replace(',', ''),
        userId: loggedInUser.profileId,
      });

      const { order, paymentId } = res.data;

      if (!order || !paymentId) {
        throw new Error('Invalid response from payment initiation');
      }

      const options = {
        key: 'rzp_test_UlCC6Rw2IJrhyh', // import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Number(order.amount),
        currency: 'INR',
        name: 'Matrimony Membership',
        description: `Upgrade to ${currentPlan.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${BASE_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId,
              }
            );

            if (verifyRes.data.success) {
              // Update localStorage with new subscription data
              const updatedUser = {
                ...loggedInUser,
                subscription: {
                  current: currentPlan.name.toLowerCase(),
                  details: {
                    startDate: new Date(),
                    expiryDate: new Date(
                      Date.now() +
                        (currentPlan.name === 'Premium' ? 90 : 180) *
                          24 *
                          60 *
                          60 *
                          1000
                    ),
                    paymentId,
                    autoRenew: false,
                  },
                },
              };
              localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

              toast({
                title: 'Payment Successful',
                description: 'Your subscription has been activated!',
              });
              navigate('/dashboard');
            } else {
              toast({
                title: 'Verification Failed',
                description: 'Please contact support.',
                variant: 'destructive',
              });
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast({
              title: 'Payment Error',
              description: 'Something went wrong during verification.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          name: loggedInUser.name || 'User',
          email: formData.email,
          contact: formData.phone,
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          paylater: true,
        },
        modal: {
          ondismiss: () => {
            toast({
              title: 'Payment Cancelled',
              description: 'You closed the payment window.',
              variant: 'default',
            });
          },
        },
        theme: {
          color: '#f97316',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err.message);
      toast({
        title: 'Payment Error',
        description:
          err.response?.data?.message ||
          'Something went wrong while initiating payment.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50'>
      <Header />
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <Button
            variant='ghost'
            onClick={() => navigate('/membership')}
            className='mb-6 text-orange-600 hover:bg-orange-50'
          >
            <ArrowLeft size={16} className='mr-2' />
            Back to Plans
          </Button>

          <div className='grid lg:grid-cols-2 gap-8'>
            {/* Summary */}
            <Card className='border-orange-100'>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Shield className='mr-2 text-orange-600' size={20} />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg'>
                  <h3 className='text-xl font-semibold'>
                    {currentPlan.name} Plan
                  </h3>
                  <p className='text-orange-100'>{currentPlan.duration}</p>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Subscription Fee</span>
                    <span>₹{currentPlan.price}</span>
                  </div>
                  <div className='flex justify-between text-green-600'>
                    <span>Discount</span>
                    <span>₹0</span>
                  </div>
                  <Separator />
                  <div className='flex justify-between font-semibold text-lg'>
                    <span>Total Amount</span>
                    <span>₹{currentPlan.price}</span>
                  </div>
                </div>
                <div className='bg-green-50 p-3 rounded-lg text-sm text-green-700'>
                  <p className='font-medium'>What you get:</p>
                  <ul className='list-disc list-inside mt-1 space-y-1'>
                    <li>Unlimited profile views</li>
                    <li>Direct contact details</li>
                    <li>Profile boost</li>
                    <li>Priority support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className='border-orange-100'>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <CreditCard className='mr-2 text-orange-600' size={20} />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    placeholder='your@email.com'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className='border-orange-200'
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    placeholder='+91 9876543210'
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className='border-orange-200'
                  />
                </div>
                <div className='text-center border border-dashed border-orange-300 rounded-lg p-4 bg-orange-50 text-orange-700 text-sm font-medium'>
                  All Cards and UPI Payments Are Acceptable <br />
                  <span className='text-xl mt-1 block'>↓</span>
                </div>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !isRazorpayLoaded}
                  className='w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg py-6'
                >
                  {isProcessing
                    ? 'Processing...'
                    : isRazorpayLoaded
                    ? `Pay ₹${currentPlan.price}`
                    : 'Loading Payment Gateway...'}
                </Button>
                <div className='text-xs text-gray-500 text-center'>
                  <p>Your payment is secured with SSL encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
