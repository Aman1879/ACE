const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCodingProfiles, getCodingProfile,
  createCodingProfile, updateCodingProfile, deleteCodingProfile,
  syncAllCodingProfiles, extractLiveStats,
} = require('../controllers/codingController');

router.use(protect);
router.post('/sync', syncAllCodingProfiles);
router.post('/extract', extractLiveStats);
router.route('/').get(getCodingProfiles).post(createCodingProfile);
router.route('/:id').get(getCodingProfile).put(updateCodingProfile).delete(deleteCodingProfile);

module.exports = router;
