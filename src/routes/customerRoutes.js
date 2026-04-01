const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");

router.post("/createCustomers", customerController.createCustomer);
router.get("/getCustomers", customerController.getCustomers);
router.get("/getCustomers/:id", customerController.getCustomerById);
router.get("/getCustomerWithCar/:id/cars", customerController.getCustomerWithCars);
router.put("/uddateCustomer/:id", customerController.updateCustomer);
router.delete("/deleteCustomer/:id", customerController.deleteCustomer);

module.exports = router;