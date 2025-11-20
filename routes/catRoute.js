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
} = require('../Controller/catController');

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
router.post('/add-category', createAboutBannerController); // Create
router.get('/get-category', getAllAboutBannerController); // Read all
router.get('/get-category/:id', getAboutBannerByIdController); // Read by ID
router.put('/update-category/:id', updateAboutBannerController); // Update
router.delete('/delete-category/:id', deleteAboutBannerController); // Delete

module.exports = router;
