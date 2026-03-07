const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicleController");

router.get("/brands", vehicleController.getBrands);
router.get("/models", vehicleController.getModels);
router.get("/variants", vehicleController.getVariants);
router.get("/years", vehicleController.getYears);

module.exports = router;