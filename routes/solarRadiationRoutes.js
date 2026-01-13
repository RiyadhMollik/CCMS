const express = require("express");
const router = express.Router();
const { uploadSolarRadiationData, getAllSolarRadiationData, getStations, getYears, getSolarRadiationDataById, createSolarRadiationData, updateSolarRadiationData, deleteSolarRadiationData } = require("../controllers/solarRadiationController");

router.post("/upload", uploadSolarRadiationData);
router.get("/", getAllSolarRadiationData);
router.get("/stations", getStations);
router.get("/years", getYears);
router.get("/:id", getSolarRadiationDataById);
router.post("/", createSolarRadiationData);
router.put("/:id", updateSolarRadiationData);
router.delete("/:id", deleteSolarRadiationData);

module.exports = router;
