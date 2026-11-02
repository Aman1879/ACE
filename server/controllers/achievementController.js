const Achievement = require('../models/Achievement');
const { awardXP, awardTokens, checkBadgeUnlocks } = require('../utils/rewardEngine');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.getAchievements = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const skip   = (page - 1) * limit;
    const filter = { user: req.user.id };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search)   filter.title = { $regex: req.query.search, $options: 'i' };

    const [items, total] = await Promise.all([
      Achievement.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Achievement.countDocuments(filter),
    ]);
    return paginatedResponse(res, items, total, page, limit);
  } catch (err) { next(err); }
};

exports.getAchievement = async (req, res, next) => {
  try {
    const item = await Achievement.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Achievement not found', 404);
    return successResponse(res, item);
  } catch (err) { next(err); }
};

exports.createAchievement = async (req, res, next) => {
  try {
    const item = await Achievement.create({ ...req.body, user: req.user.id });
    await Promise.all([
      awardXP(req.user.id, 'add_achievement', { achievementId: item._id }),
      awardTokens(req.user.id, 'add_achievement', { achievementId: item._id }),
      checkBadgeUnlocks(req.user.id),
    ]);
    return successResponse(res, item, 'Achievement added', 201);
  } catch (err) { next(err); }
};

exports.updateAchievement = async (req, res, next) => {
  try {
    const item = await Achievement.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return errorResponse(res, 'Achievement not found', 404);
    return successResponse(res, item, 'Achievement updated');
  } catch (err) { next(err); }
};

exports.deleteAchievement = async (req, res, next) => {
  try {
    const item = await Achievement.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Achievement not found', 404);
    return successResponse(res, null, 'Achievement deleted');
  } catch (err) { next(err); }
};
