const express = require("express");
const router = express.Router();

const lookupController = require("../controllers/lookupController");

router.get("/cities", lookupController.getCities);
router.get("/timeslots", lookupController.getTimeslots);
router.get("/booking-status", lookupController.getBookingStatus);
router.get("/vehicle-concerns", lookupController.getVehicleConcerns);
router.get("/vehicle-services", lookupController.getVehicleServices);
router.get("/engine-sizes", lookupController.getEngineSizes);
router.get("/performance-accessory-categories", lookupController.getPerformanceAccessoryCategories);

module.exports = router;