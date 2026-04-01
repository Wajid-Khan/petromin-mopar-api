const { v4: uuidv4 } = require("uuid");
const Product = require("../models/Product");


// ==============================
// 🔹 PARTS CONTROLLER
// ==============================

// Get all parts
const getParts = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await Product.getParts({ page, pageSize });

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error("Get parts error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// Get part by ID
const getPartById = async (req, res) => {
    try {

        const { id } = req.params;

        const part = await Product.getPartById(id);

        if (!part) {
            return res.status(404).json({
                success: false,
                message: "Part not found"
            });
        }

        res.json({
            success: true,
            data: part
        });

    } catch (error) {

        console.error("Get part error:", error);

        res.status(500).json({
            success: false
        });
    }
};


// Create part
const createPart = async (req, res) => {
    try {

        const part = await Product.createPart({
            id: uuidv4(),
            ...req.body
        });

        res.json({
            success: true,
            message: "Part created successfully",
            data: part
        });

    } catch (error) {

        console.error("Create part error:", error);

        res.status(500).json({
            success: false
        });
    }
};


// Update part
const updatePart = async (req, res) => {
    try {

        const { id } = req.params;

        const part = await Product.updatePart(id, req.body);

        if (!part) {
            return res.status(404).json({
                success: false,
                message: "Part not found"
            });
        }

        res.json({
            success: true,
            message: "Part updated successfully",
            data: part
        });

    } catch (error) {

        console.error("Update part error:", error);

        res.status(500).json({
            success: false
        });
    }
};


// Delete part
const deletePart = async (req, res) => {
    try {

        const { id } = req.params;

        const part = await Product.deletePart(id);

        if (!part) {
            return res.status(404).json({
                success: false,
                message: "Part not found"
            });
        }

        res.json({
            success: true,
            message: "Part deleted successfully",
            data: part
        });

    } catch (error) {

        console.error("Delete part error:", error);

        res.status(500).json({
            success: false
        });
    }
};



// ==============================
// 🔹 ACCESSORIES CONTROLLER
// ==============================

// Get all accessories
const getAccessories = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await Product.getAccessories({ page, pageSize });

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error("Get accessories error:", error);

        res.status(500).json({
            success: false
        });
    }
};


// Get accessory by ID
const getAccessoryById = async (req, res) => {
    try {

        const { id } = req.params;

        const accessory = await Product.getAccessoryById(id);

        if (!accessory) {
            return res.status(404).json({
                success: false,
                message: "Accessory not found"
            });
        }

        res.json({
            success: true,
            data: accessory
        });

    } catch (error) {

        console.error("Get accessory error:", error);

        res.status(500).json({
            success: false
        });
    }
};


// Create accessory
const createAccessory = async (req, res) => {
    try {

        const accessory = await Product.createAccessory({
            id: uuidv4(),
            ...req.body
        });

        res.json({
            success: true,
            message: "Accessory created successfully",
            data: accessory
        });

    } catch (error) {

        console.error("Create accessory error:", error);

        res.status(500).json({
            success: false
        });
    }
};


// Update accessory
const updateAccessory = async (req, res) => {
    try {

        const { id } = req.params;

        const accessory = await Product.updateAccessory(id, req.body);

        if (!accessory) {
            return res.status(404).json({
                success: false,
                message: "Accessory not found"
            });
        }

        res.json({
            success: true,
            message: "Accessory updated successfully",
            data: accessory
        });

    } catch (error) {

        console.error("Update accessory error:", error);

        res.status(500).json({
            success: false
        });
    }
};


// Delete accessory
const deleteAccessory = async (req, res) => {
    try {

        const { id } = req.params;

        const accessory = await Product.deleteAccessory(id);

        if (!accessory) {
            return res.status(404).json({
                success: false,
                message: "Accessory not found"
            });
        }

        res.json({
            success: true,
            message: "Accessory deleted successfully",
            data: accessory
        });

    } catch (error) {

        console.error("Delete accessory error:", error);

        res.status(500).json({
            success: false
        });
    }
};



// ==============================
// EXPORTS
// ==============================

module.exports = {
    // Parts
    getParts,
    getPartById,
    createPart,
    updatePart,
    deletePart,

    // Accessories
    getAccessories,
    getAccessoryById,
    createAccessory,
    updateAccessory,
    deleteAccessory
};