const pool = require("../../db");

class Customer {

    // Create customer
    static async create(data) {

        const query = `
            INSERT INTO customers (
                id,
                first_name,
                last_name,
                email,
                mobile,
                gender,
                channel,
                created_at,
                is_active,
                is_deleted
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),true,false)
            RETURNING *
        `;

        const values = [
            data.id,
            data.first_name,
            data.last_name,
            data.email,
            data.mobile,
            data.gender,
            data.channel
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Create customer
    static async createCustomerWhileBooking(data) {

        const query = `
            INSERT INTO customers (
                id,
                first_name,
                last_name,
                email,
                mobile,
                gender,
                channel,
                created_at,
                is_active,
                is_deleted
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),false,false)
            RETURNING *
        `;

        const values = [
            data.id,
            data.first_name,
            data.last_name,
            data.email,
            data.mobile,
            data.gender,
            data.channel
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Get all customers
    // static async getAll({ page = 1, pageSize = 10 }) {

    //     const offset = (page - 1) * pageSize;

    //     const query = `
    //         SELECT *
    //         FROM customers
    //         WHERE is_deleted = false
    //         ORDER BY created_at DESC
    //         LIMIT $1 OFFSET $2
    //     `;

    //     const result = await pool.query(query, [pageSize, offset]);

    //     const countResult = await pool.query(`
    //         SELECT COUNT(*) FROM customers WHERE is_deleted = false
    //     `);

    //     return {
    //         data: result.rows,
    //         total: parseInt(countResult.rows[0].count),
    //         page,
    //         pageSize
    //     };
    // }
    static async getAll({ page = 1, pageSize = 10, search = "" }) {

        const offset = (page - 1) * pageSize;

        let conditions = [];
        let values = [];
        let index = 1;

        // Base condition
        conditions.push(`is_deleted = false`);

        // 🔍 Search condition
        if (search) {
            conditions.push(`(
                LOWER(first_name) LIKE LOWER($${index})
                OR LOWER(last_name) LIKE LOWER($${index})
                OR LOWER(email) LIKE LOWER($${index})
                OR mobile LIKE $${index}
            )`);
            values.push(`%${search}%`);
            index++;
        }

        const whereClause = `WHERE ${conditions.join(" AND ")}`;

        // 🔹 Main Query
        const query = `
            SELECT *
            FROM customers
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${index} OFFSET $${index + 1}
        `;

        values.push(pageSize, offset);

        const result = await pool.query(query, values);

        // 🔹 Count Query
        const countQuery = `
            SELECT COUNT(*)
            FROM customers
            ${whereClause}
        `;

        const countValues = values.slice(0, values.length - 2);
        const countResult = await pool.query(countQuery, countValues);

        return {
            data: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            pageSize
        };
    }

    // Get customer by ID
    static async getById(id) {

        const query = `
            SELECT *
            FROM customers
            WHERE id = $1
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Get customer with cars
    static async getWithCars(id) {

        const query = `
            SELECT 
                c.*,
                cc.id AS car_id,
                cc.lookup_vehicle_model_id,
                cc.vehicle_number_plate,
                cc.vin
            FROM customers c
            LEFT JOIN customer_car cc
                ON c.id = cc.customer_id
            WHERE c.id = $1
        `;

        const result = await pool.query(query, [id]);
        return result.rows;
    }

    // Update customer
    static async update(id, data) {

        const query = `
            UPDATE customers
            SET 
                first_name = $1,
                last_name = $2,
                email = $3,
                mobile = $4,
                gender = $5,
                updated_at = NOW()
            WHERE id = $6
            RETURNING *
        `;

        const values = [
            data.first_name,
            data.last_name,
            data.email,
            data.mobile,
            data.gender,
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Soft delete
    static async delete(id) {

        const query = `
            UPDATE customers
            SET is_deleted = true,
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async addCustomerCar(data) {

        const query = `
            INSERT INTO customer_car (
                id,
                customer_id,
                model_id,
                brand_id,
                variant_id,
                year_id,
                vehicle_number_plate,
                vin,
                created_at,
                created_by,
                is_active,
                is_deleted
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
            )
            RETURNING *
        `;

        const values = [
            data.id,
            data.customer_id,
            data.model_id,
            data.brand_id,
            data.variant_id,
            data.year_id,
            data.vehicle_number_plate,
            data.vin,
            data.created_at,
            data.created_by,
            true,
            false
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    }

}

module.exports = Customer;