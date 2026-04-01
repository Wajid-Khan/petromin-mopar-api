const pool = require("../../db");

class Booking {

    // Create booking
    static async create(data) {

        const query = `
            INSERT INTO booking (
                id,
                customer_id,
                customer_car_id,
                mileage,
                services,
                concerns,
                comments,
                city_id,
                service_center_id,
                service_date,
                service_time,
                booking_status_id,
                created_at,
                is_active,
                is_deleted
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),true,false
            )
            RETURNING *
        `;

        const values = [
            data.id,
            data.customer_id,
            data.customer_car_id,
            data.mileage,
            data.services,
            data.concerns,
            data.comments,
            data.city_id,
            data.service_center_id,
            data.service_date,
            data.service_time,
            data.booking_status_id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Get all bookings (pagination + search)
    static async getAll({ page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        const query = `
            SELECT *
            FROM booking
            WHERE is_deleted = false
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;

        const result = await pool.query(query, [pageSize, offset]);

        const countResult = await pool.query(`
            SELECT COUNT(*) FROM booking WHERE is_deleted = false
        `);

        return {
            data: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            pageSize
        };
    }

    // Get booking by ID
    static async getById(id) {

        const query = `
            SELECT *
            FROM booking
            WHERE id = $1
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Update booking status
    static async updateStatus(id, status_id) {

        const query = `
            UPDATE booking
            SET booking_status_id = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;

        const result = await pool.query(query, [status_id, id]);
        return result.rows[0];
    }

}

module.exports = Booking;