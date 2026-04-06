const pool = require("../../db");

class Employees {

    // 🔹 Get all employees (with role)
    static async getAll({ page = 1, pageSize = 10, search = "", role_id = null }) {

        const offset = (page - 1) * pageSize;

        let conditions = [];
        let values = [];
        let index = 1;

        // Base conditions
        conditions.push(`e.is_deleted = false`);
        conditions.push(`e.role_id::integer != 1`);

        // 🔍 Search (name OR email)
        if (search) {
            conditions.push(`(
                LOWER(e.name) LIKE LOWER($${index})
                OR LOWER(e.email) LIKE LOWER($${index})
            )`);
            values.push(`%${search}%`);
            index++;
        }

        // 🎯 Filter by role_id
        if (role_id) {
            conditions.push(`e.role_id::integer = $${index}`);
            values.push(role_id);
            index++;
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        // 🔹 Main Query
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
            ${whereClause}
            ORDER BY e.created_at DESC
            LIMIT $${index} OFFSET $${index + 1}
        `;

        values.push(pageSize, offset);

        const result = await pool.query(query, values);

        // 🔹 Count Query
        const countQuery = `
            SELECT COUNT(*) 
            FROM employees e
            ${whereClause}
        `;

        const countValues = values.slice(0, values.length - 2);
        const count = await pool.query(countQuery, countValues);

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
            created_by,   -- ✅ ADD THIS
            created_at,
            is_active,
            is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),true,false)
        RETURNING *
    `;

        const values = [
            data.emp_id,
            data.name,
            data.email,
            data.password,
            Number(data.role_id),      // ✅ convert
            data.username,
            data.created_by || null    // ✅ SAFE FIX
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

    static async updatePasswordByEmail(email, password) {

        const query = `
            UPDATE employees
            SET password = $1,
                updated_at = NOW()
            WHERE email = $2
            RETURNING emp_id, email
        `;

        const result = await pool.query(query, [password, email]);

        return result.rows[0];
    }

}

module.exports = Employees;