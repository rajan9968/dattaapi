const {
    createAboutBanner,
    getAllAboutBanners,
    getAboutBannerById,
    updateAboutBannerById,
    deleteAboutBannerById,
} = require('../Dao/mappingDao');

// ✅ Create record (image + state_location array)
const createAboutBannerController = async (req, res) => {
    try {
        // Parse state_location from frontend (JSON string)
        const stateLocationData = req.body.state_location
            ? JSON.parse(req.body.state_location)
            : [];

        const banner = {
            image: req.file ? req.file.filename : null,
            state_location: stateLocationData,
        };

        const id = await createAboutBanner(banner);
        res.json({ success: true, message: 'Record created successfully', id });
    } catch (error) {
        console.error('Create error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get all
const getAllAboutBannerController = async (req, res) => {
    try {
        const banners = await getAllAboutBanners();
        res.json({ success: true, banners });
    } catch (error) {
        console.error('Get all error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get by ID
const getAboutBannerByIdController = async (req, res) => {
    try {
        const banner = await getAboutBannerById(req.params.id);

        if (!banner) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.json({ success: true, banner });
    } catch (error) {
        console.error('Get by ID error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update record
const updateAboutBannerController = async (req, res) => {
    try {
        const stateLocationData = req.body.state_location
            ? JSON.parse(req.body.state_location)
            : [];

        const updatedData = {
            state_location: stateLocationData,
        };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        const result = await updateAboutBannerById(req.params.id, updatedData);

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'Record not found or not updated',
            });
        }

        res.json({
            success: true,
            message: 'Record updated successfully',
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Delete record
const deleteAboutBannerController = async (req, res) => {
    try {
        const result = await deleteAboutBannerById(req.params.id);
        res.json({
            success: true,
            message: result ? 'Record deleted successfully' : 'Record not found',
        });
    } catch (error) {
        console.error('Delete error:', error);
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
