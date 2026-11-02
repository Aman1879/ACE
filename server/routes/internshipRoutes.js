const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getInternships, getInternship,
  createInternship, updateInternship, deleteInternship,
} = require('../controllers/internshipController');

router.use(protect);
router.route('/').get(getInternships).post(createInternship);
router.route('/:id').get(getInternship).put(updateInternship).delete(deleteInternship);

module.exports = router;
