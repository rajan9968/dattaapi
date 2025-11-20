const {
    createOurCulture,
    getAllOurCulture,
    getOurCultureById,
    updateOurCultureById,
    deleteOurCultureById,
} = require('../Dao/OurCultureDao.js');

// =========================
// Create Our Culture
// =========================
const createOurCultureController = async (req, res) => {
    try {
        // ===== Parse incoming text fields =====
        const {
            banner_sub_heading,
            culture_sub_heading,
            community_sub_heading,
            key_sub_heading,
            key_text_on_image,
            employee_sub_heading,
            type,
            status,
        } = req.body;

        // Safely parse JSON arrays
        const our_culture = JSON.parse(req.body.our_culture || '[]');
        const community_initiatives = JSON.parse(req.body.community_initiatives || '[]');
        const employee_initiatives = JSON.parse(req.body.employee_initiatives || '[]');

        // ===== Handle uploaded files =====
        const files = req.files || [];

        const getFile = (name) =>
            files.find((file) => file.fieldname === name)?.filename || null;

        const getFilesByPrefix = (prefix) =>
            files
                .filter((file) => file.fieldname.startsWith(prefix))
                .map((f) => f.filename);

        // Map image arrays to their respective items
        const ourCultureImages = getFilesByPrefix('our_culture_image_');
        our_culture.forEach((item, i) => {
            item.image = ourCultureImages[i] || null;
        });

        const communityImages = getFilesByPrefix('community_image_');
        community_initiatives.forEach((item, i) => {
            item.image = communityImages[i] || null;
        });

        const employeeImages = getFilesByPrefix('employee_image_');
        employee_initiatives.forEach((item, i) => {
            item.image = employeeImages[i] || null;
        });

        // ===== Prepare DB data =====
        const data = {
            banner_sub_heading,
            banner_image: getFile('banner_image'),
            culture_sub_heading,
            our_culture: JSON.stringify(our_culture),
            community_sub_heading,
            community_initiatives: JSON.stringify(community_initiatives),
            key_sub_heading,
            key_image: getFile('key_image'),
            key_text_on_image,
            employee_sub_heading,
            employee_initiatives: JSON.stringify(employee_initiatives),
            type,
            status,
        };

        // ===== Insert into DB =====
        const id = await createOurCulture(data);


        res.json({
            success: true,
            message: 'Our Culture section created successfully.',
            id,
        });
    } catch (error) {
        console.error('Error creating Our Culture:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// =========================
// Get All
// =========================
const getAllOurCultureController = async (req, res) => {
    try {
        const cultures = await getAllOurCulture();
        res.json({ success: true, cultures });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// =========================
// Get By ID
// =========================
const getOurCultureByIdController = async (req, res) => {
    try {
        const culture = await getOurCultureById(req.params.id);
        if (!culture) {
            return res
                .status(404)
                .json({ success: false, message: 'Our Culture record not found' });
        }
        res.json({ success: true, culture });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// =========================
// Update Our Culture
// =========================
const updateOurCultureController = async (req, res) => {
    try {
        const id = req.params.id;

        // Convert req.files array into a map (for easier lookup)
        const filesMap = {};
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(file => {
                filesMap[file.fieldname] = file.filename;
            });
        }

        // Prepare updated data
        const updatedData = {
            banner_sub_heading: req.body.banner_sub_heading,
            key_sub_heading: req.body.key_sub_heading,

            key_text_on_image: req.body.key_text_on_image,
            employee_sub_heading: req.body.employee_sub_heading,
            culture_sub_heading: req.body.culture_sub_heading,
            community_sub_heading: req.body.community_sub_heading,
            employee_heading: req.body.employee_heading,
            employee_description: req.body.employee_description,
            type: req.body.type,
            status: req.body.status,
        };

        // ===== Handle main images with fallback =====
        updatedData.banner_image =
            filesMap.banner_image || req.body.existing_banner_image;

        updatedData.key_image =
            filesMap.key_image || req.body.existing_key_image;

        updatedData.employee_image =
            filesMap.employee_image || req.body.existing_employee_image;

        // ===== Handle dynamic array fields =====
        const ourCultureItems = JSON.parse(req.body.our_culture || '[]');
        const communityItems = JSON.parse(req.body.community_initiatives || '[]');
        const employeeItems = JSON.parse(req.body.employee_initiatives || '[]');

        // ✅ Handle our_culture images
        ourCultureItems.forEach((item, i) => {
            const fieldName = `our_culture_image_${i}`;
            if (filesMap[fieldName]) {
                item.image = filesMap[fieldName];
            }
        });

        // ✅ Handle community images
        communityItems.forEach((item, i) => {
            const fieldName = `community_image_${i}`;
            if (filesMap[fieldName]) {
                item.image = filesMap[fieldName];
            }
        });

        // ✅ Handle employee images (NEW FIX)
        employeeItems.forEach((item, i) => {
            const fieldName = `employee_image_${i}`;
            if (filesMap[fieldName]) {
                // If new image uploaded
                item.image = filesMap[fieldName];
            } else if (item.existing_image) {
                // Keep existing image
                item.image = item.existing_image;
            }
        });

        // Store updated JSON strings in DB
        updatedData.our_culture = JSON.stringify(ourCultureItems);
        updatedData.community_initiatives = JSON.stringify(communityItems);
        updatedData.employee_initiatives = JSON.stringify(employeeItems);

        // ===== Run update query =====
        const result = await updateOurCultureById(id, updatedData);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Culture record not found or not updated',
            });
        }

        return res.json({
            success: true,
            message: 'Culture updated successfully',
        });
    } catch (error) {
        console.error('Error updating Culture:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// const updateOurCultureController = async (req, res) => {
//     try {
//         const id = req.params.id;

//         // ===== Convert req.files into a lookup map =====
//         const filesMap = {};
//         if (req.files && Array.isArray(req.files)) {
//             req.files.forEach(file => {
//                 filesMap[file.fieldname] = file.filename;
//             });
//         }

//         // ===== Prepare base data =====
//         const updatedData = {
//             banner_sub_heading: req.body.banner_sub_heading,
//             culture_sub_heading: req.body.culture_sub_heading,
//             community_sub_heading: req.body.community_sub_heading,
//             key_sub_heading: req.body.key_sub_heading,
//             key_text_on_image: req.body.key_text_on_image,
//             employee_sub_heading: req.body.employee_sub_heading,
//             type: req.body.type,
//             status: req.body.status,
//         };

//         // ===== Handle main single images =====
//         updatedData.banner_image =
//             filesMap.banner_image || req.body.existing_banner_image || null;

//         updatedData.key_image =
//             filesMap.key_image || req.body.existing_key_image || null;

//         // ===== Handle Dynamic Arrays =====

//         // ✅ Our Culture section
//         const ourCultureItems = JSON.parse(req.body.our_culture || '[]');
//         ourCultureItems.forEach((item, i) => {
//             const fieldName = `our_culture_image_${i}`;
//             if (filesMap[fieldName]) {
//                 item.image = filesMap[fieldName];
//             }
//         });

//         // ✅ Community Initiatives section
//         const communityItems = JSON.parse(req.body.community_initiatives || '[]');
//         communityItems.forEach((item, i) => {
//             const fieldName = `community_image_${i}`;
//             if (filesMap[fieldName]) {
//                 item.image = filesMap[fieldName];
//             }
//         });

//         // ✅ Employee Initiatives section
//         const employeeItems = JSON.parse(req.body.employee_initiatives || '[]');
//         employeeItems.forEach((item, i) => {
//             const fieldName = `employee_image_${i}`;
//             if (filesMap[fieldName]) {
//                 item.image = filesMap[fieldName];
//             }
//         });

//         // ===== Convert arrays to JSON strings for DB =====
//         updatedData.our_culture = JSON.stringify(ourCultureItems);
//         updatedData.community_initiatives = JSON.stringify(communityItems);
//         updatedData.employee_initiatives = JSON.stringify(employeeItems);

//         // ===== Update DB =====
//         const result = await updateOurCultureById(id, updatedData);

//         if (!result) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Culture record not found or not updated',
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Culture updated successfully',
//         });
//     } catch (error) {
//         console.error('Error updating Culture:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message || 'Server error',
//         });
//     }
// };





// =========================
// Delete
// =========================
const deleteOurCultureController = async (req, res) => {
    try {
        const result = await deleteOurCultureById(req.params.id);
        res.json({
            success: true,
            message: result
                ? 'Our Culture record deleted successfully.'
                : 'Our Culture record not found.',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createOurCultureController,
    getAllOurCultureController,
    getOurCultureByIdController,
    updateOurCultureController,
    deleteOurCultureController,
};
