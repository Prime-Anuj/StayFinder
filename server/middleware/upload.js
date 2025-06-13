const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// Ensure uploads directory exists
const uploadDir = config.UPLOAD_PATH;
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = uploadDir;
        
        // Create subdirectories based on file type
        if (file.fieldname === 'images') {
            uploadPath = path.join(uploadDir, 'listings');
        } else if (file.fieldname === 'avatar') {
            uploadPath = path.join(uploadDir, 'avatars');
        } else {
            uploadPath = path.join(uploadDir, 'misc');
        }
        
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: config.MAX_FILE_SIZE
    }
});

module.exports = upload;
