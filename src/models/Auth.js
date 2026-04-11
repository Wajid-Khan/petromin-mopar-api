const pool = require("../../db");

class Auth {

    // Check customer by mobile or email
    static async findCustomer(input) {
        const query = `
            SELECT * FROM customers
            WHERE email = $1 OR mobile = $1
        `;
        const result = await pool.query(query, [input]);
        return result.rows[0];
    }

    // Check customer by mobile
    static async findCustomerByMobile(input) {
        const query = `
            SELECT * FROM customers
            WHERE mobile = $1
        `;
        const result = await pool.query(query, [input]);
        return result.rows[0];
    }

    // Create OTP
    static async createOTP(data) {
        const query = `
            INSERT INTO customer_otp_request
            (cor_id, otp_type, otp_request, otp_generated_at, otp_sent_at, otp_code)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *
        `;
        const result = await pool.query(query, [
            data.cor_id,
            data.otp_type,
            data.otp_request,
            data.otp_generated_at,
            data.otp_sent_at,
            data.otp_code
        ]);
        return result.rows[0];
    }

    // Get latest OTP
    static async getLatestOTP(otp_request) {
        const query = `
            SELECT * FROM customer_otp_request
            WHERE otp_request = $1
            ORDER BY otp_generated_at DESC
            LIMIT 1
        `;
        const result = await pool.query(query, [otp_request]);
        return result.rows[0];
    }

    // Verify OTP
    static async verifyOTP(cor_id) {
        const query = `
            UPDATE customer_otp_request
            SET otp_verified_at = NOW()
            WHERE cor_id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [cor_id]);
        return result.rows[0];
    }

    // Create customer
    static async createCustomer(data) {
        const query = `
            INSERT INTO customers
            (id, first_name, last_name, email, mobile, created_at, is_active)
            VALUES ($1,$2,$3,$4,$5,NOW(),true)
            RETURNING *
        `;
        const result = await pool.query(query, [
            data.id,
            data.first_name,
            data.last_name,
            data.email,
            data.mobile
        ]);
        return result.rows[0];
    }

}

module.exports = Auth;