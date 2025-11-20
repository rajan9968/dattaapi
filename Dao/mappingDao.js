const db = require('../config/db');

// ✅ Create new timeline (image + combined state/location array)
const createAboutBanner = async (banner) => {
    const [id] = await db('about_mapping').insert({
        image: banner.image,
        state_location: JSON.stringify(banner.state_location), // [{state, location}]
    });
    return id;
};

// ✅ Get all
const getAllAboutBanners = async () => {
    const results = await db('about_mapping').select('*').orderBy('id', 'desc');

    return results.map(item => ({
        ...item,
        state_location:
            typeof item.state_location === 'string'
                ? JSON.parse(item.state_location)
                : item.state_location || [],
    }));
};


// ✅ Get single
const getAboutBannerById = async (id) => {
    const banner = await db('about_mapping').where({ id }).first();
    if (!banner) return null;

    let state_location = [];

    try {
        if (typeof banner.state_location === 'string') {
            // First parse
            let parsed = JSON.parse(banner.state_location);

            // Sometimes double-encoded JSON needs another parse
            if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }

            state_location = parsed;
        } else if (Array.isArray(banner.state_location)) {
            state_location = banner.state_location;
        }
    } catch (err) {
        console.error('Error parsing state_location:', err);
        state_location = [];
    }

    return {
        ...banner,
        state_location,
    };
};


// ✅ Update record
const updateAboutBannerById = async (id, banner) => {
    const updateData = {
        state_location: JSON.stringify(banner.state_location),
    };

    if (banner.image) {
        updateData.image = banner.image;
    }

    const result = await db('about_mapping')
        .where({ id })
        .update(updateData);

    return result;
};

// ✅ Delete record
const deleteAboutBannerById = async (id) => {
    return await db('about_mapping').where({ id }).del();
};

module.exports = {
    createAboutBanner,
    getAllAboutBanners,
    getAboutBannerById,
    updateAboutBannerById,
    deleteAboutBannerById,
};
