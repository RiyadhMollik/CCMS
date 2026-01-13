const express = require("express");
const router = express.Router();
const { uploadSoilMoistureData, getAllSoilMoistureData, getStations, getYears, getSoilMoistureDataById, createSoilMoistureData, updateSoilMoistureData, deleteSoilMoistureData } = require("../controllers/soilMoistureController");

router.post("/upload", uploadSoilMoistureData);
router.get("/", getAllSoilMoistureData);
router.get("/stations", getStations);
router.get("/years", getYears);
router.get("/:id", getSoilMoistureDataById);
router.post("/", createSoilMoistureData);
router.put("/:id", updateSoilMoistureData);
router.delete("/:id", deleteSoilMoistureData);

module.exports = router;
