const Vehicle = require("../models/Vehicle");

const getBrands = async (req, res) => {

    try {

        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await Vehicle.getBrands({
            search,
            page,
            pageSize
        });

        res.json({
            success: true,
            total: result.total,
            page: result.page,
            pageSize: result.pageSize,
            data: result.data
        });

    } catch (error) {

        console.error("Vehicle brand error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getModels = async (req, res) => {

    try {

        const search = req.query.search || "";
        const brandId = req.query.brandId || "";

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await Vehicle.getModels({
            search,
            brandId,
            page,
            pageSize
        });

        res.json({
            success: true,
            total: result.total,
            page: result.page,
            pageSize: result.pageSize,
            data: result.data
        });

    } catch (error) {

        console.error("Vehicle model error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getModelById = async (req, res) => {

    try {

        const modelId = req.params.id;

        const model = await Vehicle.getModelById(modelId);

        if (!model) {
            return res.status(404).json({
                success: false,
                message: "Model not found"
            });
        }

        res.json({
            success: true,
            data: model
        });

    } catch (error) {

        console.error("Get model error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getVariants = async (req, res) => {

    try {

        const search = req.query.search || "";
        const brandId = req.query.brandId || "";
        const modelId = req.query.modelId || "";

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await Vehicle.getVariants({
            search,
            brandId,
            modelId,
            page,
            pageSize
        });

        res.json({
            success: true,
            total: result.total,
            page: result.page,
            pageSize: result.pageSize,
            data: result.data
        });

    } catch (error) {

        console.error("Vehicle variant error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getVariantById = async (req, res) => {

    try {

        const variantId = req.params.id;

        const variant = await Vehicle.getVariantById(variantId);

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found"
            });
        }

        res.json({
            success: true,
            data: variant
        });

    } catch (error) {

        console.error("Get variant error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getYears = async (req, res) => {

    try {

        const search = req.query.search || "";
        const brandId = req.query.brandId || "";
        const modelId = req.query.modelId || "";
        const variantId = req.query.variantId || "";

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 100;

        const result = await Vehicle.getYears({
            search,
            brandId,
            modelId,
            variantId,
            page,
            pageSize
        });

        res.json({
            success: true,
            total: result.total,
            page: result.page,
            pageSize: result.pageSize,
            data: result.data
        });

    } catch (error) {

        console.error("Vehicle year error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ✅ GET CONCERNS
const getConcerns = async (req, res) => {
    try {
        const data = await Vehicle.getConcerns();

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Concern error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ✅ GET SERVICES
const getServices = async (req, res) => {
    try {
        const data = await Vehicle.getServices();

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Service error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getBrands,
    getModels,
    getVariants,
    getYears,
    getModelById,
    getVariantById,
    getConcerns,
    getServices
}