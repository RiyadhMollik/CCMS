const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const maximumTempRoutes = require("./routes/maximumTempRoutes");
const minimumTempRoutes = require("./routes/minimumTempRoutes");
const rainfallRoutes = require("./routes/rainfallRoutes");
const relativeHumidityRoutes = require("./routes/relativeHumidityRoutes");
const sunshineRoutes = require("./routes/sunshineRoutes");
const windSpeedRoutes = require("./routes/windSpeedRoutes");
const soilMoistureRoutes = require("./routes/soilMoistureRoutes");
const soilTemperatureRoutes = require("./routes/soilTemperatureRoutes");
const averageTemperatureRoutes = require("./routes/averageTemperatureRoutes");
const solarRadiationRoutes = require("./routes/solarRadiationRoutes");
const evapoTranspirationRoutes = require("./routes/evapoTranspirationRoutes");

// Import models
require("./models/MaximumTemp");
require("./models/MinimumTemp");
require("./models/Rainfall");
require("./models/RelativeHumidity");
require("./models/Sunshine");
require("./models/WindSpeed");
require("./models/SoilMoisture");
require("./models/SoilTemperature");
require("./models/AverageTemperature");
require("./models/SolarRadiation");
require("./models/EvapoTranspiration");

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5500;

// Routes
app.use("/api/maximum-temp", maximumTempRoutes);
app.use("/api/minimum-temp", minimumTempRoutes);
app.use("/api/rainfall", rainfallRoutes);
app.use("/api/relative-humidity", relativeHumidityRoutes);
app.use("/api/sunshine", sunshineRoutes);
app.use("/api/wind-speed", windSpeedRoutes);
app.use("/api/soil-moisture", soilMoistureRoutes);
app.use("/api/soil-temperature", soilTemperatureRoutes);
app.use("/api/average-temperature", averageTemperatureRoutes);
app.use("/api/solar-radiation", solarRadiationRoutes);
app.use("/api/evapo-transpiration", evapoTranspirationRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.get("/api/hello", (req, res) => {
  res.json({ greeting: "Hello from Express" });
});

// Initialize database and start server
async function initializeDatabase() {
  try {
    // First, try to authenticate with the database
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    // If database doesn't exist, create it
    if (error.parent && error.parent.code === 'ER_BAD_DB_ERROR') {
      console.log(`Database '${process.env.DB_NAME || 'ccms'}' does not exist. Creating...`);
      
      try {
        const mysql = require('mysql2/promise');
        
        // Connect to MySQL without specifying database
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || ''
        });

        // Create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'ccms_db'}\``);
        console.log(`Database '${process.env.DB_NAME || 'ccms_db'}' created successfully`);
        
        await connection.end();

        // Now authenticate again with the newly created database
        await sequelize.authenticate();
        console.log("Database connection established successfully");

        // Sync database (creates tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log("Database synchronized successfully");

        app.listen(PORT, () => {
          console.log(`Server listening on http://localhost:${PORT}`);
        });
      } catch (createError) {
        console.error("Unable to create database:", createError);
        process.exit(1);
      }
    } else {
      console.error("Unable to connect to the database:", error);
      process.exit(1);
    }
  }
}

initializeDatabase();
