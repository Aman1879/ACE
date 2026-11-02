const Project  = require('../models/Project');
const { awardXP, awardTokens, checkBadgeUnlocks } = require('../utils/rewardEngine');
const { recordActivity } = require('../utils/streakEngine');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// ─── GET /api/projects ───────────────────────────────────────────────────────
exports.getProjects = async (req, res, next) => {
  try {
    const page     = parseInt(req.query.page)  || 1;
    const limit    = parseInt(req.query.limit) || 10;
    const skip     = (page - 1) * limit;
    const filter   = { user: req.user.id };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.isPublic !== undefined) filter.isPublic = req.query.isPublic === 'true';
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);

    return paginatedResponse(res, projects, total, page, limit);
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/projects/:id ───────────────────────────────────────────────────
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
    if (!project) return errorResponse(res, 'Project not found', 404);
    return successResponse(res, project);
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/projects ──────────────────────────────────────────────────────
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, user: req.user.id });

    // Rewards & streak
    await Promise.all([
      awardXP(req.user.id, 'add_project', { projectId: project._id }),
      awardTokens(req.user.id, 'add_project', { projectId: project._id }),
      recordActivity(req.user.id, 'add_project'),
      checkBadgeUnlocks(req.user.id),
    ]);

    return successResponse(res, project, 'Project created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/projects/:id ───────────────────────────────────────────────────
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return errorResponse(res, 'Project not found', 404);
    return successResponse(res, project, 'Project updated');
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/projects/:id ────────────────────────────────────────────────
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!project) return errorResponse(res, 'Project not found', 404);
    return successResponse(res, null, 'Project deleted');
  } catch (err) {
    next(err);
  }
};
