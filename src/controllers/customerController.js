const { v4: uuidv4 } = require("uuid");
const Customer = require("../models/Customer");

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



// Get all customers
const getCustomers = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await Customer.getAll({ page, pageSize });

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


module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    getCustomerWithCars,
    updateCustomer,
    deleteCustomer
};