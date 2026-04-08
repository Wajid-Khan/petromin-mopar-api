const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");

router.post("/createCustomers", customerController.createCustomer);
router.post("/createCustomersWhileBooking", customerController.createCustomerWhileBooking);
router.get("/getCustomers", customerController.getCustomers);
router.get("/getCustomers/:id", customerController.getCustomerById);
router.get("/getCustomerWithCar/:id/cars", customerController.getCustomerWithCars);
router.put("/updateCustomer/:id", customerController.updateCustomer);
router.delete("/deleteCustomer/:id", customerController.deleteCustomer);
router.post("/addCar", customerController.addCustomerCar);

module.exports = router;