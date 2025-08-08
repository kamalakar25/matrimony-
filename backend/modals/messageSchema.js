const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderProfileId: {
    type: String,
    required: true,
    ref: 'User',
  },
  recipientProfileId: {
    type: String,
    required: true,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Message', messageSchema);