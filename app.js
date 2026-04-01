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
