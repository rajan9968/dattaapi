const { createBanner, getAllBanner, getBannerByIds, updateBannerById, deleteBannerById } = require('../Dao/bannerDao');
const e = require("express");
const db = require('../config/db');


// Create banner
const createBanners = async (req, res) => {
    try {
        // Parse the array of content-number pairs
        const contents = req.body.contents ? JSON.parse(req.body.contents) : [];

        // Build banner object
        const banner = {
            heading: req.body.heading,
            subheading: req.body.subheading,
            content: JSON.stringify(contents), // store as JSON
            image: req.file ? req.file.filename : null,
            status: req.body.status || 1
        };

        const id = await createBanner(banner);
        res.json({ success: true, message: "Banner created", id });
    } catch (err) {
        console.error("Error creating banner:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};


// Get all banners
const getAllBanners = async (req, res) => {
    try {
        const banners = await getAllBanner();
        res.json({ success: true, banners });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getBannerById = async (req, res) => {
    try {
        const banner = await getBannerByIds(req.params.id);
        if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });
        res.json({ success: true, banner });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update banner
const updateBanner = async (req, res) => {
    try {
        let contentData = [];

        // ✅ Handle `content` and `number` as JSON array or plain text
        if (req.body.content) {
            try {
                // Parse JSON from frontend (array of { content, number })
                const parsed = JSON.parse(req.body.content);
                if (Array.isArray(parsed)) {
                    contentData = parsed;
                } else {
                    contentData = [{ content: req.body.content, number: req.body.number || '' }];
                }
            } catch {
                // If not valid JSON, fallback to single entry
                contentData = [{ content: req.body.content, number: req.body.number || '' }];
            }
        }

        // ✅ Prepare banner object
        const banner = {
            heading: req.body.heading,
            subheading: req.body.subheading,
            content: JSON.stringify(contentData), // store as JSON string
            status: req.body.status || 1
        };

        // ✅ Only update image if uploaded
        if (req.file && req.file.filename) {
            banner.image = req.file.filename;
        }

        // ✅ Call DB update helper
        const result = await updateBannerById(req.params.id, banner);

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: "Banner not found or nothing to update"
            });
        }

        res.json({
            success: true,
            message: "Banner updated successfully"
        });

    } catch (err) {
        console.error("Error updating banner:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
};

// Delete banner
const deleteBanner = async (req, res) => {
    try {
        const deleted = await deleteBannerById(req.params.id);
        res.json({ success: true, message: deleted ? "Banner deleted" : "Banner not found" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = {
    createBanners,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner
};