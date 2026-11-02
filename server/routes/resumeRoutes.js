const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { getResume, updateResume, generatePDF } = require('../controllers/resumeController');

router.use(protect);
router.get('/', getResume);
router.put('/', updateResume);
router.post('/generate-pdf', generatePDF);

module.exports = router;
