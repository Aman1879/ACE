const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Achievement = require('../models/Achievement');
const Internship = require('../models/Internship');
const CodingProfile = require('../models/CodingProfile');
const Skill = require('../models/Skill');
const Streak = require('../models/Streak');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ─── GET /api/public/users/:username ────────────────────────────────────────
exports.getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username, isActive: true }).select(
      'name username xp level levelName createdAt'
    );

    if (!user) {
      return errorResponse(res, 'Student profile not found', 404);
    }

    const profile = await Profile.findOne({ user: user._id, isPublic: true });
    if (!profile) {
      return errorResponse(res, 'This profile is private or not available', 404);
    }

    // Parallel fetch allowed public sections
    const tasks = [];

    // Projects
    if (profile.showProjects) {
      tasks.push(Project.find({ user: user._id, isPublic: true }).sort({ createdAt: -1 }));
    } else {
      tasks.push(Promise.resolve([]));
    }

    // Certificates
    if (profile.showCertificates) {
      tasks.push(Certificate.find({ user: user._id, isPublic: true }).sort({ issueDate: -1 }));
    } else {
      tasks.push(Promise.resolve([]));
    }

    // Achievements
    if (profile.showAchievements) {
      tasks.push(Achievement.find({ user: user._id, isPublic: true }).sort({ date: -1 }));
    } else {
      tasks.push(Promise.resolve([]));
    }

    // Internships
    if (profile.showInternships) {
      tasks.push(Internship.find({ user: user._id, isPublic: true }).sort({ startDate: -1 }));
    } else {
      tasks.push(Promise.resolve([]));
    }

    // Coding profiles
    if (profile.showCoding) {
      tasks.push(CodingProfile.find({ user: user._id }));
    } else {
      tasks.push(Promise.resolve([]));
    }

    // Skills
    tasks.push(Skill.find({ user: user._id }));

    // Streak
    tasks.push(Streak.findOne({ user: user._id }).select('currentStreak longestStreak totalActiveDays'));

    const [projects, certificates, achievements, internships, codingProfiles, skills, streak] =
      await Promise.all(tasks);

    const publicData = {
      user: {
        name: user.name,
        username: user.username,
        xp: user.xp,
        level: user.level,
        levelName: user.levelName,
        joinedAt: user.createdAt,
      },
      profile: {
        avatar: profile.avatar,
        bio: profile.bio,
        college: profile.college,
        degree: profile.degree,
        branch: profile.branch,
        graduationYear: profile.graduationYear,
        github: profile.github,
        linkedin: profile.linkedin,
        portfolio: profile.portfolio,
        location: profile.location,
        careerInterests: profile.careerInterests,
      },
      streak: streak
        ? {
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            totalActiveDays: streak.totalActiveDays,
          }
        : null,
      projects,
      certificates,
      achievements,
      internships,
      codingProfiles,
      skills,
    };

    return successResponse(res, publicData, 'Public profile fetched');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/public/users ──────────────────────────────────────────────────
exports.searchPublicUsers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const profiles = await Profile.find({
      isPublic: true,
      ...(search && {
        $or: [
          { college: { $regex: search, $options: 'i' } },
          { branch: { $regex: search, $options: 'i' } },
        ],
      }),
    })
      .populate('user', 'name username xp level levelName')
      .limit(20)
      .lean();

    const results = profiles
      .filter((p) => p.user)
      .map((p) => ({
        name: p.user.name,
        username: p.user.username,
        avatar: p.avatar,
        college: p.college,
        degree: p.degree,
        branch: p.branch,
        xp: p.user.xp,
        level: p.user.level,
        levelName: p.user.levelName,
      }));

    return successResponse(res, results, 'Public users fetched');
  } catch (err) {
    next(err);
  }
};

