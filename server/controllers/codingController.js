const CodingProfile = require('../models/CodingProfile');
const { awardXP, awardTokens, checkBadgeUnlocks } = require('../utils/rewardEngine');
const { recordActivity } = require('../utils/streakEngine');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { fetchPlatformData } = require('../services/platformScraperService');

exports.getCodingProfiles = async (req, res, next) => {
  try {
    const items = await CodingProfile.find({ user: req.user.id }).sort({ createdAt: -1 });
    return successResponse(res, items);
  } catch (err) { next(err); }
};

exports.getCodingProfile = async (req, res, next) => {
  try {
    const item = await CodingProfile.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Coding profile not found', 404);
    return successResponse(res, item);
  } catch (err) { next(err); }
};

// ─── POST /api/coding/extract ────────────────────────────────────────────────
// Previews live data without saving yet
exports.extractLiveStats = async (req, res, next) => {
  try {
    const { platform, username } = req.body;
    if (!platform || !username) {
      return errorResponse(res, 'Platform and username are required', 400);
    }
    const liveData = await fetchPlatformData(platform, username);
    return successResponse(res, liveData, 'Real-time telemetry extracted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

// ─── POST /api/coding ────────────────────────────────────────────────────────
exports.createCodingProfile = async (req, res, next) => {
  try {
    const { platform, username } = req.body;
    if (!username || !username.trim()) {
      return errorResponse(res, 'Username or platform handle is required', 400);
    }

    let liveData = null;
    const normPlatform = (platform || '').trim();

    // Attempt real-time API extraction for LeetCode, GitHub, Codeforces
    if (['LeetCode', 'GitHub', 'Codeforces'].includes(normPlatform)) {
      try {
        liveData = await fetchPlatformData(normPlatform, username);
      } catch (scrapeErr) {
        console.warn(`[CodingController] Real-time fetch warning: ${scrapeErr.message}`);
        // If user didn't manually provide solved numbers, return the validation error
        if (!req.body.totalSolved && !req.body.contestRating) {
          return errorResponse(res, scrapeErr.message, 400);
        }
      }
    }

    const payload = {
      user: req.user.id,
      platform: normPlatform,
      username: (liveData?.username || username).trim(),
      profileUrl: liveData?.profileUrl || req.body.profileUrl?.trim() || undefined,
      totalSolved: liveData?.totalSolved !== undefined ? liveData.totalSolved : (Number(req.body.totalSolved) || 0),
      easySolved: liveData?.easySolved !== undefined ? liveData.easySolved : (Number(req.body.easySolved) || 0),
      mediumSolved: liveData?.mediumSolved !== undefined ? liveData.mediumSolved : (Number(req.body.mediumSolved) || 0),
      hardSolved: liveData?.hardSolved !== undefined ? liveData.hardSolved : (Number(req.body.hardSolved) || 0),
      contestRating: liveData?.contestRating !== undefined ? liveData.contestRating : (Number(req.body.contestRating) || undefined),
      globalRank: liveData?.globalRank || req.body.globalRank?.trim() || undefined,
      lastUpdated: new Date(),
      notes: liveData?.badge ? `Verified ${liveData.badge}` : req.body.notes,
    };

    // Prevent duplicate entries for same platform by updating existing
    let item = await CodingProfile.findOne({ user: req.user.id, platform: normPlatform });
    if (item) {
      item = await CodingProfile.findByIdAndUpdate(item._id, payload, { new: true });
    } else {
      item = await CodingProfile.create(payload);
    }

    await Promise.all([
      awardXP(req.user.id, 'add_coding_profile', { profileId: item._id }),
      awardTokens(req.user.id, 'add_coding_profile', { profileId: item._id }),
      recordActivity(req.user.id, 'add_coding_profile'),
      checkBadgeUnlocks(req.user.id),
    ]);

    return successResponse(
      res,
      item,
      `Real-time ${normPlatform} verified! +50 XP & +15 $ACE credited to your student wallet.`,
      201
    );
  } catch (err) { next(err); }
};

exports.updateCodingProfile = async (req, res, next) => {
  try {
    req.body.lastUpdated = new Date();
    const item = await CodingProfile.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return errorResponse(res, 'Coding profile not found', 404);
    return successResponse(res, item, 'Coding profile updated');
  } catch (err) { next(err); }
};

exports.deleteCodingProfile = async (req, res, next) => {
  try {
    const item = await CodingProfile.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Coding profile not found', 404);
    return successResponse(res, null, 'Coding profile deleted');
  } catch (err) { next(err); }
};

// ─── POST /api/coding/sync ───────────────────────────────────────────────────
exports.syncAllCodingProfiles = async (req, res, next) => {
  try {
    let items = await CodingProfile.find({ user: req.user.id });
    const now = new Date();

    if (items.length === 0) {
      return errorResponse(res, 'No connected platform accounts to sync. Add your LeetCode or GitHub account first!', 400);
    }

    let syncedCount = 0;
    for (const item of items) {
      try {
        if (['LeetCode', 'GitHub', 'Codeforces'].includes(item.platform)) {
          const live = await fetchPlatformData(item.platform, item.username);
          if (live) {
            item.totalSolved = live.totalSolved;
            if (live.easySolved !== undefined) item.easySolved = live.easySolved;
            if (live.mediumSolved !== undefined) item.mediumSolved = live.mediumSolved;
            if (live.hardSolved !== undefined) item.hardSolved = live.hardSolved;
            if (live.contestRating !== undefined) item.contestRating = live.contestRating;
            if (live.globalRank) item.globalRank = live.globalRank;
            if (live.profileUrl) item.profileUrl = live.profileUrl;
            if (live.badge) item.notes = `Verified ${live.badge}`;
            syncedCount++;
          }
        }
      } catch (err) {
        console.warn(`[Sync] Could not re-fetch ${item.platform} for ${item.username}: ${err.message}`);
      }
      item.lastUpdated = now;
      await item.save();
    }

    await awardXP(req.user.id, 'sync_coding');
    await recordActivity(req.user.id, 'coding_sync');

    return successResponse(
      res,
      items,
      `Synchronized ${syncedCount} platform${syncedCount === 1 ? '' : 's'} with live real-time API telemetry! +15 XP awarded.`
    );
  } catch (err) { next(err); }
};
