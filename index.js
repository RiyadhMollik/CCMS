const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const maximumTempRoutes = require("./routes/maximumTempRoutes");
const minimumTempRoutes = require("./routes/minimumTempRoutes");

// Import models
require("./models/MaximumTemp");
require("./models/MinimumTemp");

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/maximum-temp", maximumTempRoutes);
app.use("/api/minimum-temp", minimumTempRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.get("/api/hello", (req, res) => {
  res.json({ greeting: "Hello from Express" });
});

// Initialize database and start server
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

initializeDatabase();
