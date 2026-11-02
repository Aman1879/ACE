const Resume = require('../models/Resume');
const User   = require('../models/User');
const { awardXP } = require('../utils/rewardEngine');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ─── GET /api/resume ─────────────────────────────────────────────────────────
exports.getResume = async (req, res, next) => {
  try {
    let resume = await Resume.findOne({ user: req.user.id });
    if (!resume) {
      // Auto-create a blank resume seeded with user data
      const user = await User.findById(req.user.id);
      resume = await Resume.create({
        user: req.user.id,
        personalInfo: { name: user.name, email: user.email },
      });
    }
    return successResponse(res, resume, 'Resume fetched');
  } catch (err) { next(err); }
};

// ─── PUT /api/resume ─────────────────────────────────────────────────────────
exports.updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { user: req.user.id },
      { ...req.body, user: req.user.id },
      { new: true, runValidators: true, upsert: true }
    );
    await awardXP(req.user.id, 'update_resume');
    return successResponse(res, resume, 'Resume updated');
  } catch (err) { next(err); }
};

// ─── POST /api/resume/generate-pdf ───────────────────────────────────────────
exports.generatePDF = async (req, res, next) => {
  try {
    return successResponse(
      res,
      null,
      'PDF generation requires a frontend library (e.g. react-pdf or jsPDF). Use the resume data from GET /api/resume to render client-side.'
    );
  } catch (err) { next(err); }
};
