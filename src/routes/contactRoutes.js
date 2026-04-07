const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");

router.post("/createContact", contactController.createContact);
router.get("/getAllContacts", contactController.getAllContacts);
router.get("/getContact/:id", contactController.getContactById);

module.exports = router;