const {
    createAboutBanner,
    getAllAboutBanners,
    getAboutBannerById,
    updateAboutBannerById,
    deleteAboutBannerById,
} = require('../Dao/PreDevelopmentDao.js');

// Create About Banner (with image upload)
const createAboutBannerController = async (req, res) => {
    try {
        // Step 1: Extract base fields
        const banner = {
            sub_heading: req.body.sub_heading,
            banner_image: req.files?.banner_image ? req.files.banner_image[0].filename : null,
            status: req.body.status || 1,
            overview_text: req.body.overview_text || '',
            page_type: req.body.page_type || '',
            overview_image: req.files?.overview_image ? req.files.overview_image[0].filename : null,
        };

        // Step 2: Validate required fields
        if (!banner.sub_heading) {
            return res.status(400).json({ success: false, message: 'Sub-heading is required' });
        }
        if (!banner.banner_image) {
            return res.status(400).json({ success: false, message: 'Banner image is required' });
        }

        // Step 3: Parse JSON fields safely
        let key_highlights = [];
        let our_approach = [];
        let our_projects = [];

        try {
            if (req.body.key_highlights) {
                key_highlights = JSON.parse(req.body.key_highlights);
            }
            if (req.body.our_approach) {
                our_approach = JSON.parse(req.body.our_approach);
            }
            if (req.body.our_projects) {
                our_projects = JSON.parse(req.body.our_projects);
            }
        } catch (err) {
            console.error('Error parsing JSON fields:', err);
        }

        // Step 4: Collect uploaded files for approach & project images
        const approachImages = [];
        const projectImages = [];

        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (key.startsWith('approach_image_')) {
                    approachImages.push(req.files[key][0].filename);
                }
                if (key.startsWith('project_image_')) {
                    projectImages.push(req.files[key][0].filename);
                }
            });
        }

        // Step 5: Merge uploaded images with JSON data
        const formattedApproach = our_approach.map((item, index) => ({
            ...item,
            image: approachImages[index] || null,
        }));

        const formattedProjects = our_projects.map((item, index) => ({
            ...item,
            image: projectImages[index] || null,
        }));

        // Step 6: Build final data object
        const aboutBannerData = {
            ...banner,
            key_highlights: JSON.stringify(key_highlights),
            our_approach: JSON.stringify(formattedApproach),
            our_projects: JSON.stringify(formattedProjects),
        };

        // Step 7: Save in DB via DAO
        const id = await createAboutBanner(aboutBannerData);

        res.json({
            success: true,
            message: 'About banner created successfully',
            id,
        });
    } catch (error) {
        console.error('Error creating About banner:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all About Banners
const getAllAboutBannerController = async (req, res) => {
    try {
        const banners = await getAllAboutBanners();
        res.json({ success: true, banners });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get About Banner by ID
const getAboutBannerByIdController = async (req, res) => {
    try {
        const banner = await getAboutBannerById(req.params.id);
        if (!banner) {
            return res.status(404).json({ success: false, message: 'About banner not found' });
        }
        res.json({ success: true, banner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update About Banner
const updateAboutBannerController = async (req, res) => {
    try {
        const updatedData = {
            sub_heading: req.body.sub_heading,
            overview_text: req.body.overview_text || '',
            status: req.body.status || 1,
            page_type: req.body.page_type || '',
        };

        // Handle banner & overview images
        if (req.files?.banner_image?.[0]) {
            updatedData.banner_image = req.files.banner_image[0].filename;
        } else if (req.body.existing_banner_image) {
            updatedData.banner_image = req.body.existing_banner_image;
        }

        if (req.files?.overview_image?.[0]) {
            updatedData.overview_image = req.files.overview_image[0].filename;
        } else if (req.body.existing_overview_image) {
            updatedData.overview_image = req.body.existing_overview_image;
        }

        // Parse JSON safely
        let key_highlights = [];
        let our_approach = [];
        let our_projects = [];

        try {
            if (req.body.key_highlights) {
                key_highlights = JSON.parse(req.body.key_highlights);
            }
            if (req.body.our_approach) {
                our_approach = JSON.parse(req.body.our_approach);
            }
            if (req.body.our_projects) {
                our_projects = JSON.parse(req.body.our_projects);
            }
        } catch (err) {
            console.error("Error parsing JSON fields:", err);
        }

        // ✅ Collect uploaded files with correct indices
        const approachImages = {};
        const projectImages = {};

        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (key.startsWith("approach_image_")) {
                    const index = parseInt(key.replace("approach_image_", ""));
                    approachImages[index] = req.files[key][0].filename;
                }
                if (key.startsWith("project_image_")) {
                    const index = parseInt(key.replace("project_image_", ""));
                    projectImages[index] = req.files[key][0].filename;
                }
            });
        }

        // ✅ Merge images correctly
        const formattedApproach = our_approach.map((item, index) => ({
            heading: item.heading,
            text: item.text,
            image: approachImages[index] || item.existing_image || null,
        }));

        const formattedProjects = our_projects.map((item, index) => ({
            text: item.text,
            image: projectImages[index] || item.existing_image || null,
        }));

        // ✅ Stringify once, not twice
        updatedData.key_highlights = JSON.stringify(key_highlights);
        updatedData.our_approach = JSON.stringify(formattedApproach);
        updatedData.our_projects = JSON.stringify(formattedProjects);

        // Update DB
        const result = await updateAboutBannerById(req.params.id, updatedData);

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: "About banner not found or not updated",
            });
        }

        res.json({
            success: true,
            message: "About banner updated successfully",
            updatedData,
        });
    } catch (error) {
        console.error("Error updating About banner:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
// const updateAboutBannerController = async (req, res) => {
//     try {
//         // Step 1: Extract base fields
//         const updatedData = {
//             sub_heading: req.body.sub_heading,
//             overview_text: req.body.overview_text || '',
//             status: req.body.status || 1,
//             page_type: req.body.page_type || '',
//         };

//         // Step 2: Handle banner & overview images
//         if (req.files?.banner_image?.[0]) {
//             updatedData.banner_image = req.files.banner_image[0].filename;
//         } else if (req.body.existing_banner_image) {
//             updatedData.banner_image = req.body.existing_banner_image;
//         }

//         if (req.files?.overview_image?.[0]) {
//             updatedData.overview_image = req.files.overview_image[0].filename;
//         } else if (req.body.existing_overview_image) {
//             updatedData.overview_image = req.body.existing_overview_image;
//         }

//         // Step 3: Parse JSON safely
//         let key_highlights = [];
//         let our_approach = [];
//         let our_projects = [];

//         try {
//             if (req.body.key_highlights) {
//                 key_highlights = JSON.parse(req.body.key_highlights);
//             }
//             if (req.body.our_approach) {
//                 our_approach = JSON.parse(req.body.our_approach);
//             }
//             if (req.body.our_projects) {
//                 our_projects = JSON.parse(req.body.our_projects);
//             }
//         } catch (err) {
//             console.error("Error parsing JSON fields:", err);
//         }

//         // Step 4: Collect uploaded files for approach & project images
//         const approachImages = [];
//         const projectImages = [];

//         if (req.files) {
//             Object.keys(req.files).forEach((key) => {
//                 if (key.startsWith("approach_image_")) {
//                     approachImages.push(req.files[key][0].filename);
//                 }
//                 if (key.startsWith("project_image_")) {
//                     projectImages.push(req.files[key][0].filename);
//                 }
//             });
//         }

//         // Step 5: Merge uploaded/new/existing images
//         const formattedApproach = our_approach.map((item, index) => ({
//             heading: item.heading,
//             text: item.text,
//             image:
//                 approachImages[index] ||
//                 item.image ||
//                 item.existing_image ||
//                 null,
//         }));

//         const formattedProjects = our_projects.map((item, index) => ({
//             text: item.text,
//             image:
//                 projectImages[index] ||
//                 item.image ||
//                 item.existing_image ||
//                 null,
//         }));

//         // Step 6: Build final update object
//         updatedData.key_highlights = JSON.stringify(key_highlights);
//         updatedData.our_approach = JSON.stringify(formattedApproach);
//         updatedData.our_projects = JSON.stringify(formattedProjects);

//         // Step 7: Update DB
//         const result = await updateAboutBannerById(req.params.id, updatedData);

//         if (result === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "About banner not found or not updated",
//             });
//         }

//         res.json({
//             success: true,
//             message: "About banner updated successfully",
//             updatedData,
//         });
//     } catch (error) {
//         console.error("Error updating About banner:", error);
//         res
//             .status(500)
//             .json({ success: false, message: "Server error", error: error.message });
//     }
// };




// Delete About Banner
const deleteAboutBannerController = async (req, res) => {
    try {
        const result = await deleteAboutBannerById(req.params.id);
        res.json({
            success: true,
            message: result ? 'About banner deleted' : 'About banner not found',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAboutBannerController,
    getAllAboutBannerController,
    getAboutBannerByIdController,
    updateAboutBannerController,
    deleteAboutBannerController,
};
