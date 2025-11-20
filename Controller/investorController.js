const {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategoryById,
    deleteSubCategoryById,
} = require('../Dao/invertorDao');

// ✅ Create Sub Category
const createSubCategoryController = async (req, res) => {
    try {
        const subCat = {
            cat_id: req.body.cat_id,
            title: req.body.title,
            year: req.body.year,
            link: req.body.link,
            status: req.body.status || 1,
        };

        // // Validation
        // if (!subCat.cat_id || !subCat.title) {
        //     return res.status(400).json({ success: false, message: 'Category ID and Title are required' });
        // }

        const id = await createSubCategory(subCat);
        res.json({ success: true, message: 'Sub Category created successfully', id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get All Sub Categories
const getAllSubCategoryController = async (req, res) => {
    try {
        const subCategories = await getAllSubCategories();
        res.json({ success: true, subCategories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get Sub Category by ID
const getSubCategoryByIdController = async (req, res) => {
    try {
        const subCategory = await getSubCategoryById(req.params.id);
        if (!subCategory) {
            return res.status(404).json({ success: false, message: 'Sub Category not found' });
        }
        res.json({ success: true, subCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update Sub Category
const updateSubCategoryController = async (req, res) => {
    try {
        const updatedData = {
            cat_id: req.body.cat_id,
            title: req.body.title,
            year: req.body.year,
            link: req.body.link,
            status: req.body.status,
        };

        const result = await updateSubCategoryById(req.params.id, updatedData);

        if (result === 0) {
            return res.status(404).json({ success: false, message: 'Sub Category not found or not updated' });
        }

        res.json({ success: true, message: 'Sub Category updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Delete Sub Category
const deleteSubCategoryController = async (req, res) => {
    try {
        const result = await deleteSubCategoryById(req.params.id);
        res.json({
            success: true,
            message: result ? 'Sub Category deleted successfully' : 'Sub Category not found',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createSubCategoryController,
    getAllSubCategoryController,
    getSubCategoryByIdController,
    updateSubCategoryController,
    deleteSubCategoryController,
};
