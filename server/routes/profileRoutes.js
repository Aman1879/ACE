const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  getProfileCompletion,
} = require('../controllers/profileController');

router.use(protect);

router.get('/', getMyProfile);
router.get('/me', getMyProfile);
router.put('/', updateMyProfile);
router.put('/me', updateMyProfile);
router.post('/avatar', uploadSingle('avatar', 'avatars'), uploadAvatar);
router.get('/completion', getProfileCompletion);

module.exports = router;
