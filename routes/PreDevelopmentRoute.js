const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
    createAboutBannerController,
    getAllAboutBannerController,
    getAboutBannerByIdController,
    updateAboutBannerController,
    deleteAboutBannerController,
} = require('../Controller/PreDevelopmentController.js');

// ============================
// Multer Configuration
// ============================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/about-banners/'); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// ============================
// Dynamic Field Handler
// ============================
// Since the number of approach/project images can vary, we’ll handle all possible field names dynamically
const dynamicUpload = (req, res, next) => {
    // Define all possible static fields
    const fields = [
        { name: 'banner_image', maxCount: 1 },
        { name: 'overview_image', maxCount: 1 },
    ];

    // Dynamically include up to, say, 20 approach and 20 project image slots
    for (let i = 0; i < 20; i++) {
        fields.push({ name: `approach_image_${i}`, maxCount: 1 });
        fields.push({ name: `project_image_${i}`, maxCount: 1 });
    }

    const uploadMiddleware = upload.fields(fields);
    uploadMiddleware(req, res, next);
};

// ============================
// Routes
// ============================

// CREATE — supports multiple dynamic images
router.post(
    '/add-pre-development-banner',
    dynamicUpload,
    createAboutBannerController
);

// READ ALL
router.get('/get-pre-development-banners', getAllAboutBannerController);

// READ BY ID
router.get('/get-pre-development-banner/:id', getAboutBannerByIdController);

// UPDATE — supports multiple dynamic images
router.put(
    '/update-pre-development-banner/:id',
    dynamicUpload,
    updateAboutBannerController
);

// DELETE
router.delete('/delete-pre-development-banner/:id', deleteAboutBannerController);

module.exports = router;
