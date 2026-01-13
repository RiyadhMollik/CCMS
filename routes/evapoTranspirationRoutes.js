const express = require("express");
const router = express.Router();
const { uploadEvapoTranspirationData, getAllEvapoTranspirationData, getStations, getYears, getEvapoTranspirationDataById, createEvapoTranspirationData, updateEvapoTranspirationData, deleteEvapoTranspirationData } = require("../controllers/evapoTranspirationController");

router.post("/upload", uploadEvapoTranspirationData);
router.get("/", getAllEvapoTranspirationData);
router.get("/stations", getStations);
router.get("/years", getYears);
router.get("/:id", getEvapoTranspirationDataById);
router.post("/", createEvapoTranspirationData);
router.put("/:id", updateEvapoTranspirationData);
router.delete("/:id", deleteEvapoTranspirationData);

module.exports = router;
