const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { getStreak, recordStreakActivity } = require('../controllers/streakController');

router.use(protect);
router.get('/', getStreak);
router.post('/activity', recordStreakActivity);

module.exports = router;
