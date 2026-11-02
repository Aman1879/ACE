const mongoose = require('mongoose');

const rewardRuleSchema = new mongoose.Schema(
  {
    activityType: {
      type:     String,
      required: true,
      unique:   true,
    },
    description:     { type: String },
    xpAmount:        { type: Number, default: 0 },
    tokenAmount:     { type: Number, default: 0 },
    isActive:        { type: Boolean, default: true },
    cooldownMinutes: { type: Number, default: 0 },  // 0 = no cooldown
    maxPerDay:       { type: Number, default: -1 },  // -1 = unlimited
  },
  { timestamps: true }
);

module.exports = mongoose.model('RewardRule', rewardRuleSchema);
