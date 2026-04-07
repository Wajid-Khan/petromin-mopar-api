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
    static async getAll({ page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        const query = `
            SELECT *
            FROM contact_form_enquiries
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;

        const result = await pool.query(query, [pageSize, offset]);

        const countResult = await pool.query(`
            SELECT COUNT(*) FROM contact_form_enquiries
        `);

        return {
            data: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            pageSize
        };
    }

    static async getById(id) {

        const query = `
            SELECT *
            FROM contact_form_enquiries
            WHERE id = $1
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = Contact;