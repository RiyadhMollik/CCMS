const express = require("express");
const router = express.Router();
const { uploadAverageTemperatureData, getAllAverageTemperatureData, getStations, getYears, getAverageTemperatureDataById, createAverageTemperatureData, updateAverageTemperatureData, deleteAverageTemperatureData } = require("../controllers/averageTemperatureController");

router.post("/upload", uploadAverageTemperatureData);
router.get("/", getAllAverageTemperatureData);
router.get("/stations", getStations);
router.get("/years", getYears);
router.get("/:id", getAverageTemperatureDataById);
router.post("/", createAverageTemperatureData);
router.put("/:id", updateAverageTemperatureData);
router.delete("/:id", deleteAverageTemperatureData);

module.exports = router;
