const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const Contact = require("../models/Contact");
const { sendMail } = require("../../utils/mailer");

const createContact = async (req, res) => {

    try {

        const { name, email, phone, subject, message } = req.body;

        const contactData = {
            contact_id: uuidv4(),
            name,
            email,
            phone,
            subject,
            message,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            is_email_notification_sent: false
        };

        const savedContact = await Contact.create(contactData);

        res.status(201).json({
            success: true,
            message: "Contact inquiry submitted successfully",
            data: savedContact
        });

    } catch (error) {

        console.error("Contact Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


const getAllContacts = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await Contact.getAll({ page, pageSize });

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error("Get Contacts error:", error);

        res.status(500).json({
            success: false
        });

    }

};

const getContactById = async (req, res) => {

    try {

        const { id } = req.params;

        const contact = await Contact.getById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.json({
            success: true,
            data: contact
        });

    } catch (error) {

        console.error("Get contact error:", error);

        res.status(500).json({
            success: false
        });

    }

};

const updateContactResponse = async (req, res) => {

    try {

        const {
            contact_id,
            responded_by,
            respondent_comment
        } = req.body;

        if (!contact_id || !responded_by) {
            return res.status(400).json({
                success: false,
                message: "contact_id and responded_by are required"
            });
        }

        const updated = await Contact.updateResponse({
            contact_id,
            responded_by,
            respondent_comment: respondent_comment || null,
            responded_at: moment().format("YYYY-MM-DD HH:mm:ss")
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.json({
            success: true,
            message: "Response updated successfully",
            data: updated
        });

    } catch (error) {

        console.error("Update contact response error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContactResponse
};