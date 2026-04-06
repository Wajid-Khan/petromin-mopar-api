const { v4: uuidv4 } = require("uuid");
const Employees = require("../models/Employees");

// 🔹 Get all
const getEmployees = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const search = req.query.search || "";
        const role_id = req.query.role_id || null;

        const result = await Employees.getAll({
            page,
            pageSize,
            search,
            role_id
        });

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error("Get employees error:", error);

        res.status(500).json({ success: false });
    }
};


// 🔹 Get by ID
const getEmployeeById = async (req, res) => {

    try {

        const employee = await Employees.getById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.json({
            success: true,
            data: employee
        });

    } catch (error) {

        res.status(500).json({ success: false });
    }
};


// 🔹 Create
const createEmployee = async (req, res) => {
    try {

        console.log("BODY:", req.body); // 👈 DEBUG

        const employee = await Employees.create({
            emp_id: uuidv4(),
            ...req.body
        });

        res.json({
            success: true,
            message: "Employee created",
            data: employee
        });

    } catch (error) {

        console.error("🔥 Create employee error:", error);

        res.status(500).json({
            success: false,
            message: error.message   // ✅ THIS LINE VERY IMPORTANT
        });
    }
};


// 🔹 Update
const updateEmployee = async (req, res) => {

    try {

        const employee = await Employees.update(req.params.id, req.body);

        res.json({
            success: true,
            message: "Employee updated",
            data: employee
        });

    } catch (error) {

        res.status(500).json({ success: false });
    }
};


// 🔹 Delete
const deleteEmployee = async (req, res) => {

    try {

        const employee = await Employees.delete(req.params.id);

        res.json({
            success: true,
            message: "Employee deleted",
            data: employee
        });

    } catch (error) {

        res.status(500).json({ success: false });
    }
};

const updatePasswordByEmail = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const employee = await Employees.updatePasswordByEmail(email, password);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {

        console.error("Update password error:", error);

        res.status(500).json({
            success: false
        });
    }
};

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updatePasswordByEmail
};