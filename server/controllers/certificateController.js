const Certificate = require('../models/Certificate');
const { awardXP, awardTokens, checkBadgeUnlocks } = require('../utils/rewardEngine');
const { recordActivity } = require('../utils/streakEngine');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.getCertificates = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const skip   = (page - 1) * limit;
    const filter = { user: req.user.id };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search)   filter.name = { $regex: req.query.search, $options: 'i' };

    const [certs, total] = await Promise.all([
      Certificate.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Certificate.countDocuments(filter),
    ]);
    return paginatedResponse(res, certs, total, page, limit);
  } catch (err) { next(err); }
};

exports.getCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findOne({ _id: req.params.id, user: req.user.id });
    if (!cert) return errorResponse(res, 'Certificate not found', 404);
    return successResponse(res, cert);
  } catch (err) { next(err); }
};

exports.createCertificate = async (req, res, next) => {
  try {
    // If file uploaded (e.g. certificate PDF)
    if (req.file) {
      req.body.fileUrl = req.file.path || req.file.location || req.file.filename;
    }
    const cert = await Certificate.create({ ...req.body, user: req.user.id });

    await Promise.all([
      awardXP(req.user.id, 'add_certificate', { certId: cert._id }),
      awardTokens(req.user.id, 'add_certificate', { certId: cert._id }),
      recordActivity(req.user.id, 'add_certificate'),
      checkBadgeUnlocks(req.user.id),
    ]);

    return successResponse(res, cert, 'Certificate added', 201);
  } catch (err) { next(err); }
};

exports.updateCertificate = async (req, res, next) => {
  try {
    if (req.file) req.body.fileUrl = req.file.path || req.file.location || req.file.filename;
    const cert = await Certificate.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!cert) return errorResponse(res, 'Certificate not found', 404);
    return successResponse(res, cert, 'Certificate updated');
  } catch (err) { next(err); }
};

exports.deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!cert) return errorResponse(res, 'Certificate not found', 404);
    return successResponse(res, null, 'Certificate deleted');
  } catch (err) { next(err); }
};
