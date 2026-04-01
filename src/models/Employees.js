const pool = require("../../db");

class Employees {

    // 🔹 Get all employees (with role)
    static async getAll({ page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        const query = `
            SELECT 
                e.emp_id,
                e.name,
                e.email,
                e.username,
                e.is_active,
                e.created_at,
                r.role_id,
                r.role_name
            FROM employees e
            LEFT JOIN roles r ON e.role_id::integer = r.role_id
            WHERE 
                e.is_deleted = false
                AND e.role_id != 1
            ORDER BY e.created_at DESC
            LIMIT $1 OFFSET $2
        `;

        const result = await pool.query(query, [pageSize, offset]);

        const countQuery = `
            SELECT COUNT(*) 
            FROM employees
            WHERE 
                is_deleted = false
                AND role_id != 1
        `;

        const count = await pool.query(countQuery);

        return {
            data: result.rows,
            total: parseInt(count.rows[0].count),
            page,
            pageSize
        };
    }

    // 🔹 Get by ID
    static async getById(id) {

        const query = `
            SELECT 
                e.*,
                r.role_name
            FROM employees e
            LEFT JOIN roles r ON e.role_id = r.role_id
            WHERE e.emp_id = $1
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // 🔹 Create
    static async create(data) {

        const query = `
            INSERT INTO employees (
                emp_id,
                name,
                email,
                password,
                role_id,
                username,
                created_at,
                is_active,
                is_deleted
            )
            VALUES ($1,$2,$3,$4,$5,$6,NOW(),true,false)
            RETURNING *
        `;

        const values = [
            data.emp_id,
            data.name,
            data.email,
            data.password,
            data.role_id,
            data.username
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // 🔹 Update
    static async update(id, data) {

        const query = `
            UPDATE employees
            SET
                name = $1,
                email = $2,
                role_id = $3,
                username = $4,
                is_active = $5,
                updated_at = NOW()
            WHERE emp_id = $6
            RETURNING *
        `;

        const values = [
            data.name,
            data.email,
            data.role_id,
            data.username,
            data.is_active,
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // 🔹 Delete (Soft delete)
    static async delete(id) {

        const query = `
            UPDATE employees
            SET is_deleted = true,
                updated_at = NOW()
            WHERE emp_id = $1
            RETURNING *
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

}

module.exports = Employees;