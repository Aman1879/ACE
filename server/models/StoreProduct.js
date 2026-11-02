const mongoose = require('mongoose');

const storeProductSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Product name is required'],
      trim:     true,
    },
    description: { type: String },
    category: {
      type:     String,
      enum:     ['Physical', 'Digital', 'Badge', 'Theme', 'Premium'],
      required: [true, 'Category is required'],
    },
    image:      { type: String },
    tokenPrice: {
      type:     Number,
      required: [true, 'Token price is required'],
      min:      [0, 'Price cannot be negative'],
    },
    isAvailable: { type: Boolean, default: true },
    stock:       { type: Number, default: -1 }, // -1 = unlimited
    details:     { type: String },
    tags:        { type: [String], default: [] },
    isFeatured:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StoreProduct', storeProductSchema);
