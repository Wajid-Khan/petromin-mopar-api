const pool = require("../../db");

class LookUp {

    static async getCities({ search = "", page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        let conditions = [];
        let values = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`(city_name_en ILIKE $${values.length} OR city_name_ar ILIKE $${values.length})`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT
                city_id,
                city_name_en,
                city_name_ar
            FROM lookup_cities
            ${whereClause}
            ORDER BY city_name_en
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(pageSize);
        values.push(offset);

        const result = await pool.query(query, values);

        const countQuery = `
            SELECT COUNT(*)
            FROM lookup_cities
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

    static async getTimeslots({ search = "", page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        let conditions = [];
        let values = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`timeslot_display ILIKE $${values.length}`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT
                timeslot_id,
                timeslot_display,
                timeslot
            FROM lookup_timeslots
            ${whereClause}
            ORDER BY timeslot
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(pageSize);
        values.push(offset);

        const result = await pool.query(query, values);

        const countQuery = `
            SELECT COUNT(*)
            FROM lookup_timeslots
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

    static async getBookingStatus({ search = "", page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        let conditions = [];
        let values = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`(status_name_en ILIKE $${values.length} OR status_name_ar ILIKE $${values.length})`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT
                status_id,
                status_name_en,
                status_name_ar
            FROM lookup_booking_status
            ${whereClause}
            ORDER BY status_name_en
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(pageSize);
        values.push(offset);

        const result = await pool.query(query, values);

        const countQuery = `
            SELECT COUNT(*)
            FROM lookup_booking_status
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

    static async getVehicleConcerns({ search = "", page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        let conditions = [];
        let values = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`(concern_name_en ILIKE $${values.length} OR concern_name_ar ILIKE $${values.length})`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT
                concern_id,
                concern_name_en,
                concern_name_ar
            FROM lookup_vehicle_concerns
            ${whereClause}
            ORDER BY concern_name_en
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(pageSize);
        values.push(offset);

        const result = await pool.query(query, values);

        const countQuery = `
            SELECT COUNT(*)
            FROM lookup_vehicle_concerns
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

    static async getVehicleServices({ search = "", page = 1, pageSize = 10 }) {

        const offset = (page - 1) * pageSize;

        let conditions = [];
        let values = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`(service_name_en ILIKE $${values.length} OR service_name_ar ILIKE $${values.length})`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT
                service_id,
                service_name_en,
                service_name_ar
            FROM lookup_vehicle_services
            ${whereClause}
            ORDER BY service_name_en
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(pageSize);
        values.push(offset);

        const result = await pool.query(query, values);

        const countQuery = `
            SELECT COUNT(*)
            FROM lookup_vehicle_services
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

module.exports = LookUp;