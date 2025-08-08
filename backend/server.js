const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const User = require('./modals/userSchema');
const Interest = require('./modals/interest');
const reportRoutes = require('./routes/reports');

const Razorpay = require('./routes/RazorPay');
const Message = mongoose.models.Message || require('./modals/messageSchema');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// app.use(cors({ origin: 'http://localhost:8080', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));

app.use(cors());

app.use('/api/payment', Razorpay);
app.use(express.json());

// MongoDB connection
const connectMongoDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in MongoDB
const storeOTP = async (email) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
  try {
    const normalizedEmail = email.toLowerCase();
    const result = await User.updateOne(
      { 'personalInfo.email': normalizedEmail },
      {
        $set: {
          'personalInfo.email': normalizedEmail,
          'otp.code': otp,
          'otp.expiresAt': expiresAt,
          'otp.verified': false,
        },
      },
      { upsert: true }
    );
    console.log(
      `OTP ${otp} stored for ${normalizedEmail}. Update result:`,
      result
    );
    return otp;
  } catch (error) {
    console.error(`Error storing OTP for ${email}:`, error.message, error);
    throw new Error('Failed to store OTP');
  }
};

// API Endpoints
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.post('/api/send-email-otp', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.warn(`Invalid email received: ${email}`);
    return res.status(400).json({ error: 'Invalid email' });
  }
  try {
    const otp = await storeOTP(email);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'KannadaMatch OTP Verification',
      text: `Your OTP for KannadaMatch verification is ${otp}. It is valid for 10 minutes.`,
    });
    console.log(`OTP ${otp} sent to ${email} (logged for development)`);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/verify-email-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp || !/^\d{6}$/.test(otp)) {
    console.warn(`Invalid input - Email: ${email}, OTP: ${otp}`);
    return res.status(400).json({ error: 'Invalid email or OTP' });
  }
  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ 'personalInfo.email': normalizedEmail });
    if (!user) {
      console.warn(`User not found for email: ${normalizedEmail}`);
      return res.status(400).json({ error: 'User not found' });
    }
    if (!user.otp || !user.otp.code) {
      console.warn(`No OTP found for email: ${normalizedEmail}`);
      return res.status(400).json({ error: 'No OTP found' });
    }
    if (user.otp.code !== otp) {
      console.warn(
        `OTP mismatch for email: ${normalizedEmail}, provided: ${otp}, stored: ${user.otp.code}`
      );
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    if (new Date() > new Date(user.otp.expiresAt)) {
      console.warn(`OTP expired for email: ${normalizedEmail}`);
      return res.status(400).json({ error: 'Expired OTP' });
    }
    await User.updateOne(
      { 'personalInfo.email': normalizedEmail },
      { $set: { 'otp.verified': true } }
    );
    console.log(`OTP ${otp} verified successfully for ${normalizedEmail}`);
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

app.post('/api/create-profile', async (req, res) => {
  const profileData = req.body;

  // Validate required fields for new profile creation
  if (
    !profileData.personalInfo ||
    !profileData.personalInfo.email ||
    !profileData.personalInfo.name ||
    !profileData.personalInfo.mobile ||
    !profileData.personalInfo.gender ||
    !profileData.personalInfo.lookingFor ||
    !profileData.demographics ||
    !profileData.demographics.dateOfBirth ||
    !profileData.demographics.height ||
    !profileData.demographics.maritalStatus ||
    !profileData.demographics.religion ||
    !profileData.demographics.community ||
    !profileData.demographics.motherTongue ||
    !profileData.professionalInfo ||
    !profileData.professionalInfo.education ||
    !profileData.professionalInfo.occupation ||
    !profileData.professionalInfo.income ||
    !profileData.location ||
    !profileData.location.city ||
    !profileData.location.state ||
    !profileData.credentials ||
    !profileData.credentials.password ||
    !profileData.appVersion
  ) {
    console.warn('Missing required fields in profile data:', profileData);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const normalizedEmail = profileData.personalInfo.email.toLowerCase();
    const user = await User.findOne({ 'personalInfo.email': normalizedEmail });

    if (user) {
      // Check if email is verified
      if (!user.otp || !user.otp.verified) {
        console.warn(`Email not verified for ${normalizedEmail}`);
        return res.status(400).json({ error: 'Email not verified' });
      }

      // Hash password
      profileData.credentials.password = await bcrypt.hash(
        profileData.credentials.password,
        10
      );

      // Prepare subscription data
      const subscriptionData = {
        current: profileData.subscription?.current || 'free',
        details: profileData.subscription?.details || {
          startDate: new Date(),
          expiryDate: null,
          paymentId: null,
          autoRenew: false,
        },
        history: profileData.subscription?.history || [],
      };

      // Update existing user
      const updatedUser = await User.updateOne(
        { 'personalInfo.email': normalizedEmail },
        {
          $set: {
            profileId: user.profileId || `KM${Date.now()}`,
            personalInfo: {
              ...profileData.personalInfo,
              email: normalizedEmail,
              lastActive: new Date(),
            },
            demographics: profileData.demographics,
            professionalInfo: profileData.professionalInfo,
            location: profileData.location,
            credentials: {
              ...profileData.credentials,
              rememberMe: profileData.credentials.rememberMe || false,
            },
            subscription: subscriptionData,
            profileCreatedAt: new Date(),
            appVersion: profileData.appVersion,
          },
        }
      );

      console.log('Profile updated:', {
        profileId: user.profileId || `KM${Date.now()}`,
        email: normalizedEmail,
        subscription: subscriptionData.current,
      });

      return res.status(201).json({
        message: 'Profile updated successfully',
        profileId: user.profileId || `KM${Date.now()}`,
        email: normalizedEmail,
        subscription: subscriptionData.current,
      });
    } else {
      // Hash password for new user
      profileData.credentials.password = await bcrypt.hash(
        profileData.credentials.password,
        10
      );

      // Prepare subscription data for new user
      const subscriptionData = {
        current: profileData.subscription?.current || 'free',
        details: profileData.subscription?.details || {
          startDate: new Date(),
          expiryDate: null,
          paymentId: null,
          autoRenew: false,
        },
        history: profileData.subscription?.history || [],
      };

      // Create new user
      const newUser = new User({
        profileId: `KM${Date.now()}`,
        personalInfo: {
          ...profileData.personalInfo,
          email: normalizedEmail,
          lastActive: new Date(),
        },
        demographics: profileData.demographics,
        professionalInfo: profileData.professionalInfo,
        location: profileData.location,
        credentials: {
          ...profileData.credentials,
          rememberMe: profileData.credentials.rememberMe || false,
        },
        subscription: subscriptionData,
        profileCreatedAt: new Date(),
        appVersion: profileData.appVersion,
        otp: profileData.otp || { verified: false },
      });

      await newUser.save();

      console.log('Profile created:', {
        profileId: newUser.profileId,
        email: newUser.personalInfo.email,
        subscription: newUser.subscription.current,
      });

      return res.status(201).json({
        message: 'Profile created successfully',
        profileId: newUser.profileId,
        email: newUser.personalInfo.email,
        subscription: newUser.subscription.current,
      });
    }
  } catch (error) {
    console.error('Error creating profile:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    return res
      .status(500)
      .json({ error: `Failed to create profile: ${error.message}` });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.warn(`Invalid email received: ${email}`);
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!password || password.length < 6) {
    console.warn(`Invalid password length for email: ${email}`);
    return res
      .status(400)
      .json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ 'personalInfo.email': normalizedEmail });

    if (!user) {
      console.warn(`User not found for email: ${normalizedEmail}`);
      return res.status(400).json({ error: 'User not found' });
    }

    if (!user.otp || !user.otp.verified) {
      console.warn(`Email not verified for ${normalizedEmail}`);
      return res.status(400).json({ error: 'Email not verified' });
    }

    if (!user.credentials || !user.credentials.password) {
      console.warn(`No password set for ${normalizedEmail}`);
      return res
        .status(400)
        .json({ error: 'No password set for this account' });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.credentials.password
    );
    if (!isPasswordValid) {
      console.warn(`Invalid password for ${normalizedEmail}`);
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Update lastActive and lastLogin
    user.personalInfo.lastActive = new Date();
    user.lastLogin = new Date();
    await user.save();

    // Prepare user data for response
    const userData = {
      profileId: user.profileId,
      name: user.personalInfo.name,
      email: user.personalInfo.email,
      mobile: user.personalInfo.mobile,
      gender: user.personalInfo.gender,
      lookingFor: user.personalInfo.lookingFor,
      lastActive: user.personalInfo.lastActive,
      dateOfBirth: user.demographics.dateOfBirth,
      height: user.demographics.height,
      maritalStatus: user.demographics.maritalStatus,
      religion: user.demographics.religion,
      community: user.demographics.community,
      motherTongue: user.demographics.motherTongue,
      education: user.professionalInfo.education,
      occupation: user.professionalInfo.occupation,
      income: user.professionalInfo.income,
      city: user.location.city,
      state: user.location.state,
      subscription: {
        current: user.subscription.current,
        details: user.subscription.details,
        history: user.subscription.history,
      },
      profileCreatedAt: user.profileCreatedAt,
      appVersion: user.appVersion,
    };

    console.log(`Login successful for ${normalizedEmail}`);
    return res.status(200).json({
      message: 'Login successful',
      user: userData,
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/api/profiles', async (req, res) => {
  try {
    const users = await User.find({ 'otp.verified': true }).select(
      'profileId personalInfo.name demographics.dateOfBirth professionalInfo.occupation location.city professionalInfo.education demographics.community professionalInfo.income demographics.horoscope image'
    );
    const profiles = users.map((user) => {
      const age =
        new Date().getFullYear() -
        new Date(user.demographics.dateOfBirth).getFullYear();
      return {
        id: user.profileId,
        name: user.personalInfo.name,
        age: age,
        profession: user.professionalInfo.occupation,
        location: user.location.city,
        education: user.professionalInfo.education,
        community: user.demographics.community,
        income: user.professionalInfo.income,
        horoscope: user.demographics.horoscope || false,
        image:
          user.image ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      };
    });
    console.log(`Fetched ${profiles.length} profiles`);
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error.message);
    res
      .status(500)
      .json({ error: `Failed to fetch profiles: ${error.message}` });
  }
});

app.get('/api/user-profile', async (req, res) => {
  const { email, profileId } = req.query;
  if (!email && !profileId) {
    return res.status(400).json({ error: 'Email or Profile ID is required' });
  }
  try {
    let user;
    if (profileId) {
      user = await User.findOne({ profileId: profileId });
    } else if (email) {
      const normalizedEmail = email.toLowerCase();
      user = await User.findOne({ 'personalInfo.email': normalizedEmail });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.otp || !user.otp.verified) {
      return res.status(400).json({ error: 'Email not verified' });
    }
    const profileData = {
      profileId: user.profileId,
      name: user.personalInfo.name,
      email: user.personalInfo.email,
      mobile: user.personalInfo.mobile,
      gender: user.personalInfo.gender,
      lookingFor: user.personalInfo.lookingFor,
      dateOfBirth: user.demographics.dateOfBirth,
      height: user.demographics.height,
      maritalStatus: user.demographics.maritalStatus,
      religion: user.demographics.religion,
      community: user.demographics.community,
      motherTongue: user.demographics.motherTongue,
      education: user.professionalInfo.education,
      occupation: user.professionalInfo.occupation,
      income: user.professionalInfo.income,
      city: user.location.city,
      state: user.location.state,
      subscription: user.subscription,
      profileCreatedAt: user.profileCreatedAt,
      appVersion: user.appVersion,
    };
    res.status(200).json({
      message: 'Profile retrieved successfully',
      user: profileData,
    });
  } catch (error) {
    console.error('Error retrieving profile:', error.message);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

app.put('/api/update-profile', async (req, res) => {
  const { profileId, updatedData } = req.body;
  if (!profileId || !updatedData) {
    return res
      .status(400)
      .json({ error: 'Profile ID and updated data are required' });
  }
  try {
    const updateFields = {};
    if (updatedData.name) updateFields['personalInfo.name'] = updatedData.name;
    if (updatedData.height)
      updateFields['demographics.height'] = updatedData.height;
    if (updatedData.profession)
      updateFields['professionalInfo.occupation'] = updatedData.profession;
    if (updatedData.education)
      updateFields['professionalInfo.education'] = updatedData.education;
    if (updatedData.religion)
      updateFields['demographics.religion'] = updatedData.religion;
    if (updatedData.caste)
      updateFields['demographics.community'] = updatedData.caste;
    if (updatedData.language)
      updateFields['demographics.motherTongue'] = updatedData.language;
    if (updatedData.hobbies)
      updateFields['personalInfo.hobbies'] = updatedData.hobbies;
    if (updatedData.family) {
      if (updatedData.family.father)
        updateFields['familyInfo.father'] = updatedData.family.father;
      if (updatedData.family.mother)
        updateFields['familyInfo.mother'] = updatedData.family.mother;
    }
    const updatedUser = await User.findOneAndUpdate(
      { profileId: profileId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    console.log(`Profile updated for ${profileId}`);
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        profileId: updatedUser.profileId,
        name: updatedUser.personalInfo.name,
        email: updatedUser.personalInfo.email,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.post('/api/send-interest', async (req, res) => {
  const { userProfileId, interestedProfileId } = req.body;
  if (!userProfileId || !interestedProfileId) {
    console.warn(
      `Missing userProfileId or interestedProfileId: ${JSON.stringify(
        req.body
      )}`
    );
    return res
      .status(400)
      .json({ error: 'userProfileId and interestedProfileId are required' });
  }
  try {
    const interestedUser = await User.findOne({
      profileId: interestedProfileId,
    });
    if (!interestedUser) {
      console.warn(
        `Profile not found: interestedProfileId=${interestedProfileId}`
      );
      return res.status(404).json({ error: 'Interested profile not found' });
    }
    const result = await Interest.findOneAndUpdate(
      { userProfileId },
      {
        $addToSet: {
          interestedProfiles: { profileId: interestedProfileId },
        },
      },
      { upsert: true, new: true }
    );
    console.log(
      `Interest stored: userProfileId=${userProfileId}, interestedProfileId=${interestedProfileId}`
    );
    res.status(200).json({ message: 'Interest sent successfully' });
  } catch (error) {
    console.error('Error storing interest:', error.message);
    res.status(500).json({ error: 'Failed to send interest' });
  }
});

app.get('/api/interested-profiles', async (req, res) => {
  const { userProfileId } = req.query;
  if (!userProfileId) {
    console.warn('Missing userProfileId in query');
    return res.status(400).json({ error: 'userProfileId is required' });
  }
  try {
    const interestDoc = await Interest.findOne({ userProfileId });
    if (!interestDoc || !interestDoc.interestedProfiles.length) {
      return res.status(200).json([]);
    }
    const interestedProfileIds = interestDoc.interestedProfiles.map(
      (entry) => entry.profileId
    );
    const users = await User.find({
      profileId: { $in: interestedProfileIds },
      'otp.verified': true,
    }).select(
      'profileId personalInfo.name demographics.dateOfBirth professionalInfo.occupation location.city professionalInfo.education demographics.community professionalInfo.income demographics.horoscope image'
    );
    const profiles = users.map((user) => {
      const age =
        new Date().getFullYear() -
        new Date(user.demographics.dateOfBirth).getFullYear();
      return {
        id: user.profileId,
        name: user.personalInfo.name,
        age: age,
        profession: user.professionalInfo.occupation,
        location: user.location.city,
        education: user.professionalInfo.education,
        community: user.demographics.community,
        income: user.professionalInfo.income,
        horoscope: user.demographics.horoscope || false,
        image:
          user.image ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      };
    });
    console.log(
      `Fetched ${profiles.length} interested profiles for userProfileId=${userProfileId}`
    );
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching interested profiles:', error.message);
    res.status(500).json({ error: 'Failed to fetch interested profiles' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.delete('/api/remove-interest', async (req, res) => {
  const { userProfileId, interestedProfileId } = req.body;
  if (!userProfileId || !interestedProfileId) {
    console.warn(
      `Missing userProfileId or interestedProfileId: ${JSON.stringify(
        req.body
      )}`
    );
    return res
      .status(400)
      .json({ error: 'userProfileId and interestedProfileId are required' });
  }
  try {
    const result = await Interest.updateOne(
      { userProfileId },
      { $pull: { interestedProfiles: { profileId: interestedProfileId } } }
    );
    if (result.modifiedCount === 0) {
      console.warn(
        `No interest found to delete: userProfileId=${userProfileId}, interestedProfileId=${interestedProfileId}`
      );
      return res.status(404).json({ error: 'Interest not found' });
    }
    console.log(
      `Interest removed: userProfileId=${userProfileId}, interestedProfileId=${interestedProfileId}`
    );
    res.status(200).json({ message: 'Interest removed successfully' });
  } catch (error) {
    console.error('Error removing interest:', error.message);
    res.status(500).json({ error: 'Failed to remove interest' });
  }
});

app.delete('/api/remove-all-interests', async (req, res) => {
  const { userProfileId } = req.body;
  if (!userProfileId) {
    console.warn(`Missing userProfileId: ${JSON.stringify(req.body)}`);
    return res.status(400).json({ error: 'userProfileId is required' });
  }
  try {
    const result = await Interest.updateOne(
      { userProfileId },
      { $set: { interestedProfiles: [] } }
    );
    console.log(`Removed all interests for userProfileId=${userProfileId}`);
    res.status(200).json({
      message: 'All interests removed successfully',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error removing all interests:', error.message);
    res.status(500).json({ error: 'Failed to remove all interests' });
  }
});

app.get('/api/profiles/:id', async (req, res) => {
  try {
    const profileId = req.params.id;
    const user = await User.findOne({ profileId });
    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    let age = 'N/A';
    try {
      const dob = new Date(user.demographics.dateOfBirth);
      if (!isNaN(dob.getTime())) {
        age = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));
      }
    } catch (error) {
      console.error(`Invalid dateOfBirth for user ${user.profileId}:`, error);
    }
    const profile = {
      id: user.profileId,
      name: user.personalInfo.name || 'Unknown',
      age,
      profession: user.professionalInfo.occupation || 'Unknown',
      location: `${user.location.city}, ${user.location.state}` || 'Unknown',
      education: user.professionalInfo.education || 'Unknown',
      salary: user.professionalInfo.income || 'Not specified',
      height: user.demographics.height || 'Unknown',
      community: user.demographics.community || 'Unknown',
      motherTongue: user.demographics.motherTongue || 'Unknown',
      caste: user.demographics.community || 'Not specified',
      religion: user.demographics.religion || 'Not specified',
      hobbiesAndInterests:
        user.personalInfo.hobbiesAndInterests || 'Not specified',
      images: user.personalInfo.profileImage
        ? [user.personalInfo.profileImage]
        : ['https://via.placeholder.com/300'],
      about: user.personalInfo.about || 'No description provided.',
      family: {
        father: user.family?.father || 'Not specified',
        mother: user.family?.mother || 'Not specified',
        siblings: user.family?.siblings || 'None',
      },
      preferences: user.preferences || [
        'Age: Not specified',
        'Education: Not specified',
        'Profession: Not specified',
        'Location: Not specified',
      ],
    };
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// New endpoint: POST /api/pass-profile
app.post('/api/pass-profile', async (req, res) => {
  const { userProfileId, passedProfileId } = req.body;
  if (!userProfileId || !passedProfileId) {
    console.warn(
      `Missing userProfileId or passedProfileId: ${JSON.stringify(req.body)}`
    );
    return res
      .status(400)
      .json({ error: 'userProfileId and passedProfileId are required' });
  }
  try {
    const passedUser = await User.findOne({ profileId: passedProfileId });
    if (!passedUser) {
      console.warn(`Profile not found: passedProfileId=${passedProfileId}`);
      return res.status(404).json({ error: 'Passed profile not found' });
    }
    const result = await Interest.findOneAndUpdate(
      { userProfileId },
      {
        $addToSet: {
          passedProfiles: { profileId: passedProfileId },
        },
      },
      { upsert: true, new: true }
    );
    console.log(
      `Pass stored: userProfileId=${userProfileId}, passedProfileId=${passedProfileId}`
    );
    res.status(200).json({ message: 'Profile passed successfully' });
  } catch (error) {
    console.error('Error storing pass:', error.message);
    res.status(500).json({ error: 'Failed to pass profile' });
  }
});

// New endpoint: GET /api/passed-profiles
app.get('/api/passed-profiles', async (req, res) => {
  const { userProfileId } = req.query;
  if (!userProfileId) {
    console.warn('Missing userProfileId in query');
    return res.status(400).json({ error: 'userProfileId is required' });
  }
  try {
    const interestDoc = await Interest.findOne({ userProfileId });
    if (!interestDoc || !interestDoc.passedProfiles?.length) {
      return res.status(200).json([]);
    }
    const passedProfileIds = interestDoc.passedProfiles.map(
      (entry) => entry.profileId
    );
    const users = await User.find({
      profileId: { $in: passedProfileIds },
      'otp.verified': true,
    }).select(
      'profileId personalInfo.name demographics.dateOfBirth professionalInfo.occupation location.city professionalInfo.education demographics.community professionalInfo.income demographics.horoscope image'
    );
    const profiles = users.map((user) => {
      const age =
        new Date().getFullYear() -
        new Date(user.demographics.dateOfBirth).getFullYear();
      return {
        id: user.profileId,
        name: user.personalInfo.name,
        age: age,
        profession: user.professionalInfo.occupation,
        location: user.location.city,
        education: user.professionalInfo.education,
        community: user.demographics.community,
        income: user.professionalInfo.income,
        horoscope: user.demographics.horoscope || false,
        image:
          user.image ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      };
    });
    console.log(
      `Fetched ${profiles.length} passed profiles for userProfileId=${userProfileId}`
    );
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching passed profiles:', error.message);
    res.status(500).json({ error: 'Failed to fetch passed profiles' });
  }
});

// GET recent matches
app.get('/api/recent-matches', async (req, res) => {
  try {
    const { profileId, gender } = req.query;
    if (!profileId || !gender) {
      return res.status(400).json({ error: 'profileId and gender are required' });
    }
    const targetGender = gender.toLowerCase() === 'male' ? 'female' : 'male';
    console.log(targetGender);
    const query = {
      profileId: { $ne: profileId },
      'personalInfo.gender': targetGender,
    };
    console.log(query);
    const matches = await User.find(query)
      .select('profileId personalInfo.name demographics.dateOfBirth professionalInfo.occupation location.city personalInfo.profileImage')
      .sort({ profileCreatedAt: -1 })
      .limit(6);
    console.log(matches);
    const formattedMatches = matches.map((profile) => {
      let age = 'N/A';
      if (profile.demographics.dateOfBirth) {
        const dob = new Date(profile.demographics.dateOfBirth);
        const today = new Date();
        age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
      }
      return {
        id: profile.profileId,
        name: profile.personalInfo.name || 'N/A',
        age: age !== 'N/A' ? age : 'N/A',
        profession: profile.professionalInfo.occupation || 'N/A',
        location: profile.location.city || 'N/A',
        image: profile.personalInfo.profileImage || null,
      };
    });
    res.status(200).json({ matches: formattedMatches });
  } catch (error) {
    console.error('Error fetching recent matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET profile by ID
app.get('/api/profiles/:id', async (req, res) => {
  try {
    const profileId = req.params.id;
    const user = await User.findOne({ profileId });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    let age = 'N/A';
    try {
      const dob = new Date(user.demographics.dateOfBirth);
      if (!isNaN(dob.getTime())) {
        age = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));
      }
    } catch (error) {
      console.error(`Invalid dateOfBirth for user ${user.profileId}:`, error);
    }

    const profile = {
      id: user.profileId,
      name: user.personalInfo.name || 'Unknown',
      age,
      profession: user.professionalInfo.occupation || 'Unknown',
      location: `${user.location.city}, ${user.location.state}` || 'Unknown',
      education: user.professionalInfo.education || 'Unknown',
      salary: user.professionalInfo.income || 'Not specified',
      height: user.demographics.height || 'Unknown',
      community: user.demographics.community || 'Unknown',
      motherTongue: user.demographics.motherTongue || 'Unknown',
      images: user.personalInfo.profileImage
        ? [user.personalInfo.profileImage]
        : ['https://via.placeholder.com/300'],
      about: user.personalInfo.about || 'No description provided.',
      family: {
        father: user.family?.father || 'Not specified',
        mother: user.family?.mother || 'Not specified',
        siblings: user.family?.siblings || 'None',
      },
      preferences: user.preferences || [
        'Age: Not specified',
        'Education: Not specified',
        'Profession: Not specified',
        'Location: Not specified',
      ],
    };

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.post('/api/create-profile', async (req, res) => {
  const profileData = req.body;

  console.log('Received profile data:', profileData);

  // Validate required fields
  const requiredFields = [
    'personalInfo.email',
    'personalInfo.name',
    'personalInfo.mobile',
    'personalInfo.gender',
    'personalInfo.lookingFor',
    'demographics.dateOfBirth',
    'demographics.height',
    'demographics.maritalStatus',
    'demographics.religion',
    'demographics.community',
    'demographics.motherTongue',
    'professionalInfo.education',
    'professionalInfo.occupation',
    'professionalInfo.income',
    'location.city',
    'location.state',
    'credentials.password',
    'appVersion',
  ];

  const missingFields = requiredFields.filter((field) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.');
      return !profileData[section] || !profileData[section][key];
    } else {
      return !profileData[field];
    }
  });

  if (missingFields.length > 0) {
    console.warn('Missing required fields:', missingFields);
    return res
      .status(400)
      .json({ error: 'Missing required fields', missingFields });
  }

  try {
    const normalizedEmail = profileData.personalInfo.email.toLowerCase();
    const existingUser = await User.findOne({
      'personalInfo.email': normalizedEmail,
    });

    const hashedPassword = await bcrypt.hash(
      profileData.credentials.password,
      10
    );

    if (existingUser) {
      if (!existingUser.otp?.verified) {
        console.warn(`Email not verified for ${normalizedEmail}`);
        return res.status(400).json({ error: 'Email not verified' });
      }

      // Preserve existing subscription history
      const updatedSubscription = {
        current:
          profileData.subscription?.current ||
          existingUser.subscription?.current ||
          'free',
        details:
          profileData.subscription?.details ||
          existingUser.subscription?.details ||
          {},
        history: existingUser.subscription?.history || [],
      };

      await User.updateOne(
        { 'personalInfo.email': normalizedEmail },
        {
          $set: {
            profileId: existingUser.profileId || `KM${Date.now()}`,
            personalInfo: {
              ...profileData.personalInfo,
              email: normalizedEmail,
            },
            demographics: profileData.demographics,
            professionalInfo: profileData.professionalInfo,
            location: profileData.location,
            credentials: {
              ...profileData.credentials,
              password: hashedPassword,
            },
            subscription: updatedSubscription,
            profileCreatedAt: new Date(),
            appVersion: profileData.appVersion,
          },
        }
      );

      console.log('Profile updated:', {
        profileId: existingUser.profileId,
        email: normalizedEmail,
        subscription: updatedSubscription.current,
      });

      return res.status(201).json({
        message: 'Profile updated successfully',
        profileId: existingUser.profileId,
        email: normalizedEmail,
        subscription: updatedSubscription.current,
      });
    } else {
      // Create new user
      const newUser = new User({
        ...profileData,
        personalInfo: { ...profileData.personalInfo, email: normalizedEmail },
        credentials: { ...profileData.credentials, password: hashedPassword },
        subscription: {
          current: profileData.subscription?.current || 'free',
          details: profileData.subscription?.details || {},
          history: [],
        },
        profileCreatedAt: new Date(),
      });

      await newUser.save();

      console.log('Profile created:', {
        profileId: newUser.profileId,
        email: newUser.personalInfo.email,
        subscription: newUser.subscription.current,
      });

      return res.status(201).json({
        message: 'Profile created successfully',
        profileId: newUser.profileId,
        email: newUser.personalInfo.email,
        subscription: newUser.subscription.current,
      });
    }
  } catch (error) {
    console.error('Error creating profile:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    return res
      .status(500)
      .json({ error: `Failed to create profile: ${error.message}` });
  }
});

// New endpoint: GET /api/user/stats
// New endpoint: GET /api/user/stats
app.get('/api/user/stats', async (req, res) => {
  try {
    const { profileId } = req.query;
    if (!profileId) {
      console.warn('Missing profileId in query');
      return res.status(400).json({ error: 'profileId is required' });
    }

    // Fetch profile views
    const user = await User.findOne({ profileId }).select('profileViews');
    if (!user) {
      console.warn(`User not found for profileId: ${profileId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    const profileViews = user.profileViews || 0;

    // Fetch interests received
    const interests = await Interest.find({ 'interestedProfiles.profileId': profileId });
    const interestsReceived = interests.length;

    // Fetch messages received
    const messages = await Message.find({ recipientProfileId: profileId });
    const messagesCount = messages.length;

    res.status(200).json({
      profileViews,
      interestsReceived,
      messages: messagesCount,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});




// Start server
const startServer = async () => {
  await connectMongoDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};




startServer();
