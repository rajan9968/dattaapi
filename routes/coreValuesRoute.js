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
} = require('../controller/coreValuesController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/our-culture/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + path.extname(file.originalname));
    },
});

const upload = multer({ storage });



// Routes
router.post('/add-core-values', upload.single('banner_image'), createAboutBannerController); // Create
router.get('/get-core-values', getAllAboutBannerController); // Read all
router.get('/get-core-values/:id', getAboutBannerByIdController); // Read by ID
router.put('/update-add-core-values/:id', upload.single('banner_image'), updateAboutBannerController); // Update
router.delete('/delete-add-core-values/:id', deleteAboutBannerController); // Delete

module.exports = router;
