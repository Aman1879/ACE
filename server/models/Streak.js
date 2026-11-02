const mongoose = require('mongoose');

const activityLogEntrySchema = new mongoose.Schema(
  {
    date:       { type: String }, // YYYY-MM-DD
    activities: { type: [String], default: [] },
  },
  { _id: false }
);

const milestoneSchema = new mongoose.Schema(
  {
    days:       { type: Number },
    unlockedAt: { type: Date },
    badgeId:    { type: String },
  },
  { _id: false }
);

const streakSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,
    },
    currentStreak:    { type: Number, default: 0 },
    longestStreak:    { type: Number, default: 0 },
    lastActivityDate: { type: String }, // YYYY-MM-DD string
    totalActiveDays:  { type: Number, default: 0 },
    activityLog:      { type: [activityLogEntrySchema], default: [] },
    milestones:       { type: [milestoneSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Streak', streakSchema);
