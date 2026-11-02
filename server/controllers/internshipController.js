const Internship = require('../models/Internship');
const { awardXP } = require('../utils/rewardEngine');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.getInternships = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const skip   = (page - 1) * limit;
    const filter = { user: req.user.id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type)   filter.type   = req.query.type;

    const [items, total] = await Promise.all([
      Internship.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Internship.countDocuments(filter),
    ]);
    return paginatedResponse(res, items, total, page, limit);
  } catch (err) { next(err); }
};

exports.getInternship = async (req, res, next) => {
  try {
    const item = await Internship.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Internship not found', 404);
    return successResponse(res, item);
  } catch (err) { next(err); }
};

exports.createInternship = async (req, res, next) => {
  try {
    const item = await Internship.create({ ...req.body, user: req.user.id });
    await awardXP(req.user.id, 'add_internship', { internshipId: item._id });
    return successResponse(res, item, 'Internship added', 201);
  } catch (err) { next(err); }
};

exports.updateInternship = async (req, res, next) => {
  try {
    const item = await Internship.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return errorResponse(res, 'Internship not found', 404);
    return successResponse(res, item, 'Internship updated');
  } catch (err) { next(err); }
};

exports.deleteInternship = async (req, res, next) => {
  try {
    const item = await Internship.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Internship not found', 404);
    return successResponse(res, null, 'Internship deleted');
  } catch (err) { next(err); }
};
