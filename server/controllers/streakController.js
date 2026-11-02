const Streak = require('../models/Streak');
const { recordActivity, hasActivityToday, checkAndSyncStreak } = require('../utils/streakEngine');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ─── GET /api/streak ─────────────────────────────────────────────────────────
exports.getStreak = async (req, res, next) => {
  try {
    const streak = await checkAndSyncStreak(req.user.id, true);
    const activeToday = await hasActivityToday(req.user.id);
    return successResponse(res, { ...streak.toObject(), activeToday }, 'Streak data fetched');
  } catch (err) { next(err); }
};

// ─── POST /api/streak/activity ───────────────────────────────────────────────
exports.recordStreakActivity = async (req, res, next) => {
  try {
    const activityName = req.body.activity || req.body.activityType || 'manual';
    const result = await recordActivity(req.user.id, activityName);
    return successResponse(res, result, result.streakUpdated ? 'Streak updated!' : 'Activity logged (streak already updated today)');
  } catch (err) { next(err); }
};
