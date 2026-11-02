const Notification = require('../models/Notification');

const TYPE_ICONS = {
  xp_earned:        '⭐',
  token_earned:     '🪙',
  badge_unlocked:   '🏅',
  streak_milestone: '🔥',
  goal_completed:   '✅',
  order_success:    '🎁',
  welcome:          '👋',
  system:           '🔔',
};

/**
 * Create an in-app notification for a user.
 *
 * @param {string} userId
 * @param {string} type    – one of the enum values
 * @param {string} title
 * @param {string} message
 * @param {object} data    – optional extra payload
 */
exports.createNotification = async (userId, type, title, message, data = {}) => {
  try {
    const notification = await Notification.create({
      user:    userId,
      type,
      title,
      message,
      data,
      icon:    TYPE_ICONS[type] || '🔔',
    });
    return notification;
  } catch (err) {
    // Non-fatal – log and continue
    console.error('createNotification error:', err.message);
    return null;
  }
};
