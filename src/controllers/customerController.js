const { v4: uuidv4 } = require("uuid");
const Customer = require("../models/Customer");
const Auth = require("../models/Auth");

// Create customer
const createCustomer = async (req, res) => {

    try {

        const data = {
            id: uuidv4(),
            ...req.body
        };

        const customer = await Customer.create(data);

        res.json({
            success: true,
            message: "Customer created",
            data: customer
        });

    } catch (error) {

        console.error("Create customer error:", error);

        res.status(500).json({
            success: false
        });

    }

};

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Create customer
const createCustomerWhileBooking = async (req, res) => {

    try {

        const data = {
            id: uuidv4(),
            ...req.body
        };

        const customer = await Customer.createCustomerWhileBooking(data);
        const otp = generateOTP();
        const otp_type = "customer_booking";
        await Auth.createOTP({
            cor_id: uuidv4(),
            otp_type,
            otp_request: req.body.mobile,
            otp_code: otp,
            otp_generated_at: new Date(),
            otp_sent_at: new Date()
        });

        // send otp either via SMS or email based on input type (mobile or email)

        res.json({
            success: true,
            message: "Customer created but not verified, enter OTP to verify",
            otp: otp,
            data: customer
        });

    } catch (error) {

        console.error("Create customer error:", error);

        res.status(500).json({
            success: false
        });

    }

};

// Get all customers
// const getCustomers = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const pageSize = parseInt(req.query.pageSize) || 10;

//         const result = await Customer.getAll({ page, pageSize });

//         res.json({
//             success: true,
//             ...result
//         });

//     } catch (error) {

//         console.error("Get customers error:", error);

//         res.status(500).json({
//             success: false
//         });

//     }
// };
const getCustomers = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const search = req.query.search || "";

        const result = await Customer.getAll({ page, pageSize, search });

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error("Get customers error:", error);

        res.status(500).json({
            success: false
        });

    }
};


// Get customer by ID
const getCustomerById = async (req, res) => {

    try {

        const { id } = req.params;

        const customer = await Customer.getById(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.json({
            success: true,
            data: customer
        });

    } catch (error) {

        console.error("Get customer error:", error);

        res.status(500).json({
            success: false
        });

    }

};


// Get customer with cars
const getCustomerWithCars = async (req, res) => {

    try {

        const { id } = req.params;

        const data = await Customer.getWithCars(id);

        res.json({
            success: true,
            data
        });

    } catch (error) {

        console.error("Get customer with cars error:", error);

        res.status(500).json({
            success: false
        });

    }

};


// Update customer
const updateCustomer = async (req, res) => {

    try {

        const { id } = req.params;

        const customer = await Customer.update(id, req.body);

        res.json({
            success: true,
            message: "Customer updated",
            data: customer
        });

    } catch (error) {

        console.error("Update customer error:", error);

        res.status(500).json({
            success: false
        });

    }

};

// Delete customer
const deleteCustomer = async (req, res) => {

    try {

        const { id } = req.params;

        const customer = await Customer.delete(id);

        res.json({
            success: true,
            message: "Customer deleted",
            data: customer
        });

    } catch (error) {

        console.error("Delete customer error:", error);

        res.status(500).json({
            success: false
        });

    }

};

const addCustomerCar = async (req, res) => {

    try {

        const {
            customer_id,
            model_id,
            brand_id,
            variant_id,
            year_id,
            vehicle_number_plate,
            vin,
            created_by
        } = req.body;

        // ✅ Validation
        if (!customer_id || !model_id || !brand_id) {
            return res.status(400).json({
                success: false,
                message: "customer_id, model_id, brand_id are required"
            });
        }

        const newCar = await Customer.addCustomerCar({
            id: uuidv4(),
            customer_id,
            model_id,
            brand_id,
            variant_id: variant_id || null,
            year_id: year_id || null,
            vehicle_number_plate: vehicle_number_plate || null,
            vin: vin || null,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            created_by: created_by || null
        });

        res.status(201).json({
            success: true,
            message: "Customer car added successfully",
            data: newCar
        });

    } catch (error) {

        console.error("Add customer car error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getCustomerCars = async (req, res) => {
    try {
        const { customerId } = req.params;

        const cars = await Customer.getCustomerCars(customerId);

        res.json({
            success: true,
            data: cars
        });

    } catch (err) {
        console.error("getCustomerCars error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    getCustomerWithCars,
    updateCustomer,
    deleteCustomer,
    addCustomerCar,
    createCustomerWhileBooking,
    getCustomerCars
};