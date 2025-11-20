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
} = require('../Controller/mappingController');

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/about-banners/'); // folder for mapping images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
});

// ✅ ROUTES (Mapping / Timeline)
router.post('/add-mapping', upload.single('image'), createAboutBannerController);        // Create (with image)
router.get('/get-mappings', getAllAboutBannerController);                               // Get all
router.get('/get-mapping/:id', getAboutBannerByIdController);                           // Get by ID
router.put('/update-mapping/:id', upload.single('image'), updateAboutBannerController); // Update (with image)
router.delete('/delete-mapping/:id', deleteAboutBannerController);                      // Delete

module.exports = router;
