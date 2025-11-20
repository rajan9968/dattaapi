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
} = require('../Controller/bussinessHeadingController');

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
router.post('/add-business-heading', createAboutBannerController); // Create
router.get('/get-business-heading', getAllAboutBannerController); // Read all
router.get('/get-business-heading/:id', getAboutBannerByIdController); // Read by ID
router.put('/update-business-heading/:id', updateAboutBannerController); // Update
router.delete('/delete-business-heading/:id', deleteAboutBannerController); // Delete

module.exports = router;
