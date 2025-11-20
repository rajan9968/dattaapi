const db = require('../config/db');

// Create new about banner
const createAboutBanner = async (banner) => {
    try {
        const [id] = await db('business_pre_development').insert({
            sub_heading: banner.sub_heading,
            banner_image: banner.banner_image,
            status: banner.status || 1,
            page_type: banner.page_type || '',
            overview_text: banner.overview_text || null,
            overview_image: banner.overview_image || null,
            key_highlights: banner.key_highlights ? JSON.stringify(banner.key_highlights) : null,
            our_approach: banner.our_approach ? JSON.stringify(banner.our_approach) : null,
            our_projects: banner.our_projects ? JSON.stringify(banner.our_projects) : null,
            created_at: db.fn.now(),
            updated_at: db.fn.now(),
        });

        return id;
    } catch (error) {
        console.error('Error inserting About Banner:', error);
        throw error;
    }
};


// Get all about banners
const getAllAboutBanners = async () => {
    return await db('business_pre_development').select('*').orderBy('id', 'desc');
};

// Get about banner by ID
const getAboutBannerById = async (id) => {
    return await db('business_pre_development').where({ id }).first();
};

// Update about banner by ID
const updateAboutBannerById = async (id, banner) => {
    try {
        const result = await db('business_pre_development')
            .where({ id })
            .update({
                sub_heading: banner.sub_heading,
                banner_image: banner.banner_image,
                status: banner.status || 1,
                page_type: banner.page_type || '',
                overview_text: banner.overview_text || null,
                overview_image: banner.overview_image || null,

                // ✅ Always stringify JSON fields
                key_highlights: banner.key_highlights ? JSON.stringify(banner.key_highlights) : null,
                our_approach: banner.our_approach ? JSON.stringify(banner.our_approach) : null,
                our_projects: banner.our_projects ? JSON.stringify(banner.our_projects) : null,

                updated_at: db.fn.now(),
            });

        return result;
    } catch (error) {
        console.error('❌ Error updating About Banner:', error);
        throw error;
    }
};



module.exports = { updateAboutBannerById };


// Delete about banner by ID
const deleteAboutBannerById = async (id) => {
    const result = await db('business_pre_development').where({ id }).del();
    return result;
};

module.exports = {
    createAboutBanner,
    getAllAboutBanners,
    getAboutBannerById,
    updateAboutBannerById,
    deleteAboutBannerById,
};
