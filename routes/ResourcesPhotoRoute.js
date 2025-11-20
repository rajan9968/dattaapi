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
} = require('../Controller/ResourcesPhotoController');

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
router.post('/add-resources-photo', upload.single('banner_image'), createAboutBannerController); // Create
router.get('/get-resources-photos', getAllAboutBannerController); // Read all
router.get('/get-resources-photo/:id', getAboutBannerByIdController); // Read by ID
router.put('/update-resources-photo/:id', upload.single('banner_image'), updateAboutBannerController); // Update
router.delete('/delete-resources-photo/:id', deleteAboutBannerController); // Delete

module.exports = router;
