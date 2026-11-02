const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    title: {
      type:     String,
      required: [true, 'Achievement title is required'],
      trim:     true,
    },
    description:  { type: String },
    category: {
      type: String,
      enum: ['Hackathon', 'Competition', 'Academic', 'Award', 'Scholarship', 'Leadership', 'Research', 'Sports', 'Other'],
    },
    date:         { type: Date },
    organization: { type: String, trim: true },
    position:     { type: String, trim: true }, // e.g. "1st Place"
    proofUrl:     { type: String, trim: true },
    isPublic:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

achievementSchema.index({ user: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
