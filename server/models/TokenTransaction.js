const mongoose = require('mongoose');

const tokenTransactionSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    type: {
      type:     String,
      enum:     ['earned', 'spent', 'refunded'],
      required: true,
    },
    amount: {
      type:     Number,
      required: true,
    },
    reason: {
      type:     String,
      required: true,
    },
    activityType:  { type: String },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'StoreOrder',
    },
    balanceBefore: { type: Number },
    balanceAfter:  { type: Number },
  },
  { timestamps: true }
);

tokenTransactionSchema.index({ user: 1 });
tokenTransactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('TokenTransaction', tokenTransactionSchema);
