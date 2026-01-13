const express = require("express");
const router = express.Router();
const {
  uploadMinimumTempData,
  getAllMinimumTempData,
  getStations,
  getYears,
  getMinimumTempDataById,
  createMinimumTempData,
  updateMinimumTempData,
  deleteMinimumTempData,
} = require("../controllers/minimumTempController");

// Upload minimum temperature data from CSV/XLSX
router.post("/upload", uploadMinimumTempData);

// Get all minimum temperature data with pagination
router.get("/", getAllMinimumTempData);

// Get unique stations
router.get("/stations", getStations);

// Get unique years
router.get("/years", getYears);

// Get minimum temperature data by ID
router.get("/:id", getMinimumTempDataById);

// Create a single minimum temperature record
router.post("/", createMinimumTempData);

// Update minimum temperature data
router.put("/:id", updateMinimumTempData);

// Delete minimum temperature data
router.delete("/:id", deleteMinimumTempData);

module.exports = router;