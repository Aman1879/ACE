const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    type: {
      type:     String,
      enum:     ['xp_earned', 'token_earned', 'badge_unlocked', 'streak_milestone', 'goal_completed', 'order_success', 'welcome', 'system'],
      required: true,
    },
    title: {
      type:     String,
      required: true,
    },
    message: {
      type:     String,
      required: true,
    },
    isRead:  { type: Boolean, default: false },
    data:    { type: mongoose.Schema.Types.Mixed },
    icon:    { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
