require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const contactRoutes = require("./src/routes/contactRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const lookupRoutes = require("./src/routes/lookupRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes.js");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const productRoutes = require("./src/routes/productRoutes");
const employeesRoutes = require("./src/routes/employeesRoutes");
const fs = require("fs");
const pool = require("./db");

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));



app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/lookup", lookupRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/employees", employeesRoutes);

app.get('/', (req, res) => {
  res.send('Petromin Mopar API is running 🚀');
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, '0.0.0.0', () => {
  console.log('Petromin Mopar API running on port 3006');
});

// async function importAccessoriesFromJson() {

//     const filePath = path.join(__dirname, "data", "accessories.json");

//     const client = await pool.connect();

//     try {
//         // Read JSON file
//         const fileData = fs.readFileSync(filePath, "utf8");
//         const accessories = JSON.parse(fileData);

//         const items = Array.isArray(accessories)
//             ? accessories
//             : accessories.accessories;

//         if (!Array.isArray(items)) {
//             throw new Error("JSON file must contain an array of accessories.");
//         }

//         console.log(`Found ${items.length} accessories to import.`);

//         // Start transaction
//         await client.query("BEGIN");

//         // Remove all existing accessories
//         await client.query(`
//             TRUNCATE TABLE public.accessories RESTART IDENTITY;
//         `);

//         console.log("🗑️ Existing accessories records truncated.");

//         for (const item of items) {

//             /*
//              * Split model names.
//              *
//              * Example:
//              * "Wrangler / Gladiator"
//              * becomes:
//              * ["Wrangler", "Gladiator"]
//              */
//             const models = item.model
//                 ? item.model
//                     .split("/")
//                     .map(model => model.trim())
//                     .filter(Boolean)
//                 : [];

//             if (models.length === 0) {
//                 console.log(
//                     `⚠️ Skipped: ${item.part_number} - Model is missing`
//                 );
//                 continue;
//             }

//             /*
//              * Import separately for each model.
//              */
//             for (const model of models) {

//                 /*
//                  * Filter vehicle_fitment based on the current model.
//                  */
//                 const filteredVehicleFitment = (
//                     item.vehicle_fitment || []
//                 ).filter(fitment =>
//                     fitment.model &&
//                     fitment.model.trim().toLowerCase() ===
//                     model.trim().toLowerCase()
//                 );

//                 const query = `
//                     INSERT INTO public.accessories
//                     (
//                         part_number,
//                         petromin_mopar_part_number,
//                         brand_id,
//                         model_id,
//                         pa_category_id,
//                         segment_id,
//                         product_name_en,
//                         product_name_ar,
//                         description_en,
//                         description_ar,
//                         price_with_vat,
//                         brand_logo,
//                         part_grid_img,
//                         part_details_imgs,
//                         vehicle_fitment
//                     )
//                     SELECT
//                         $1,
//                         $2,

//                         -- Brand
//                         vb.brand_id,

//                         -- Model
//                         vm.model_id,

//                         -- Category
//                         pac.pa_category_id,

//                         -- Segment
//                         s.segment_id,

//                         $3,
//                         $4,
//                         $5,
//                         $6,
//                         $7,
//                         $8,
//                         $9,
//                         $10::jsonb,
//                         $11::jsonb

//                     FROM vehicle_brand vb

//                     LEFT JOIN vehicle_model vm
//                         ON vm.brand_id = vb.brand_id
//                         AND LOWER(TRIM(vm.model_name_en)) =
//                             LOWER(TRIM($12))

//                     LEFT JOIN lookup_performance_accessory_categories pac
//                         ON LOWER(TRIM(pac.pa_category_name_en)) =
//                             LOWER(TRIM($13))

//                     LEFT JOIN lookup_segments s
//                         ON LOWER(TRIM(s.segment_name_en)) =
//                             LOWER(TRIM($14))
//                         AND LOWER(TRIM(s.segment_type)) = 'accessories'

//                     WHERE LOWER(TRIM(vb.brand_name_en)) =
//                           LOWER(TRIM($15))

//                     RETURNING
//                         accessory_id,
//                         part_number,
//                         brand_id,
//                         model_id,
//                         pa_category_id,
//                         segment_id;
//                 `;

//                 const values = [
//                     item.part_number,
//                     item.petromin_mopar_part_number || null,

//                     item.product_name,
//                     null, // product_name_ar

//                     item.description,
//                     null, // description_ar

//                     item.price_with_vat || null,

//                     item.brand_logo || null,

//                     item.images?.part_grid_img || null,

//                     JSON.stringify(
//                         item.images?.part_details_imgs || []
//                     ),

//                     JSON.stringify(
//                         filteredVehicleFitment
//                     ),

//                     // Current model
//                     model,

//                     // Category
//                     item.product_category,

//                     // Segment
//                     item.segment,

//                     // Brand
//                     item.brand
//                 ];

//                 const result = await client.query(query, values);

//                 if (result.rows.length === 0) {

//                     console.log(
//                         `⚠️ Skipped: ${item.part_number} | ` +
//                         `Model: ${model} | ` +
//                         `Brand/model/category/segment not found`
//                     );

//                 } else {

//                     const inserted = result.rows[0];

//                     console.log(
//                         `✅ Imported: ${inserted.part_number} | ` +
//                         `Model: ${model} | ` +
//                         `brand_id: ${inserted.brand_id} | ` +
//                         `model_id: ${inserted.model_id} | ` +
//                         `category_id: ${inserted.pa_category_id} | ` +
//                         `segment_id: ${inserted.segment_id} | ` +
//                         `fitment: ${filteredVehicleFitment.length}`
//                     );
//                 }
//             }
//         }

//         // Commit only after all records are successfully processed
//         await client.query("COMMIT");

//         console.log("✅ Accessory import completed successfully.");

//     } catch (error) {

//         // Rollback everything if any error occurs
//         await client.query("ROLLBACK");

//         console.error("❌ Accessory import failed. Changes rolled back.");
//         console.error(error);

//     } finally {
//         client.release();
//     }
// }

// importAccessoriesFromJson();

// async function importPartsFromJson() {
//     const filePath = path.join(__dirname, "data", "parts.json");

//     const client = await pool.connect();

//     try {
//         // Read JSON file
//         const fileData = fs.readFileSync(filePath, "utf8");
//         const parts = JSON.parse(fileData);

//         const items = Array.isArray(parts)
//             ? parts
//             : parts.parts;

//         if (!Array.isArray(items)) {
//             throw new Error("JSON file must contain an array of parts.");
//         }

//         console.log(`Found ${items.length} parts to import.`);

//         // Start transaction
//         await client.query("BEGIN");

//         // Remove existing parts
//         await client.query(`
//             TRUNCATE TABLE public.parts;
//         `);

//         console.log("🗑️ Existing parts records truncated.");

//         for (const item of items) {

//             const query = `
//                 INSERT INTO public.parts
//                 (
//                     part_number,
//                     description_en,
//                     description_ar,
//                     segment_id,
//                     business_line_id,
//                     sales_code,
//                     retail_price_without_vat,
//                     price_with_vat,
//                     brand_logo,
//                     part_grid_img,
//                     part_details_imgs,
//                     vehicle_fitment
//                 )
//                 SELECT
//                     $1,
//                     $2,
//                     $3,

//                     -- Segment
//                     s.segment_id,

//                     -- Business line
//                     bl.business_line_id,

//                     $4,
//                     $5,
//                     $6,
//                     $7,
//                     $8,
//                     $9::jsonb,
//                     $10::jsonb

//                 FROM lookup_segments s

//                 LEFT JOIN lookup_business_lines bl
//                     ON LOWER(TRIM(bl.business_line_name_en)) =
//                        LOWER(TRIM($11))

//                 WHERE LOWER(TRIM(s.segment_name_en)) =
//                       LOWER(TRIM($12))

//                 RETURNING
//                     part_id,
//                     part_number,
//                     segment_id,
//                     business_line_id;
//             `;

//             const values = [
//                 // Part
//                 item.part_number,

//                 // Description
//                 item.description || null,
//                 null, // description_ar

//                 // Sales code
//                 item.sales_code || null,

//                 // Prices
//                 item.retail_price_without_vat || null,
//                 item.price_with_vat || null,

//                 // Brand logo
//                 item.brand_logo || null,

//                 // Grid image
//                 item.images?.part_grid_img || null,

//                 // Detail images
//                 JSON.stringify(
//                     item.images?.part_details_imgs || []
//                 ),

//                 // Vehicle fitment
//                 JSON.stringify(
//                     item.vehicle_fitment || []
//                 ),

//                 // Lookup: business line
//                 item.business_line,

//                 // Lookup: segment
//                 item.segment
//             ];

//             const result = await client.query(query, values);

//             if (result.rows.length === 0) {

//                 console.log(
//                     `⚠️ Skipped: ${item.part_number} | ` +
//                     `Segment: ${item.segment} | ` +
//                     `Business Line: ${item.business_line}`
//                 );

//             } else {

//                 const inserted = result.rows[0];

//                 console.log(
//                     `✅ Imported: ${inserted.part_number} | ` +
//                     `segment_id: ${inserted.segment_id} | ` +
//                     `business_line_id: ${inserted.business_line_id}`
//                 );
//             }
//         }

//         // Commit
//         await client.query("COMMIT");

//         console.log("✅ Parts import completed successfully.");

//     } catch (error) {

//         // Rollback
//         await client.query("ROLLBACK");

//         console.error(
//             "❌ Parts import failed. Changes rolled back."
//         );

//         console.error(error);

//     } finally {
//         client.release();
//     }
// }
