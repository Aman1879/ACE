const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSummary,
  getBadges,
  getMyBadges,
  getTransactions,
  getXPHistory,
} = require('../controllers/gamificationController');

router.use(protect);

router.get('/summary', getSummary);
router.get('/badges', getBadges);
router.get('/my-badges', getMyBadges);
router.get('/transactions', getTransactions);
router.get('/xp-history', getXPHistory);

module.exports = router;

