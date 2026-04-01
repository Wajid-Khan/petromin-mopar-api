const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

router.post("/createBooking", bookingController.createBooking);
router.get("/getBookings", bookingController.getBookings);
router.get("/getBooking/:id", bookingController.getBookingById);
router.put("/updateBookingStatus/:id", bookingController.updateBookingStatus);

module.exports = router;