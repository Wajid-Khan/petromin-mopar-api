require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const contactRoutes = require("./src/routes/contactRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const lookupRoutes = require("./src/routes/lookupRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/lookup", lookupRoutes);

app.get('/', (req, res) => {
  res.send('Petromin Mopar API is running 🚀');
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, '0.0.0.0', () => {
    console.log('Petromin Mopar API running on port 3006');
});
