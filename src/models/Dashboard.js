const pool = require("../../db");

class Dashboard {

    static async getCounts() {

        const query = `
            SELECT
                (SELECT COUNT(*) FROM vehicle_brand) AS total_brands,
                (SELECT COUNT(*) FROM vehicle_model) AS total_models,
                (SELECT COUNT(*) FROM vehicle_variant) AS total_variants,
                (SELECT COUNT(*) FROM centers where is_active = true) AS total_centers,
                (SELECT COUNT(*) FROM customers WHERE is_deleted = false and is_active = true) AS total_customers,
                (SELECT COUNT(*) FROM employees WHERE is_deleted = false and is_active = true) AS total_employees
        `;

        const result = await pool.query(query);

        return result.rows[0];
    }

}

module.exports = Dashboard;