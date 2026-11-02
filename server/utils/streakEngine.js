const Streak = require('../models/Streak');
const User   = require('../models/User');
const { createNotification } = require('./notificationService');

// Streak milestones that trigger notifications/badges
const STREAK_MILESTONES = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 365];

/**
 * Get today's date string in YYYY-MM-DD format (UTC).
 */
const getTodayStr = () => new Date().toISOString().split('T')[0];

/**
 * Get yesterday's date string in YYYY-MM-DD format (UTC).
 */
const getYesterdayStr = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
};

exports.getTodayStr = getTodayStr;
exports.getYesterdayStr = getYesterdayStr;

/**
 * Check, evaluate missed days, and sync streak on login or dashboard load.
 * - Brand new user: starts at Day 1.
 * - Consecutive day: streak increments (+1).
 * - Missed any day: streak restarts from 1.
 * - Same day: stays at current streak.
 */
exports.checkAndSyncStreak = async (userId, autoActive = true) => {
  try {
    const today = getTodayStr();
    const yesterday = getYesterdayStr();

    let streak = await Streak.findOne({ user: userId });
    if (!streak) {
      streak = await Streak.create({
        user: userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        totalActiveDays: 1,
        activityLog: [{ date: today, activities: ['genesis_start'] }],
      });
      await User.findByIdAndUpdate(userId, { streak: 1 });
      return streak;
    }

    const lastDate = streak.lastActivityDate;
    let changed = false;

    if (!lastDate) {
      // First day
      streak.currentStreak = 1;
      streak.longestStreak = Math.max(1, streak.longestStreak);
      streak.lastActivityDate = today;
      streak.totalActiveDays = Math.max(1, streak.totalActiveDays);
      streak.activityLog.push({ date: today, activities: ['genesis_start'] });
      changed = true;
    } else if (lastDate === today) {
      // Already active today!
      return streak;
    } else if (lastDate === yesterday) {
      // Consecutive daily login!
      if (autoActive) {
        streak.currentStreak += 1;
        streak.lastActivityDate = today;
        streak.totalActiveDays += 1;
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
        streak.activityLog.push({ date: today, activities: ['daily_login'] });
        changed = true;
      }
    } else {
      // Missed at least 1 day! (lastDate < yesterday)
      // Streak breaks and resets
      if (autoActive) {
        streak.currentStreak = 1; // Restart from Day 1 on today's login
        streak.lastActivityDate = today;
        streak.totalActiveDays += 1;
        streak.activityLog.push({ date: today, activities: ['streak_restart'] });
        changed = true;
      } else {
        streak.currentStreak = 0;
        changed = true;
      }
    }

    if (changed) {
      await streak.save();
      await User.findByIdAndUpdate(userId, { streak: streak.currentStreak });
    }

    return streak;
  } catch (err) {
    console.error('checkAndSyncStreak error:', err.message);
    return null;
  }
};

/**
 * Record a qualifying activity for streak tracking.
 */
exports.recordActivity = async (userId, activityName = 'general') => {
  try {
    const today     = getTodayStr();
    const yesterday = getYesterdayStr();

    let streak = await Streak.findOne({ user: userId });
    if (!streak) {
      streak = await Streak.create({
        user: userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        totalActiveDays: 1,
        activityLog: [{ date: today, activities: [activityName] }],
      });
      await User.findByIdAndUpdate(userId, { streak: 1 });
      return { streakUpdated: true, currentStreak: 1, longestStreak: 1, milestonesReached: [] };
    }

    const lastDate = streak.lastActivityDate;
    const milestonesReached = [];
    let streakUpdated = false;

    const alreadyToday = lastDate === today;

    if (!alreadyToday) {
      if (lastDate === yesterday) {
        streak.currentStreak += 1;
      } else {
        streak.currentStreak = 1;
      }

      streak.lastActivityDate = today;
      streak.totalActiveDays += 1;

      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }

      streakUpdated = true;

      // Check milestones
      for (const milestone of STREAK_MILESTONES) {
        const alreadyUnlocked = streak.milestones.some((m) => m.days === milestone);
        if (!alreadyUnlocked && streak.currentStreak >= milestone) {
          streak.milestones.push({ days: milestone, unlockedAt: new Date() });
          milestonesReached.push(milestone);

          await createNotification(
            userId,
            'streak_milestone',
            `🔥 ${milestone}-Day Streak!`,
            `You've maintained a ${milestone}-day streak. Keep it up!`,
            { milestone, currentStreak: streak.currentStreak }
          );
        }
      }
    }

    // Update log
    const logEntry = streak.activityLog.find((e) => e.date === today);
    if (logEntry) {
      if (!logEntry.activities.includes(activityName)) {
        logEntry.activities.push(activityName);
      }
    } else {
      streak.activityLog.push({ date: today, activities: [activityName] });
      if (streak.activityLog.length > 365) {
        streak.activityLog = streak.activityLog.slice(-365);
      }
    }

    await streak.save();
    await User.findByIdAndUpdate(userId, { streak: streak.currentStreak });

    return {
      streakUpdated,
      currentStreak:    streak.currentStreak,
      longestStreak:    streak.longestStreak,
      milestonesReached,
    };
  } catch (err) {
    console.error('streakEngine.recordActivity error:', err.message);
    return { streakUpdated: false, currentStreak: 0, longestStreak: 0, milestonesReached: [] };
  }
};

/**
 * Check if user has had an activity logged today.
 */
exports.hasActivityToday = async (userId) => {
  try {
    const today  = getTodayStr();
    const streak = await Streak.findOne({ user: userId }).lean();
    if (!streak) return false;
    return streak.lastActivityDate === today;
  } catch (err) {
    console.error('streakEngine.hasActivityToday error:', err.message);
    return false;
  }
};
