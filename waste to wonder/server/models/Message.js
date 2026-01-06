const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['producer', 'consumer'],
    required: true
  },
  messageText: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'quick-action'],
    default: 'text'
  },
  quickActionType: {
    type: String,
    enum: ['confirm-pickup', 'review-price', 'custom'],
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

messageSchema.index({ transactionId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
