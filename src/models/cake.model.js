const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cake name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    trim: true
  },
  flavors: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
cakeSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Cake', cakeSchema);