const { v4: uuidv4 } = require("uuid");
const Booking = require("../models/Booking");

// Create booking
// const createBooking = async (req, res) => {

//     try {

//         const data = {
//             id: uuidv4(),
//             ...req.body
//         };

//         const booking = await Booking.create(data);

//         res.json({
//             success: true,
//             message: "Booking created successfully",
//             data: booking
//         });

//     } catch (error) {

//         console.error("Create booking error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });

//     }

// };
const createBooking = async (req, res) => {

    try {

        let customer_id = req.body.customer_id;
        let customer_car_id = req.body.customer_car_id;

        // ================================
        // ✅ CASE 1: NEW CUSTOMER
        // ================================
        if (!customer_id) {

            const customerPayload = {
                id: uuidv4(),
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                mobile: req.body.mobile,
                gender: req.body.gender
            };

            const customer = await Customer.create(customerPayload);
            customer_id = customer.id;

            const carPayload = {
                id: uuidv4(),
                customer_id,
                model_id: req.body.model_id,
                brand_id: req.body.brand_id,
                variant_id: req.body.variant_id,
                year_id: req.body.year_id,
                vehicle_number_plate: req.body.vehicle_number_plate,
                vin: req.body.vin
            };

            const car = await CustomerCar.create(carPayload);
            customer_car_id = car.id;
        }

        // ================================
        // ✅ CASE 2: EXISTING CUSTOMER - ADD NEW CAR
        // ================================
        if (customer_id && req.body.new_car) {

            const carPayload = {
                id: uuidv4(),
                customer_id,
                model_id: req.body.model_id,
                brand_id: req.body.brand_id,
                variant_id: req.body.variant_id,
                year_id: req.body.year_id,
                vehicle_number_plate: req.body.vehicle_number_plate,
                vin: req.body.vin
            };

            const car = await CustomerCar.create(carPayload);
            customer_car_id = car.id;
        }

        // ================================
        // ✅ CREATE BOOKING (COMMON)
        // ================================
        const bookingPayload = {
            id: uuidv4(),
            customer_id,
            customer_car_id,
            mileage: req.body.mileage,
            services: req.body.services,
            concerns: req.body.concerns,
            comments: req.body.comments,
            city_id: req.body.city_id,
            service_center_id: req.body.service_center_id,
            service_date: req.body.service_date,
            service_time: req.body.service_time,
            booking_status_id: req.body.booking_status_id || 1
        };

        const booking = await Booking.create(bookingPayload);

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