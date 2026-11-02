const User = require('../models/User');
const Streak = require('../models/Streak');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const XPTransaction = require('../models/XPTransaction');
const TokenTransaction = require('../models/TokenTransaction');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

// ─── GET /api/gamification/summary ──────────────────────────────────────────
exports.getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [user, streak, earnedBadgesCount, recentXP, recentTokens] = await Promise.all([
      User.findById(userId).select('xp level levelName tokenBalance totalTokensEarned'),
      Streak.findOne({ user: userId }),
      UserBadge.countDocuments({ user: userId }),
      XPTransaction.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      TokenTransaction.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
    ]);

    const data = {
      xp: user ? user.xp : 0,
      level: user ? user.level : 1,
      levelName: user ? user.levelName : 'Beginner',
      tokenBalance: user ? user.tokenBalance : 0,
      totalTokensEarned: user ? user.totalTokensEarned : 0,
      currentStreak: streak ? streak.currentStreak : 0,
      longestStreak: streak ? streak.longestStreak : 0,
      totalActiveDays: streak ? streak.totalActiveDays : 0,
      badgeCount: earnedBadgesCount,
      recentXP,
      recentTokens,
    };

    return successResponse(res, data, 'Gamification summary fetched');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/gamification/badges ───────────────────────────────────────────
exports.getBadges = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Check unlocks first so any newly qualified badges are instantly awarded
    const { checkBadgeUnlocks } = require('../utils/rewardEngine');
    await checkBadgeUnlocks(userId);

    const [allBadges, userBadges] = await Promise.all([
      Badge.find({ isActive: true }).sort({ category: 1, rarity: 1 }),
      UserBadge.find({ user: userId }).lean(),
    ]);

    const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badge.toString()));
    const earnedMap = {};
    userBadges.forEach((ub) => {
      earnedMap[ub.badge.toString()] = ub.earnedAt;
    });

    const badgesWithStatus = allBadges.map((badge) => {
      const isUnlocked = earnedBadgeIds.has(badge._id.toString());
      return {
        ...badge.toObject(),
        isUnlocked,
        earnedAt: isUnlocked ? earnedMap[badge._id.toString()] : null,
      };
    });

    return successResponse(res, badgesWithStatus, 'Badges fetched');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/gamification/my-badges ────────────────────────────────────────
exports.getMyBadges = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { checkBadgeUnlocks } = require('../utils/rewardEngine');
    await checkBadgeUnlocks(userId);

    const userBadges = await UserBadge.find({ user: userId })
      .populate('badge')
      .sort({ earnedAt: -1 })
      .lean();

    const earnedList = userBadges
      .filter((ub) => ub.badge && ub.badge.isActive)
      .map((ub) => ({
        ...ub.badge,
        earnedAt: ub.earnedAt,
        isUnlocked: true,
      }));

    return successResponse(res, earnedList, 'Earned badges fetched');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/gamification/transactions ─────────────────────────────────────
exports.getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type || 'all'; // 'xp', 'token', 'all'

    if (type === 'xp') {
      const [data, total] = await Promise.all([
        XPTransaction.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        XPTransaction.countDocuments({ user: userId }),
      ]);
      return paginatedResponse(res, data, total, page, limit);
    }

    if (type === 'token') {
      const [data, total] = await Promise.all([
        TokenTransaction.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        TokenTransaction.countDocuments({ user: userId }),
      ]);
      return paginatedResponse(res, data, total, page, limit);
    }

    // Default: combine last transactions
    const [xpList, tokenList] = await Promise.all([
      XPTransaction.find({ user: userId }).sort({ createdAt: -1 }).limit(10),
      TokenTransaction.find({ user: userId }).sort({ createdAt: -1 }).limit(10),
    ]);

    return successResponse(res, { xp: xpList, tokens: tokenList });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/gamification/xp-history ───────────────────────────────────────
exports.getXPHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const history = await XPTransaction.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalXP: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return successResponse(res, history, 'XP history fetched');
  } catch (err) {
    next(err);
  }
};

