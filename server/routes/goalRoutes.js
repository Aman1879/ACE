const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getGoals, getGoal, createGoal, updateGoal, deleteGoal, completeGoal,
} = require('../controllers/goalController');

router.use(protect);
router.route('/').get(getGoals).post(createGoal);
router.route('/:id').get(getGoal).put(updateGoal).delete(deleteGoal);
router.route('/:id/complete').post(completeGoal).put(completeGoal);

module.exports = router;
