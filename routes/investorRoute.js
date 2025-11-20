const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    createSubCategoryController,
    getAllSubCategoryController,
    getSubCategoryByIdController,
    updateSubCategoryController,
    deleteSubCategoryController,
} = require('../Controller/investorController');

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
router.post('/add-investor', createSubCategoryController); // Create
router.get('/get-investor', getAllSubCategoryController); // Read all
router.get('/get-investor/:id', getSubCategoryByIdController); // Read by ID
router.put('/update-investor/:id', updateSubCategoryController); // Update
router.delete('/delete-investor/:id', deleteSubCategoryController); // Delete

module.exports = router;
