const pool = require("../../db");

class Contact {

    static async create(data) {

        const query = `
            INSERT INTO contact_form_enquiries
            (
                contact_id,
                name,
                email,
                phone,
                subject,
                message,
                created_at,
                is_email_notification_sent
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *
        `;

        const values = [
            data.contact_id,
            data.name,
            data.email,
            data.phone,
            data.subject,
            data.message,
            data.created_at,
            data.is_email_notification_sent
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    }

    static async getAll() {

        const result = await pool.query(
            `SELECT * FROM contact_form_enquiries ORDER BY created_at DESC`
        );

        return result.rows;
    }

}

module.exports = Contact;