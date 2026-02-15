const express = require("express");
const router = express.Router();
const { studentUpload } = require("../config/multerConfig");
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// Create a new student (with file uploads)
router.post("/", studentUpload, createStudent);

// Get all students
router.get("/", getAllStudents);

// Get a single student by ID
router.get("/:id", getStudentById);

// Update a student (with file uploads)
router.put("/:id", studentUpload, updateStudent);

// Delete a student
router.delete("/:id", deleteStudent);

module.exports = router;
