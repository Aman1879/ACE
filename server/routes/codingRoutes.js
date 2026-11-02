const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCodingProfiles, getCodingProfile,
  createCodingProfile, updateCodingProfile, deleteCodingProfile,
} = require('../controllers/codingController');

router.use(protect);
router.route('/').get(getCodingProfiles).post(createCodingProfile);
router.route('/:id').get(getCodingProfile).put(updateCodingProfile).delete(deleteCodingProfile);

module.exports = router;
