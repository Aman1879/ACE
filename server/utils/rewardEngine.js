const User            = require('../models/User');
const XPTransaction   = require('../models/XPTransaction');
const TokenTransaction= require('../models/TokenTransaction');
const Badge           = require('../models/Badge');
const UserBadge       = require('../models/UserBadge');
const RewardRule      = require('../models/RewardRule');
const { createNotification } = require('./notificationService');

// XP thresholds for each level (index = level - 1)
const XP_LEVELS = [
  0, 100, 300, 600, 1000, 1500, 2200, 3000,
  4000, 5500, 7500, 10000, 13000, 17000, 22000,
  28000, 35000, 43000, 52000, 62000,
];

const LEVEL_NAMES = [
  'Beginner', 'Curious', 'Learner', 'Coder', 'Explorer',
  'Builder', 'Creator', 'Developer', 'Innovator', 'Achiever',
  'Specialist', 'Expert', 'Master', 'Legend', 'Champion',
  'Visionary', 'Elite', 'Prodigy', 'Genius', 'Pro Learner',
];

const DEFAULT_REWARDS = {
  welcome:          { xp: 100, tokens: 50, description: 'Genesis Welcome Kit' },
  profile_complete: { xp: 150, tokens: 50, description: 'Completed Full Profile' },
  project_add:      { xp: 50,  tokens: 20, description: 'Published Engineering Project' },
  certificate_add:  { xp: 40,  tokens: 15, description: 'Verified Certification Credential' },
  achievement_add:  { xp: 40,  tokens: 15, description: 'Logged Academic Achievement' },
  streak_daily:     { xp: 50,  tokens: 10, description: 'Daily Streak Maintained' },
  goal_complete:    { xp: 30,  tokens: 10, description: 'Daily Sprint Goal Completed' },
  add_coding_profile: { xp: 50, tokens: 15, description: 'Connected Coding Platform' },
  sync_coding:        { xp: 15, tokens: 5,  description: 'Synchronized Coding Telemetry' },
  coding_solve:       { xp: 18, tokens: 4,  description: 'Verified Problem Solve' },
};

/**
 * Get xp/token reward amount for an activity from RewardRules.
 */
exports.getRewardAmount = async (activityType, currency = 'xp') => {
  const rule = await RewardRule.findOne({ activityType, isActive: true }).lean();
  if (rule) return currency === 'xp' ? rule.xpAmount : rule.tokenAmount;
  const fallback = DEFAULT_REWARDS[activityType];
  if (fallback) return currency === 'xp' ? fallback.xp : fallback.tokens;
  return 0;
};

/**
 * Award XP to a user, create XPTransaction, update level.
 */
exports.awardXP = async (userId, activityType, metadata = {}) => {
  try {
    const rule = await RewardRule.findOne({ activityType, isActive: true }).lean();
    const fallback = DEFAULT_REWARDS[activityType];
    const amount = rule ? rule.xpAmount : (fallback ? fallback.xp : 0);
    const description = rule?.description || fallback?.description || activityType;

    if (amount <= 0) return null;

    const user = await User.findById(userId).select('xp level levelName');
    if (!user) return null;

    const balanceBefore = user.xp;
    const balanceAfter  = balanceBefore + amount;

    await User.findByIdAndUpdate(userId, { $inc: { xp: amount } });

    const tx = await XPTransaction.create({
      user:          userId,
      amount,
      activityType,
      description,
      metadata,
      balanceBefore,
      balanceAfter,
    });

    await exports.updateUserLevel(userId);
    await createNotification(
      userId,
      'xp_earned',
      `+${amount} XP`,
      `You earned ${amount} XP for: ${description}`,
      { amount, activityType }
    );

    return tx;
  } catch (err) {
    console.error('awardXP error:', err.message);
    return null;
  }
};

/**
 * Award tokens to a user, create TokenTransaction.
 */
exports.awardTokens = async (userId, activityType, metadata = {}) => {
  try {
    const rule = await RewardRule.findOne({ activityType, isActive: true }).lean();
    const fallback = DEFAULT_REWARDS[activityType];
    const amount = rule ? rule.tokenAmount : (fallback ? fallback.tokens : 0);
    const description = rule?.description || fallback?.description || activityType;

    if (amount <= 0) return null;

    const user = await User.findById(userId).select('tokenBalance totalTokensEarned');
    if (!user) return null;

    const balanceBefore = user.tokenBalance;
    const balanceAfter  = balanceBefore + amount;

    await User.findByIdAndUpdate(userId, {
      $inc: { tokenBalance: amount, totalTokensEarned: amount },
    });

    const tx = await TokenTransaction.create({
      user:         userId,
      type:         'earned',
      amount,
      reason:       description,
      activityType,
      balanceBefore,
      balanceAfter,
    });

    await createNotification(
      userId,
      'token_earned',
      `+${amount} Tokens`,
      `You earned ${amount} tokens for: ${description}`,
      { amount, activityType }
    );

    return tx;
  } catch (err) {
    console.error('awardTokens error:', err.message);
    return null;
  }
};

