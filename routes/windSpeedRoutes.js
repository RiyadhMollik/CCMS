const express = require("express");
const router = express.Router();
const {
  uploadWindSpeedData,
  getAllWindSpeedData,
  getStations,
  getYears,
  getWindSpeedDataById,
  createWindSpeedData,
  updateWindSpeedData,
  deleteWindSpeedData,
} = require("../controllers/windSpeedController");

// Upload wind speed data from CSV/XLSX
router.post("/upload", uploadWindSpeedData);

// Get all wind speed data with pagination
router.get("/", getAllWindSpeedData);

// Get unique stations
router.get("/stations", getStations);

// Get unique years
router.get("/years", getYears);

// Get wind speed data by ID
router.get("/:id", getWindSpeedDataById);

// Create a single wind speed record
router.post("/", createWindSpeedData);

// Update wind speed data
router.put("/:id", updateWindSpeedData);

// Delete wind speed data
router.delete("/:id", deleteWindSpeedData);

module.exports = router;
