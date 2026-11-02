const User = require('../models/User');
const Profile = require('../models/Profile');
const Streak = require('../models/Streak');
const Project = require('../models/Project');
const { successResponse } = require('../utils/apiResponse');

// ─── GET /api/leaderboard ───────────────────────────────────────────────────
exports.getLeaderboard = async (req, res, next) => {
  try {
    const type = req.query.type || 'xp'; // 'xp' | 'streak' | 'projects'
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    // Get public profiles
    const publicProfiles = await Profile.find({ isPublic: true })
      .select('user college degree avatar')
      .lean();

    const publicUserIds = publicProfiles.map((p) => p.user);
    const profileMap = {};
    publicProfiles.forEach((p) => {
      profileMap[p.user.toString()] = p;
    });

    let rankedUsers = [];

    if (type === 'streak') {
      const streaks = await Streak.find({ user: { $in: publicUserIds } })
        .sort({ currentStreak: -1, longestStreak: -1 })
        .limit(limit)
        .populate('user', 'name username xp level levelName')
        .lean();

      rankedUsers = streaks
        .filter((s) => s.user)
        .map((s, idx) => ({
          rank: idx + 1,
          userId: s.user._id,
          name: s.user.name,
          username: s.user.username,
          avatar: profileMap[s.user._id.toString()]?.avatar || '',
          college: profileMap[s.user._id.toString()]?.college || '',
          score: s.currentStreak,
          scoreLabel: `${s.currentStreak} Days`,
          streak: s.currentStreak,
          xp: s.user.xp,
          level: s.user.level,
          levelName: s.user.levelName,
        }));
    } else if (type === 'projects') {
      const projectCounts = await Project.aggregate([
        { $match: { user: { $in: publicUserIds }, isPublic: true } },
        { $group: { _id: '$user', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]);

      const userIds = projectCounts.map((p) => p._id);
      const users = await User.find({ _id: { $in: userIds } })
        .select('name username xp level levelName')
        .lean();

      const userMap = {};
      users.forEach((u) => {
        userMap[u._id.toString()] = u;
      });

      rankedUsers = projectCounts
        .filter((p) => userMap[p._id.toString()])
        .map((p, idx) => {
          const user = userMap[p._id.toString()];
          return {
            rank: idx + 1,
            userId: user._id,
            name: user.name,
            username: user.username,
            avatar: profileMap[user._id.toString()]?.avatar || '',
            college: profileMap[user._id.toString()]?.college || '',
            score: p.count,
            scoreLabel: `${p.count} Projects`,
            xp: user.xp,
            level: user.level,
            levelName: user.levelName,
          };
        });
    } else {
      // Default: XP
      const users = await User.find({ _id: { $in: publicUserIds }, isActive: true })
        .sort({ xp: -1 })
        .limit(limit)
        .select('name username xp level levelName')
        .lean();

      rankedUsers = users.map((u, idx) => ({
        rank: idx + 1,
        userId: u._id,
        name: u.name,
        username: u.username,
        avatar: profileMap[u._id.toString()]?.avatar || '',
        college: profileMap[u._id.toString()]?.college || '',
        score: u.xp,
        scoreLabel: `${u.xp.toLocaleString()} XP`,
        xp: u.xp,
        level: u.level,
        levelName: u.levelName,
      }));
    }

    return successResponse(res, rankedUsers, 'Leaderboard fetched');
  } catch (err) {
    next(err);
  }
};

