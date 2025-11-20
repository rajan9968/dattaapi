const db = require('../config/db');

// ✅ Create new Sub Category
const createSubCategory = async (subCat) => {
    const [id] = await db('investor_data').insert({
        cat_id: subCat.cat_id,
        title: subCat.title,
        year: subCat.year,
        link: subCat.link,
        status: subCat.status,
    });
    return id;
};

// ✅ Get all Sub Categories
const getAllSubCategories = async () => {
    return await db('investor_data').select('*').orderBy('id', 'desc');
};

// ✅ Get Sub Category by ID
const getSubCategoryById = async (id) => {
    return await db('investor_data').where({ id }).first();
};

// ✅ Update Sub Category by ID
const updateSubCategoryById = async (id, subCat) => {
    const result = await db('investor_data')
        .where({ id })
        .update({
            cat_id: subCat.cat_id,
            title: subCat.title,
            year: subCat.year,
            link: subCat.link,
            status: subCat.status,
        });
    return result;
};

// ✅ Delete Sub Category by ID
const deleteSubCategoryById = async (id) => {
    const result = await db('investor_data').where({ id }).del();
    return result;
};

module.exports = {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategoryById,
    deleteSubCategoryById,
};
