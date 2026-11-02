const PlacementApplication = require('../models/PlacementApplication');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.getPlacements = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const skip   = (page - 1) * limit;
    const filter = { user: req.user.id };
    if (req.query.status)  filter.status  = req.query.status;
    if (req.query.jobType) filter.jobType = req.query.jobType;
    if (req.query.search)  filter.company = { $regex: req.query.search, $options: 'i' };

    const [items, total] = await Promise.all([
      PlacementApplication.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      PlacementApplication.countDocuments(filter),
    ]);
    return paginatedResponse(res, items, total, page, limit);
  } catch (err) { next(err); }
};

exports.getPlacement = async (req, res, next) => {
  try {
    const item = await PlacementApplication.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Application not found', 404);
    return successResponse(res, item);
  } catch (err) { next(err); }
};

exports.createPlacement = async (req, res, next) => {
  try {
    const body = { ...req.body, user: req.user.id };
    // Add initial timeline entry
    body.timeline = [{ status: body.status || 'Applied', date: new Date(), notes: 'Application created' }];
    const item = await PlacementApplication.create(body);
    return successResponse(res, item, 'Application saved', 201);
  } catch (err) { next(err); }
};

exports.updatePlacement = async (req, res, next) => {
  try {
    const existing = await PlacementApplication.findOne({ _id: req.params.id, user: req.user.id });
    if (!existing) return errorResponse(res, 'Application not found', 404);

    // If status is changing, add to timeline
    const updates = { ...req.body };
    if (req.body.status && req.body.status !== existing.status) {
      updates.$push = {
        timeline: {
          status: req.body.status,
          date:   new Date(),
          notes:  req.body.timelineNote || '',
        },
      };
      delete updates.timeline; // don't override whole array
    }

    const item = await PlacementApplication.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    return successResponse(res, item, 'Application updated');
  } catch (err) { next(err); }
};

exports.deletePlacement = async (req, res, next) => {
  try {
    const item = await PlacementApplication.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Application not found', 404);
    return successResponse(res, null, 'Application deleted');
  } catch (err) { next(err); }
};
