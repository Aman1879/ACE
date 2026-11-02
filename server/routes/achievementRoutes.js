const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAchievements, getAchievement,
  createAchievement, updateAchievement, deleteAchievement,
} = require('../controllers/achievementController');

router.use(protect);
router.route('/').get(getAchievements).post(createAchievement);
router.route('/:id').get(getAchievement).put(updateAchievement).delete(deleteAchievement);

module.exports = router;
