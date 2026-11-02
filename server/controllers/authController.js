const { validationResult } = require('express-validator');
const User                  = require('../models/User');
const Profile               = require('../models/Profile');
const Streak                = require('../models/Streak');
const { generateSlug }      = require('../utils/slugGenerator');
const { awardXP, awardTokens, checkBadgeUnlocks } = require('../utils/rewardEngine');
const { checkAndSyncStreak, getTodayStr } = require('../utils/streakEngine');
const { createNotification }= require('../utils/notificationService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ─── Helper: send token response ─────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJWT();
  const cookieOptions = {
    expires:  new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
  res.cookie('ace_token', token, cookieOptions);
  return res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      _id:                     user._id,
      name:                    user.name,
      email:                   user.email,
      username:                user.username,
      role:                    user.role,
      xp:                      user.xp,
      level:                   user.level,
      levelName:               user.levelName,
      tokenBalance:            user.tokenBalance,
      streak:                  user.streak || 1,
      profileCompleted:        user.profileCompleted,
      profileCompletionPercent:user.profileCompletionPercent,
    },
  });
};

// ─── @route  POST /api/auth/register ─────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const { name, email, password, college, degree, branch, graduationYear } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return errorResponse(res, 'An account with this email already exists', 400);
    }

    const username = await generateSlug(name, User);

    const user = await User.create({ name, email, password, username });

    // Create companion documents with full student identity
    const today = getTodayStr();
    await Profile.create({
      user:           user._id,
      college:        college || '',
      degree:         degree || '',
      branch:         branch || '',
      graduationYear: graduationYear ? Number(graduationYear) : 2026,
    });
    await Streak.create({
      user:             user._id,
      currentStreak:    1,
      longestStreak:    1,
      lastActivityDate: today,
      totalActiveDays:  1,
      activityLog:      [{ date: today, activities: ['genesis_kit'] }],
    });

    // Welcome rewards (Genesis Welcome Kit: +100 XP, 50 $ACE, Day 1 Streak)
    await awardXP(user._id, 'welcome');
    await awardTokens(user._id, 'welcome');

    // Welcome notification
    await createNotification(
      user._id,
      'welcome',
      'Welcome to ACE! 🎉',
      `Hey ${user.name}, welcome to the Academic & Career Engine! Start by completing your profile.`,
      {}
    );

    // Check badge unlocks (first-step badge)
    await checkBadgeUnlocks(user._id);

    // Reload user for updated XP/tokens
    const freshUser = await User.findById(user._id);
    return sendTokenResponse(freshUser, 201, res, 'Registration successful');
  } catch (err) {
    next(err);
  }
};

// ─── @route  POST /api/auth/login ────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account has been deactivated. Please contact support.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Check, continue or reset streak on daily login
    await checkAndSyncStreak(user._id, true);
    const freshUser = await User.findById(user._id);

    return sendTokenResponse(freshUser, 200, res, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// ─── @route  POST /api/auth/logout ───────────────────────────────────────────
exports.logout = (req, res) => {
  res.cookie('ace_token', 'none', {
    expires:  new Date(Date.now() + 1000),
    httpOnly: true,
  });
  return successResponse(res, null, 'Logged out successfully');
};

// ─── @route  GET /api/auth/me ────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    await checkAndSyncStreak(req.user.id, true);
    const user    = await User.findById(req.user.id);
    const profile = await Profile.findOne({ user: req.user.id });
    const userObj = user ? user.toObject() : {};
    return successResponse(res, { ...userObj, profile }, 'User fetched successfully');
  } catch (err) {
    next(err);
  }
};

// ─── @route  POST /api/auth/forgot-password ──────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Security: don't reveal if email exists
      return successResponse(res, null, 'If an account exists, a password reset email has been sent.');
    }
    // TODO: implement actual email sending with nodemailer
    console.log(`[forgotPassword] Password reset requested for: ${email}`);
    return successResponse(res, null, 'If an account exists, a password reset email has been sent.');
  } catch (err) {
    next(err);
  }
};

// ─── @route  PUT /api/auth/reset-password ────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    // TODO: implement token-based reset
    console.log('[resetPassword] stub – token:', req.params.token);
    return successResponse(res, null, 'Password reset stub – not yet implemented');
  } catch (err) {
    next(err);
  }
};

// ─── @route  PUT /api/auth/change-password ───────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, null, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};
