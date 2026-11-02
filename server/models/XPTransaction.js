const mongoose = require('mongoose');

const xpTransactionSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    amount: {
      type:     Number,
      required: true,
    },
    activityType: {
      type:     String,
      required: true,
    },
    description:   { type: String },
    metadata:      { type: mongoose.Schema.Types.Mixed },
    balanceBefore: { type: Number },
    balanceAfter:  { type: Number },
  },
  { timestamps: true }
);

xpTransactionSchema.index({ user: 1 });
xpTransactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('XPTransaction', xpTransactionSchema);
