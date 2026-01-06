const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  clerkId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Organic', 'Plastic', 'Paper', 'Glass', 'E-Waste', 'Textiles']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['Kilograms (kg)', 'Grams (g)', 'Tons (t)', 'Liters (l)', 'Pieces (pcs)', 'Bags']
  },
  pricing: {
    type: String,
    required: true,
    enum: ['negotiable', 'fixed']
  },
  fixedPrice: {
    type: Number,
    min: 0
  },
  photoUrl: {
    type: String
  },
  location: {
    city: {
      type: String,
      required: true
    },
    area: {
      type: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'completed'],
    default: 'available'
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

// Update the updatedAt field before saving
listingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
