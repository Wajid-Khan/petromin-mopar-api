const express = require("express");
const router = express.Router();

const controller = require("../controllers/employeesController");

router.get("/getEmployees", controller.getEmployees);
router.get("/getEmployee/:id", controller.getEmployeeById);
router.post("/createEmployee", controller.createEmployee);
router.put("/updateEmployee/:id", controller.updateEmployee);
router.delete("/deleteEmployee/:id", controller.deleteEmployee);
router.put("/updatePassword", controller.updatePasswordByEmail);

module.exports = router;