const db = require('../config/db');

// Create new about banner
const createAboutBanner = async (banner) => {
    const [id] = await db('resources_video').insert({
        sub_heading: banner.sub_heading,
        video_url: banner.video_url,
        banner_image: banner.banner_image,
        status: banner.status,
    });
    return id;
};

// Get all about banners
const getAllAboutBanners = async () => {
    return await db('resources_video').select('*').orderBy('id', 'desc');
};

// Get about banner by ID
const getAboutBannerById = async (id) => {
    return await db('resources_video').where({ id }).first();
};

// Update about banner by ID
const updateAboutBannerById = async (id, banner) => {
    const result = await db('resources_video')
        .where({ id })
        .update({
            sub_heading: banner.sub_heading,
            video_url: banner.video_url,
            banner_image: banner.banner_image,
            status: banner.status,
        });
    return result;
};

// Delete about banner by ID
const deleteAboutBannerById = async (id) => {
    const result = await db('resources_video').where({ id }).del();
    return result;
};

module.exports = {
    createAboutBanner,
    getAllAboutBanners,
    getAboutBannerById,
    updateAboutBannerById,
    deleteAboutBannerById,
};
