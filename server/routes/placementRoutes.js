const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getPlacements, getPlacement,
  createPlacement, updatePlacement, deletePlacement,
} = require('../controllers/placementController');

router.use(protect);
router.route('/').get(getPlacements).post(createPlacement);
router.route('/:id').get(getPlacement).put(updatePlacement).delete(deletePlacement);

module.exports = router;
