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

const getYears = async (req, res) => {

    try {

        const search = req.query.search || "";
        const brandId = req.query.brandId || "";
        const modelId = req.query.modelId || "";
        const variantId = req.query.variantId || "";

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

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

module.exports = {
    getBrands,
    getModels,
    getVariants,
    getYears
}