const mongoose = require('mongoose');

const codingProfileSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    platform: {
      type:     String,
      required: [true, 'Platform is required'],
      enum:     ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'CodeChef', 'Codeforces', 'GitHub', 'Other'],
    },
    username: {
      type:     String,
      required: [true, 'Platform username is required'],
      trim:     true,
    },
    profileUrl:    { type: String, trim: true },
    totalSolved:   { type: Number, default: 0 },
    easySolved:    { type: Number, default: 0 },
    mediumSolved:  { type: Number, default: 0 },
    hardSolved:    { type: Number, default: 0 },
    contestRating: { type: Number },
    globalRank:    { type: String },
    lastUpdated:   { type: Date, default: Date.now },
    notes:         { type: String },
  },
  { timestamps: true }
);

codingProfileSchema.index({ user: 1 });

module.exports = mongoose.model('CodingProfile', codingProfileSchema);
