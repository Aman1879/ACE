const Notification = require('../models/Notification');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// ─── GET /api/notifications ─────────────────────────────────────────────────
exports.getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ user: req.user.id }),
    ]);

    return paginatedResponse(res, notifications, total, page, limit);
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/notifications/unread-count ────────────────────────────────────
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ user: req.user.id, isRead: false });
    return successResponse(res, { count });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/notifications/:id/read ────────────────────────────────────────
exports.markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return errorResponse(res, 'Notification not found', 404);
    return successResponse(res, notification, 'Marked as read');
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/notifications/read-all ────────────────────────────────────────
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    return successResponse(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/notifications/:id ──────────────────────────────────────────
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!notification) return errorResponse(res, 'Notification not found', 404);
    return successResponse(res, null, 'Notification deleted');
  } catch (err) {
    next(err);
  }
};

