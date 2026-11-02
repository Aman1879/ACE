const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const { allowedDocTypes } = require('../middleware/upload');
const {
  getCertificates, getCertificate,
  createCertificate, updateCertificate, deleteCertificate,
} = require('../controllers/certificateController');

router.use(protect);

router.route('/')
  .get(getCertificates)
  .post(uploadSingle('file', 'certificates', allowedDocTypes), createCertificate);

router.route('/:id')
  .get(getCertificate)
  .put(uploadSingle('file', 'certificates', allowedDocTypes), updateCertificate)
  .delete(deleteCertificate);

module.exports = router;
