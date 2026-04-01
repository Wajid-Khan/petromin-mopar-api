const pool = require("../../db");

class Product {

    // ============================
    // 🔹 PARTS
    // ============================

    static async getParts({ page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        const result = await pool.query(`
            SELECT * FROM parts
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `, [pageSize, offset]);

        const count = await pool.query(`SELECT COUNT(*) FROM parts`);

        return {
            data: result.rows,
            total: parseInt(count.rows[0].count),
            page,
            pageSize
        };
    }

    static async getPartById(id) {

        const result = await pool.query(
            `SELECT * FROM parts WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    }

    static async createPart(data) {

        const query = `
            INSERT INTO parts (
                id, name, brand_logo, sku, category,
                sales_code, price_incl_vat, price_excl_vat, created_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
            RETURNING *
        `;

        const values = [
            data.id,
            data.name,
            data.brand_logo,
            data.sku,
            data.category,
            data.sales_code,
            data.price_incl_vat,
            data.price_excl_vat
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updatePart(id, data) {

        const query = `
            UPDATE parts SET
                name = $1,
                brand_logo = $2,
                sku = $3,
                category = $4,
                sales_code = $5,
                price_incl_vat = $6,
                price_excl_vat = $7
            WHERE id = $8
            RETURNING *
        `;

        const values = [
            data.name,
            data.brand_logo,
            data.sku,
            data.category,
            data.sales_code,
            data.price_incl_vat,
            data.price_excl_vat,
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async deletePart(id) {

        const result = await pool.query(
            `DELETE FROM parts WHERE id = $1 RETURNING *`,
            [id]
        );

        return result.rows[0];
    }

    // ============================
    // 🔹 ACCESSORIES
    // ============================

    static async getAccessories({ page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        const result = await pool.query(`
            SELECT * FROM accessories
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `, [pageSize, offset]);

        const count = await pool.query(`SELECT COUNT(*) FROM accessories`);

        return {
            data: result.rows,
            total: parseInt(count.rows[0].count),
            page,
            pageSize
        };
    }

    static async getAccessoryById(id) {

        const result = await pool.query(
            `SELECT * FROM accessories WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    }

    static async createAccessory(data) {

        const query = `
            INSERT INTO accessories (
                id, name, brand_logo, sku, category,
                description, price_incl_vat, created_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
            RETURNING *
        `;

        const values = [
            data.id,
            data.name,
            data.brand_logo,
            data.sku,
            data.category,
            data.description,
            data.price_incl_vat
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updateAccessory(id, data) {

        const query = `
            UPDATE accessories SET
                name = $1,
                brand_logo = $2,
                sku = $3,
                category = $4,
                description = $5,
                price_incl_vat = $6
            WHERE id = $7
            RETURNING *
        `;

        const values = [
            data.name,
            data.brand_logo,
            data.sku,
            data.category,
            data.description,
            data.price_incl_vat,
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async deleteAccessory(id) {

        const result = await pool.query(
            `DELETE FROM accessories WHERE id = $1 RETURNING *`,
            [id]
        );

        return result.rows[0];
    }

}

module.exports = Product;