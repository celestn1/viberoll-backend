// backend/configs/upload.js

const multer = require('multer');
const path = require('path');

// Configure storage for uploaded videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploads
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with the original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Optional: file filter to accept only video files
const fileFilter = (req, file, cb) => {
  // Accept video mime types (adjust as needed)
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;
