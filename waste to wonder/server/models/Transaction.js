const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  producerId: {
    type: String,
    required: true
  },
  producerName: {
    type: String,
    required: true
  },
  consumerId: {
    type: String,
    required: true
  },
  consumerName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  pickupTime: {
    type: Date,
    default: null
  },
  agreedPrice: {
    type: Number,
    default: null
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCountProducer: {
    type: Number,
    default: 0
  },
  unreadCountConsumer: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

transactionSchema.index({ producerId: 1, lastMessageAt: -1 });
transactionSchema.index({ consumerId: 1, lastMessageAt: -1 });

transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
