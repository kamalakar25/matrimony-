const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profileId: { type: String, unique: true, default: () => `KM${Date.now()}` },
  personalInfo: {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    lastActive: { type: Date},
   gender: { type: String, required: true, enum: ['male', 'female'] },
    lookingFor: { type: String, required: false },
    mobile: { type: String, required: false }, // Made optional for OTP storage
  },
  demographics: {
    dateOfBirth: { type: String, required: false },
    height: { type: String, required: false },
    maritalStatus: { type: String, required: false },
    religion: { type: String, required: false },
    community: { type: String, required: false },
    motherTongue: { type: String, required: false },
  },
  professionalInfo: {
    education: { type: String, required: false },
    occupation: { type: String, required: false },
    income: { type: String, required: false },
  },
  location: {
    city: { type: String, required: false },
    state: { type: String, required: false },
  },
  credentials: {
    password: { type: String, required: false },
    rememberMe: { type: Boolean, default: false },
  },
  subscription: {
      current: {
        type: String,
        enum: ["free", "premium", "premium plus"],
        
      },
      details: {
        startDate: { type: Date },
        expiryDate: { type: Date },
        paymentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Payment",
        },
        autoRenew: { type: Boolean, default: false },
      },
      history: [
        {
          type: {
            type: String,
            enum: ["free", "premium", "premium plus"],
          },
          startDate: { type: Date },
          expiryDate: { type: Date },
          paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
          },
          status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active",
          },
          upgradedAt: { type: Date, default: Date.now },
        },
      ],
    },
  profileCreatedAt: { type: Date, default: Date.now },
  appVersion: { type: String, required: false },
  otp: {
    code: { type: String },
    expiresAt: { type: Date },
    verified: { type: Boolean, default: false },
  },
  profileViews: { type: Number, default: 0 }, // New field to track profile views
});

// Enforce required fields during full profile creation
userSchema.pre('save', function(next) {
  if (!this.isNew) {
    // Skip validation for updates (e.g., OTP storage)
    return next();
  }
  // Enforce required fields for new profile creation
  if (!this.personalInfo.name) return next(new Error('Name is required'));
  if (!this.personalInfo.mobile) return next(new Error('Mobile number is required'));
  if (!this.personalInfo.gender) return next(new Error('Gender is required'));
  if (!this.personalInfo.lookingFor) return next(new Error('LookingFor is required'));
  if (!this.demographics.dateOfBirth) return next(new Error('Date of birth is required'));
  if (!this.demographics.height) return next(new Error('Height is required'));
  if (!this.demographics.maritalStatus) return next(new Error('Marital status is required'));
  if (!this.demographics.religion) return next(new Error('Religion is required'));
  if (!this.demographics.community) return next(new Error('Community is required'));
  if (!this.demographics.motherTongue) return next(new Error('Mother tongue is required'));
  if (!this.professionalInfo.education) return next(new Error('Education is required'));
  if (!this.professionalInfo.occupation) return next(new Error('Occupation is required'));
  if (!this.professionalInfo.income) return next(new Error('Income is required'));
  if (!this.location.city) return next(new Error('City is required'));
  if (!this.location.state) return next(new Error('State is required'));
  if (!this.credentials.password) return next(new Error('Password is required'));
  if (!this.appVersion) return next(new Error('App version is required'));
  next();
});

module.exports = mongoose.model('User', userSchema);