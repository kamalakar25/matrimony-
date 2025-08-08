const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportingUserId: {
    type: String,
    required: true,
  },
  reportedProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  reason: {
    type: String,
    required: true,
    enum: ['spam', 'inappropriate-content', 'fake-profile', 'harassment', 'other'],
  },
  category: {
    type: String,
    required: true,
    enum: ['message', 'profile', 'behaviour', 'photos'],
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);