const LookUp = require("../models/LookUp");

const getCities = async (req, res) => {

    try {

        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await LookUp.getCities({
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

        console.error("City lookup error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getTimeslots = async (req, res) => {

    try {

        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await LookUp.getTimeslots({
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

        console.error("Timeslot lookup error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getBookingStatus = async (req, res) => {

    try {

        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await LookUp.getBookingStatus({
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

        console.error("Booking status lookup error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getVehicleConcerns = async (req, res) => {

    try {

        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await LookUp.getVehicleConcerns({
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

        console.error("Vehicle concerns lookup error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getVehicleServices = async (req, res) => {

    try {

        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await LookUp.getVehicleServices({
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

        console.error("Vehicle services lookup error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    getCities,
    getTimeslots,
    getBookingStatus,
    getVehicleConcerns,
    getVehicleServices
}