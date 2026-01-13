const express = require("express");
const router = express.Router();
const { uploadSoilTemperatureData, getAllSoilTemperatureData, getStations, getYears, getSoilTemperatureDataById, createSoilTemperatureData, updateSoilTemperatureData, deleteSoilTemperatureData } = require("../controllers/soilTemperatureController");

router.post("/upload", uploadSoilTemperatureData);
router.get("/", getAllSoilTemperatureData);
router.get("/stations", getStations);
router.get("/years", getYears);
router.get("/:id", getSoilTemperatureDataById);
router.post("/", createSoilTemperatureData);
router.put("/:id", updateSoilTemperatureData);
router.delete("/:id", deleteSoilTemperatureData);

module.exports = router;
