const pool = require("../../db"); // adjust path if needed

class User {

    static async findByUsername(username) {
        const query = `
            SELECT *
            FROM employees
            WHERE username = $1 AND is_delete = FALSE AND is_active = TRUE
            LIMIT 1
        `;

        const { rows } = await pool.query(query, [username]);
        return rows[0];
    }

}

module.exports = User;