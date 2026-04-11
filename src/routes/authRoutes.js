const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController.js");

router.post("/check-user", authController.checkUser);
router.post("/send-otp", authController.checkUserAndSendOTP);
router.post("/request-otp", authController.requestOTP);
router.post("/resend-otp", authController.resendOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/register", authController.register);

module.exports = router;