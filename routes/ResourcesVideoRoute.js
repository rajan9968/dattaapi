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
} = require('../Controller/ResourcesVideoController');

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/about-banners/'); // make sure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Routes
router.post('/add-resources-video', upload.single('banner_image'), createAboutBannerController); // Create
router.get('/get-resources-videos', getAllAboutBannerController); // Read all
router.get('/get-resources-video/:id', getAboutBannerByIdController); // Read by ID
router.put('/update-resources-video/:id', upload.single('banner_image'), updateAboutBannerController); // Update
router.delete('/delete-resources-video/:id', deleteAboutBannerController); // Delete

module.exports = router;
