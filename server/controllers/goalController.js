const Goal    = require('../models/Goal');
const { awardXP, awardTokens, checkBadgeUnlocks } = require('../utils/rewardEngine');
const { recordActivity } = require('../utils/streakEngine');
const { createNotification }  = require('../utils/notificationService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.getGoals = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const skip   = (page - 1) * limit;
    const filter = { user: req.user.id };
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type)     filter.type     = req.query.type;

    const [items, total] = await Promise.all([
      Goal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Goal.countDocuments(filter),
    ]);
    return paginatedResponse(res, items, total, page, limit);
  } catch (err) { next(err); }
};

exports.getGoal = async (req, res, next) => {
  try {
    const item = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Goal not found', 404);
    return successResponse(res, item);
  } catch (err) { next(err); }
};

exports.createGoal = async (req, res, next) => {
  try {
    const item = await Goal.create({ ...req.body, user: req.user.id });
    return successResponse(res, item, 'Goal created', 201);
  } catch (err) { next(err); }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const item = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return errorResponse(res, 'Goal not found', 404);
    return successResponse(res, item, 'Goal updated');
  } catch (err) { next(err); }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const item = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Goal not found', 404);
    return successResponse(res, null, 'Goal deleted');
  } catch (err) { next(err); }
};

// ─── POST /api/goals/:id/complete ────────────────────────────────────────────
exports.completeGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) return errorResponse(res, 'Goal not found', 404);
    if (goal.status === 'Completed') {
      return errorResponse(res, 'Goal is already completed', 400);
    }

    goal.status      = 'Completed';
    goal.progress    = 100;
    goal.completedAt = new Date();
    await goal.save();

    await Promise.all([
      awardXP(req.user.id, 'complete_goal', { goalId: goal._id }),
      awardTokens(req.user.id, 'complete_goal', { goalId: goal._id }),
      recordActivity(req.user.id, 'complete_goal'),
      checkBadgeUnlocks(req.user.id),
      createNotification(
        req.user.id,
        'goal_completed',
        '🎯 Goal Completed!',
        `You completed: "${goal.title}"`,
        { goalId: goal._id }
      ),
    ]);

    return successResponse(res, goal, 'Goal completed! Rewards earned.');
  } catch (err) { next(err); }
};