/**
 * Update user level based on their current XP.
 */
exports.updateUserLevel = async (userId) => {
  try {
    const user = await User.findById(userId).select('xp level levelName');
    if (!user) return;

    let newLevel = 1;
    for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
      if (user.xp >= XP_LEVELS[i]) {
        newLevel = i + 1;
        break;
      }
    }

    const newLevelName = LEVEL_NAMES[newLevel - 1] || 'Pro Learner';

    if (newLevel !== user.level) {
      await User.findByIdAndUpdate(userId, { level: newLevel, levelName: newLevelName });
    }
  } catch (err) {
    console.error('updateUserLevel error:', err.message);
  }
};

/**
 * Check and unlock badges for a user.
 */
exports.checkBadgeUnlocks = async (userId) => {
  try {
    const badges = await Badge.find({ isActive: true }).lean();
    const earned = await UserBadge.find({ user: userId }).select('badge').lean();
    const earnedIds = new Set(earned.map((b) => b.badge.toString()));

    const user = await User.findById(userId).select('xp level').lean();
    if (!user) return;

    const Project       = require('../models/Project');
    const Certificate   = require('../models/Certificate');
    const Goal          = require('../models/Goal');
    const Streak        = require('../models/Streak');
    const CodingProfile = require('../models/CodingProfile');

    const streak        = await Streak.findOne({ user: userId }).lean();
    const projectCount  = await Project.countDocuments({ user: userId });
    const certCount     = await Certificate.countDocuments({ user: userId });
    const goalCount     = await Goal.countDocuments({ user: userId, status: 'Completed' });
    const codingProfiles= await CodingProfile.find({ user: userId }).lean();
    const codingCount   = codingProfiles.length;
    const totalCodingSolves = codingProfiles.reduce((acc, c) => acc + (c.totalSolved || 0), 0);

    const unlockedBadges = [];

    for (const badge of badges) {
      if (earnedIds.has(badge._id.toString())) continue;
      const { type, value } = badge.condition || {};
      let qualified = false;

      switch (type) {
        case 'streak_days':
          qualified = streak && streak.currentStreak >= value;
          break;
        case 'longest_streak':
          qualified = streak && streak.longestStreak >= value;
          break;
        case 'project_count':
          qualified = projectCount >= value;
          break;
        case 'certificate_count':
          qualified = certCount >= value;
          break;
        case 'goal_count':
          qualified = goalCount >= value;
          break;
        case 'xp_threshold':
          qualified = user.xp >= value;
          break;
        case 'level_reached':
          qualified = user.level >= value;
          break;
        case 'coding_profile_count':
          qualified = codingCount >= value;
          break;
        case 'coding_solves':
          qualified = totalCodingSolves >= value;
          break;
        default:
          break;
      }

      if (qualified) {
        await UserBadge.create({ user: userId, badge: badge._id });
        unlockedBadges.push(badge);

        // Award badge rewards
        if (badge.xpReward > 0) {
          await User.findByIdAndUpdate(userId, { $inc: { xp: badge.xpReward } });
          await XPTransaction.create({
            user:         userId,
            amount:       badge.xpReward,
            activityType: 'badge_unlock',
            description:  `Badge unlocked: ${badge.name}`,
            metadata:     { badgeId: badge._id },
          });
        }
        if (badge.tokenReward > 0) {
          await User.findByIdAndUpdate(userId, {
            $inc: { tokenBalance: badge.tokenReward, totalTokensEarned: badge.tokenReward },
          });
          await TokenTransaction.create({
            user:         userId,
            type:         'earned',
            amount:       badge.tokenReward,
            reason:       `Badge unlocked: ${badge.name}`,
            activityType: 'badge_unlock',
          });
        }

        await createNotification(
          userId,
          'badge_unlocked',
          `Badge Unlocked: ${badge.name}`,
          badge.description || `You unlocked the "${badge.name}" badge!`,
          { badgeId: badge._id, badgeName: badge.name, icon: badge.icon }
        );
      }
    }

    return unlockedBadges;
  } catch (err) {
    console.error('checkBadgeUnlocks error:', err.message);
    return [];
  }
};
