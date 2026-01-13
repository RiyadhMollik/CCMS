const express = require("express");
const router = express.Router();
const {
  uploadRelativeHumidityData,
  getAllRelativeHumidityData,
  getStations,
  getYears,
  getRelativeHumidityDataById,
  createRelativeHumidityData,
  updateRelativeHumidityData,
  deleteRelativeHumidityData,
} = require("../controllers/relativeHumidityController");

// Upload relative humidity data from CSV/XLSX
router.post("/upload", uploadRelativeHumidityData);

// Get all relative humidity data with pagination
router.get("/", getAllRelativeHumidityData);

// Get unique stations
router.get("/stations", getStations);

// Get unique years
router.get("/years", getYears);

// Get relative humidity data by ID
router.get("/:id", getRelativeHumidityDataById);

// Create a single relative humidity record
router.post("/", createRelativeHumidityData);

// Update relative humidity data
router.put("/:id", updateRelativeHumidityData);

// Delete relative humidity data
router.delete("/:id", deleteRelativeHumidityData);

module.exports = router;
