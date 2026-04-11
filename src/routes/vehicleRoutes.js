const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicleController");

router.get("/brands", vehicleController.getBrands);
router.get("/models", vehicleController.getModels);
router.get("/variants", vehicleController.getVariants);
router.get("/years", vehicleController.getYears);
router.get("/model/:id", vehicleController.getModelById);
router.get("/variant/:id", vehicleController.getVariantById);
router.get("/concerns", vehicleController.getConcerns);
router.get("/services", vehicleController.getServices);

module.exports = router;