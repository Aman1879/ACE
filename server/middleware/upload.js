const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const allowedDocTypes   = ['application/pdf', ...allowedImageTypes];

exports.allowedImageTypes = allowedImageTypes;
exports.allowedDocTypes   = allowedDocTypes;

// ─── Build storage dynamically ───────────────────────────────────────────────

const buildStorage = (folder) => {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    // Cloudinary storage
    const cloudinary              = require('cloudinary').v2;
    const { CloudinaryStorage }   = require('multer-storage-cloudinary');

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new CloudinaryStorage({
      cloudinary,
      params: {
        folder:         `ace/${folder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'],
        resource_type:  'auto',
      },
    });
  }

  // Disk storage fallback
  const uploadDir = path.join(__dirname, '..', 'uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename:    (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
};

const fileFilter = (allowedTypes) => (_req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// ─── Exported helpers ────────────────────────────────────────────────────────

/**
 * uploadSingle(fieldName, folder, allowedTypes?)
 */
exports.uploadSingle = (fieldName, folder, allowedTypes = allowedImageTypes) => {
  return multer({
    storage:    buildStorage(folder),
    fileFilter: fileFilter(allowedTypes),
    limits:     { fileSize: 10 * 1024 * 1024 }, // 10 MB
  }).single(fieldName);
};

/**
 * uploadMultiple(fieldName, maxCount, folder, allowedTypes?)
 */
exports.uploadMultiple = (fieldName, maxCount, folder, allowedTypes = allowedImageTypes) => {
  return multer({
    storage:    buildStorage(folder),
    fileFilter: fileFilter(allowedTypes),
    limits:     { fileSize: 10 * 1024 * 1024 },
  }).array(fieldName, maxCount);
};
