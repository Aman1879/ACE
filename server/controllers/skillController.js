const Skill = require('../models/Skill');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.getSkills = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 50;
    const skip   = (page - 1) * limit;
    const filter = { user: req.user.id };
    if (req.query.category)    filter.category    = req.query.category;
    if (req.query.proficiency) filter.proficiency = req.query.proficiency;

    const [items, total] = await Promise.all([
      Skill.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Skill.countDocuments(filter),
    ]);
    return paginatedResponse(res, items, total, page, limit);
  } catch (err) { next(err); }
};

exports.getSkill = async (req, res, next) => {
  try {
    const item = await Skill.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Skill not found', 404);
    return successResponse(res, item);
  } catch (err) { next(err); }
};

exports.createSkill = async (req, res, next) => {
  try {
    const item = await Skill.create({ ...req.body, user: req.user.id });
    return successResponse(res, item, 'Skill added', 201);
  } catch (err) { next(err); }
};

exports.updateSkill = async (req, res, next) => {
  try {
    const item = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return errorResponse(res, 'Skill not found', 404);
    return successResponse(res, item, 'Skill updated');
  } catch (err) { next(err); }
};

exports.deleteSkill = async (req, res, next) => {
  try {
    const item = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Skill not found', 404);
    return successResponse(res, null, 'Skill deleted');
  } catch (err) { next(err); }
};
