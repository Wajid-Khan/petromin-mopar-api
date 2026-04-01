const { v4: uuidv4 } = require("uuid");
const Booking = require("../models/Booking");

// Create booking
const createBooking = async (req, res) => {

    try {

        const data = {
            id: uuidv4(),
            ...req.body
        };

        const booking = await Booking.create(data);

        res.json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });

    } catch (error) {

        console.error("Create booking error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Get all bookings
const getBookings = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await Booking.getAll({ page, pageSize });

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error("Get bookings error:", error);

        res.status(500).json({
            success: false
        });

    }

};

// Get booking by ID
const getBookingById = async (req, res) => {

    try {

        const { id } = req.params;

        const booking = await Booking.getById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            data: booking
        });

    } catch (error) {

        console.error("Get booking error:", error);

        res.status(500).json({
            success: false
        });

    }

};

// Update booking status
const updateBookingStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { booking_status_id } = req.body;

        const booking = await Booking.updateStatus(id, booking_status_id);

        res.json({
            success: true,
            message: "Status updated",
            data: booking
        });

    } catch (error) {

        console.error("Update booking error:", error);

        res.status(500).json({
            success: false
        });

    }

};


module.exports = {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingStatus
};