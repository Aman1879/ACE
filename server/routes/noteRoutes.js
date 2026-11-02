const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotes, getNote, createNote, updateNote, deleteNote,
  togglePin, toggleArchive,
} = require('../controllers/noteController');

router.use(protect);
router.route('/').get(getNotes).post(createNote);
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);
router.put('/:id/pin',     togglePin);
router.put('/:id/archive', toggleArchive);

module.exports = router;
