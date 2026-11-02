const CodingProfile = require('../models/CodingProfile');
const { awardXP, awardTokens, checkBadgeUnlocks } = require('../utils/rewardEngine');
const { recordActivity } = require('../utils/streakEngine');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.getCodingProfiles = async (req, res, next) => {
  try {
    const items = await CodingProfile.find({ user: req.user.id }).sort({ createdAt: -1 });
    return successResponse(res, items);
  } catch (err) { next(err); }
};

exports.getCodingProfile = async (req, res, next) => {
  try {
    const item = await CodingProfile.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Coding profile not found', 404);
    return successResponse(res, item);
  } catch (err) { next(err); }
};

exports.createCodingProfile = async (req, res, next) => {
  try {
    const item = await CodingProfile.create({ ...req.body, user: req.user.id });
    await Promise.all([
      awardXP(req.user.id, 'add_coding_profile', { profileId: item._id }),
      awardTokens(req.user.id, 'add_coding_profile', { profileId: item._id }),
      recordActivity(req.user.id, 'add_coding_profile'),
      checkBadgeUnlocks(req.user.id),
    ]);
    return successResponse(res, item, 'Coding profile added', 201);
  } catch (err) { next(err); }
};

exports.updateCodingProfile = async (req, res, next) => {
  try {
    req.body.lastUpdated = new Date();
    const item = await CodingProfile.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return errorResponse(res, 'Coding profile not found', 404);
    return successResponse(res, item, 'Coding profile updated');
  } catch (err) { next(err); }
};

exports.deleteCodingProfile = async (req, res, next) => {
  try {
    const item = await CodingProfile.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Coding profile not found', 404);
    return successResponse(res, null, 'Coding profile deleted');
  } catch (err) { next(err); }
};
