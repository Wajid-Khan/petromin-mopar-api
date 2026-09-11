const pool = require("../../db");

class Product {

    // ============================
    // 🔹 PARTS
    // ============================

    static async getParts({
        page = 1,
        pageSize = 10,
        search = ""
    }) {

        const offset = (page - 1) * pageSize;
        const searchValue = `%${search}%`;

        const query = `
            SELECT
                p.part_id,
                p.part_number,

                p.description_en,
                p.description_ar,

                -- Segment
                p.segment_id,
                s.segment_name_en,
                s.segment_name_ar,

                -- Business Line
                p.business_line_id,
                bl.business_line_name_en,
                bl.business_line_name_ar,

                p.sales_code,

                p.retail_price_without_vat,
                p.price_with_vat,

                p.brand_logo,

                p.part_grid_img,
                p.part_details_imgs,

                p.vehicle_fitment,

                p.created_at,
                p.updated_at

            FROM public.parts p

            LEFT JOIN public.lookup_segments s
                ON p.segment_id = s.segment_id

            LEFT JOIN public.lookup_business_lines bl
                ON p.business_line_id = bl.business_line_id

            WHERE
                $1 = ''
                OR p.part_number ILIKE $2
                OR p.description_en ILIKE $2
                OR p.description_ar ILIKE $2
                OR p.sales_code ILIKE $2

                OR s.segment_name_en ILIKE $2
                OR s.segment_name_ar ILIKE $2

                OR bl.business_line_name_en ILIKE $2
                OR bl.business_line_name_ar ILIKE $2

            ORDER BY p.created_at DESC

            LIMIT $3
            OFFSET $4
        `;

        const result = await pool.query(
            query,
            [
                search,
                searchValue,
                pageSize,
                offset
            ]
        );


        // Count filtered records
        const countQuery = `
            SELECT COUNT(*) AS total

            FROM public.parts p

            LEFT JOIN public.lookup_segments s
                ON p.segment_id = s.segment_id

            LEFT JOIN public.lookup_business_lines bl
                ON p.business_line_id = bl.business_line_id

            WHERE
                $1 = ''
                OR p.part_number ILIKE $2
                OR p.description_en ILIKE $2
                OR p.description_ar ILIKE $2
                OR p.sales_code ILIKE $2

                OR s.segment_name_en ILIKE $2
                OR s.segment_name_ar ILIKE $2

                OR bl.business_line_name_en ILIKE $2
                OR bl.business_line_name_ar ILIKE $2
        `;

        const countResult = await pool.query(
            countQuery,
            [
                search,
                searchValue
            ]
        );

        return {
            data: result.rows,
            total: parseInt(countResult.rows[0].total, 10),
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

    static async getAccessories({
        page = 1,
        pageSize = 10,
        search = ""
    }) {

        const offset = (page - 1) * pageSize;

        const searchValue = `%${search}%`;

        const query = `
            SELECT
                a.accessory_id,
                a.part_number,
                a.petromin_mopar_part_number,

                -- Brand
                a.brand_id,
                vb.brand_name_en,
                vb.brand_name_ar,

                -- Model
                a.model_id,
                vm.model_name_en,
                vm.model_name_ar,

                -- Category
                a.pa_category_id,
                pac.pa_category_name_en,
                pac.pa_category_name_ar,

                -- Segment
                a.segment_id,
                s.segment_name_en,
                s.segment_name_ar,

                -- Product
                a.product_name_en,
                a.product_name_ar,
                a.description_en,
                a.description_ar,

                a.price_with_vat,
                a.brand_logo,
                a.part_grid_img,
                a.part_details_imgs,
                a.vehicle_fitment,

                a.created_at,
                a.updated_at

            FROM public.accessories a

            LEFT JOIN public.vehicle_brand vb
                ON a.brand_id = vb.brand_id

            LEFT JOIN public.vehicle_model vm
                ON a.model_id = vm.model_id

            LEFT JOIN public.lookup_performance_accessory_categories pac
                ON a.pa_category_id = pac.pa_category_id

            LEFT JOIN public.lookup_segments s
                ON a.segment_id = s.segment_id

            WHERE
                $1 = ''
                OR
                a.part_number ILIKE $2
                OR a.petromin_mopar_part_number ILIKE $2
                OR a.product_name_en ILIKE $2
                OR a.product_name_ar ILIKE $2
                OR a.description_en ILIKE $2
                OR a.description_ar ILIKE $2

                OR vb.brand_name_en ILIKE $2
                OR vb.brand_name_ar ILIKE $2

                OR vm.model_name_en ILIKE $2
                OR vm.model_name_ar ILIKE $2

                OR pac.pa_category_name_en ILIKE $2
                OR pac.pa_category_name_ar ILIKE $2

                OR s.segment_name_en ILIKE $2
                OR s.segment_name_ar ILIKE $2

            ORDER BY a.created_at DESC

            LIMIT $3 OFFSET $4
        `;

        const result = await pool.query(
            query,
            [
                search,
                searchValue,
                pageSize,
                offset
            ]
        );


        // Count filtered records
        const countQuery = `
            SELECT COUNT(*) AS total

            FROM public.accessories a

            LEFT JOIN public.vehicle_brand vb
                ON a.brand_id = vb.brand_id

            LEFT JOIN public.vehicle_model vm
                ON a.model_id = vm.model_id

            LEFT JOIN public.lookup_performance_accessory_categories pac
                ON a.pa_category_id = pac.pa_category_id

            LEFT JOIN public.lookup_segments s
                ON a.segment_id = s.segment_id

            WHERE
                $1 = ''
                OR
                a.part_number ILIKE $2
                OR a.petromin_mopar_part_number ILIKE $2
                OR a.product_name_en ILIKE $2
                OR a.product_name_ar ILIKE $2
                OR a.description_en ILIKE $2
                OR a.description_ar ILIKE $2

                OR vb.brand_name_en ILIKE $2
                OR vb.brand_name_ar ILIKE $2

                OR vm.model_name_en ILIKE $2
                OR vm.model_name_ar ILIKE $2

                OR pac.pa_category_name_en ILIKE $2
                OR pac.pa_category_name_ar ILIKE $2

                OR s.segment_name_en ILIKE $2
                OR s.segment_name_ar ILIKE $2
        `;

        const countResult = await pool.query(
            countQuery,
            [
                search,
                searchValue
            ]
        );

        return {
            data: result.rows,
            total: parseInt(countResult.rows[0].total, 10),
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