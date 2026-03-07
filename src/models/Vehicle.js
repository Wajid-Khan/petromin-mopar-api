const pool = require("../../db");

class Vehicle {

    static async getBrands({ search = "", page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        let searchCondition = "";
        let values = [];

        if (search) {
            searchCondition = `WHERE brand_name_en ILIKE $1`;
            values.push(`%${search}%`);
        }

        const query = `
            SELECT 
                brand_id,
                brand_name_en,
                brand_name_ar,
                brand_logo
            FROM vehicle_brand
            ${searchCondition}
            ORDER BY brand_name_en
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(pageSize);
        values.push(offset);

        const result = await pool.query(query, values);

        const countQuery = `
            SELECT COUNT(*) 
            FROM vehicle_brand
            ${searchCondition}
        `;

        const countResult = await pool.query(countQuery, search ? [`%${search}%`] : []);

        return {
            data: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            pageSize
        };
    }

    static async getModels({ search = "", brandId = "", page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        let conditions = [];
        let values = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`model_name_en ILIKE $${values.length}`);
        }

        if (brandId) {
            values.push(brandId);
            conditions.push(`brand_id = $${values.length}`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT
                model_id,
                model_name_en,
                model_name_ar,
                brand_id,
                model_image
            FROM vehicle_model
            ${whereClause}
            ORDER BY model_name_en
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(pageSize);
        values.push(offset);

        const result = await pool.query(query, values);

        const countQuery = `
            SELECT COUNT(*)
            FROM vehicle_model
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

    static async getVariants({ search = "", brandId = "", modelId = "", page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        let conditions = [];
        let values = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`variant_name_en ILIKE $${values.length}`);
        }

        if (brandId) {
            values.push(brandId);
            conditions.push(`brand_id = $${values.length}`);
        }

        if (modelId) {
            values.push(modelId);
            conditions.push(`model_id = $${values.length}`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT
                variant_id,
                variant_name_en,
                variant_name_ar,
                model_id,
                brand_id
            FROM vehicle_variant
            ${whereClause}
            ORDER BY variant_name_en
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(pageSize);
        values.push(offset);

        const result = await pool.query(query, values);

        const countQuery = `
            SELECT COUNT(*)
            FROM vehicle_variant
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

    static async getYears({ search = "", brandId = "", modelId = "", variantId = "", page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        let conditions = [];
        let values = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`CAST(vehicle_year AS TEXT) ILIKE $${values.length}`);
        }

        if (brandId) {
            values.push(brandId);
            conditions.push(`brand_id = $${values.length}`);
        }

        if (modelId) {
            values.push(modelId);
            conditions.push(`model_id = $${values.length}`);
        }

        if (variantId) {
            values.push(variantId);
            conditions.push(`variant_id = $${values.length}`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT
                year_id,
                vehicle_year,
                variant_id,
                model_id,
                brand_id
            FROM vehicle_year
            ${whereClause}
            ORDER BY vehicle_year DESC
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(pageSize);
        values.push(offset);

        const result = await pool.query(query, values);

        const countQuery = `
            SELECT COUNT(*)
            FROM vehicle_year
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

}

module.exports = Vehicle;