const mongoose = require('mongoose');

const storeOrderSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    product: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'StoreProduct',
      required: true,
    },
    tokensSpent: {
      type:     Number,
      required: true,
    },
    status: {
      type:    String,
      enum:    ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    deliveryInfo: {
      name:    { type: String },
      address: { type: String },
      city:    { type: String },
      state:   { type: String },
      pincode: { type: String },
      phone:   { type: String },
    },
    digitalDelivery: {
      activated: { type: Boolean, default: false },
      details:   { type: String },
    },
    notes: { type: String },
  },
  { timestamps: true }
);

storeOrderSchema.index({ user: 1 });
storeOrderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('StoreOrder', storeOrderSchema);
