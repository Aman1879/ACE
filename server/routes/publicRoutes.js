const express = require('express');
const router = express.Router();
const { getPublicProfile, searchPublicUsers } = require('../controllers/publicController');

router.get('/users/:username', getPublicProfile);
router.get('/users', searchPublicUsers);

module.exports = router;

