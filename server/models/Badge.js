const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    slug: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    name: {
      type:     String,
      required: true,
    },
    description: { type: String },
    icon:        { type: String }, // emoji or icon name
    category: {
      type: String,
      enum: ['streak', 'projects', 'certificates', 'achievements', 'goals', 'special', 'platform'],
    },
    condition: {
      type:  { type: String },
      value: { type: Number },
    },
    rarity: {
      type:    String,
      enum:    ['Common', 'Rare', 'Epic', 'Legendary'],
      default: 'Common',
    },
    tokenReward: { type: Number, default: 0 },
    xpReward:    { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Badge', badgeSchema);
