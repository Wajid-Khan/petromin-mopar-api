const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// PARTS
router.get("/parts", productController.getParts);
router.post("/parts", productController.createPart);
router.get("/parts/:id", productController.getPartById);
router.put("/parts/:id", productController.updatePart);
router.delete("/parts/:id", productController.deletePart);

// ACCESSORIES
router.get("/accessories", productController.getAccessories);
router.post("/accessories", productController.createAccessory);
router.get("/accessories/:id", productController.getAccessoryById);
router.put("/accessories/:id", productController.updateAccessory);
router.delete("/accessories/:id", productController.deleteAccessory);

module.exports = router;