const User    = require('../models/User');
const Profile = require('../models/Profile');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { awardXP, awardTokens } = require('../utils/rewardEngine');

// ─── Profile completion fields + weights ─────────────────────────────────────
const COMPLETION_FIELDS = [
  'avatar', 'bio', 'college', 'degree', 'branch', 'graduationYear', 'github', 'linkedin',
];
// 9th field: skills.length > 0
const TOTAL_FIELDS = 9;
const FIELD_WEIGHT = Math.floor(100 / TOTAL_FIELDS); // ~11%

const calcCompletion = (profile) => {
  let filled = 0;
  for (const field of COMPLETION_FIELDS) {
    if (profile[field]) filled++;
  }
  if (profile.skills && profile.skills.length > 0) filled++;
  const percent = Math.min(100, Math.round((filled / TOTAL_FIELDS) * 100));
  return { percent, filled };
};

// ─── GET /api/profile ────────────────────────────────────────────────────────
exports.getMyProfile = async (req, res, next) => {
  try {
    const user    = await User.findById(req.user.id);
    const profile = await Profile.findOne({ user: req.user.id });
    return successResponse(res, { user, profile }, 'Profile fetched');
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/profile ────────────────────────────────────────────────────────
exports.updateMyProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'bio', 'phone', 'college', 'degree', 'branch', 'graduationYear',
      'skills', 'careerInterests', 'github', 'linkedin', 'portfolio', 'twitter',
      'timezone', 'isPublic', 'location',
      'showProjects', 'showCertificates', 'showAchievements',
      'showCoding', 'showInternships', 'showResume',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    // Also allow name update on User model
    if (req.body.name) {
      await User.findByIdAndUpdate(req.user.id, { name: req.body.name });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      updates,
      { new: true, runValidators: true, upsert: true }
    );

    const { percent } = calcCompletion(profile);
    const wasComplete  = (await User.findById(req.user.id)).profileCompleted;

    await User.findByIdAndUpdate(req.user.id, {
      profileCompletionPercent: percent,
      profileCompleted:         percent === 100,
    });

    // Award XP on first-time 100% completion
    if (percent === 100 && !wasComplete) {
      await awardXP(req.user.id, 'complete_profile');
      await awardTokens(req.user.id, 'complete_profile');
    }

    const user = await User.findById(req.user.id);
    return successResponse(res, { user, profile }, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/profile/avatar ────────────────────────────────────────────────
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const fileUrl = req.file.path || req.file.location || req.file.filename;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { avatar: fileUrl },
      { new: true, upsert: true }
    );

    // Recalculate completion
    const { percent } = calcCompletion(profile);
    await User.findByIdAndUpdate(req.user.id, {
      profileCompletionPercent: percent,
      profileCompleted:         percent === 100,
    });

    return successResponse(res, { avatar: fileUrl }, 'Avatar uploaded successfully');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/profile/completion ─────────────────────────────────────────────
exports.getProfileCompletion = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return successResponse(res, { percent: 0, filled: 0, total: TOTAL_FIELDS }, 'Profile completion');
    }
    const { percent, filled } = calcCompletion(profile);
    return successResponse(res, { percent, filled, total: TOTAL_FIELDS }, 'Profile completion');
  } catch (err) {
    next(err);
  }
};
