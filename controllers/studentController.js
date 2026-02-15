const Student = require("../models/Student");
const path = require("path");
const fs = require("fs");

// Helper: build file path relative for DB storage
const getRelativePath = (file) => {
  if (!file) return null;
  // Store path relative to uploads folder: e.g. "profile-pictures/email_filename.jpg"
  const uploadsIndex = file.path.indexOf("uploads");
  if (uploadsIndex !== -1) {
    return file.path.substring(uploadsIndex);
  }
  return file.path;
};

// CREATE student
const createStudent = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.profilePicture && req.files.profilePicture[0]) {
        data.profilePicture = getRelativePath(req.files.profilePicture[0]);
      }
      if (req.files.conceptNote && req.files.conceptNote[0]) {
        data.conceptNote = getRelativePath(req.files.conceptNote[0]);
      }
      if (req.files.researchProposal && req.files.researchProposal[0]) {
        data.researchProposal = getRelativePath(req.files.researchProposal[0]);
      }
      if (req.files.thesisReport && req.files.thesisReport[0]) {
        data.thesisReport = getRelativePath(req.files.thesisReport[0]);
      }
      if (req.files.galleryImages && req.files.galleryImages.length > 0) {
        data.galleryImages = req.files.galleryImages.map((f) => getRelativePath(f));
      }
    }

    const student = await Student.create(data);
    res.status(201).json({ success: true, data: student, message: "Student created successfully" });
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: students });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE student
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const data = { ...req.body };

    // Handle file uploads on update
    if (req.files) {
      if (req.files.profilePicture && req.files.profilePicture[0]) {
        // Delete old file if exists
        if (student.profilePicture) {
          const oldPath = path.join(__dirname, "..", student.profilePicture);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        data.profilePicture = getRelativePath(req.files.profilePicture[0]);
      }
      if (req.files.conceptNote && req.files.conceptNote[0]) {
        if (student.conceptNote) {
          const oldPath = path.join(__dirname, "..", student.conceptNote);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        data.conceptNote = getRelativePath(req.files.conceptNote[0]);
      }
      if (req.files.researchProposal && req.files.researchProposal[0]) {
        if (student.researchProposal) {
          const oldPath = path.join(__dirname, "..", student.researchProposal);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        data.researchProposal = getRelativePath(req.files.researchProposal[0]);
      }
      if (req.files.thesisReport && req.files.thesisReport[0]) {
        if (student.thesisReport) {
          const oldPath = path.join(__dirname, "..", student.thesisReport);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        data.thesisReport = getRelativePath(req.files.thesisReport[0]);
      }
      if (req.files.galleryImages && req.files.galleryImages.length > 0) {
        // Append new gallery images to existing ones
        const existingGallery = student.galleryImages || [];
        const newImages = req.files.galleryImages.map((f) => getRelativePath(f));
        data.galleryImages = [...existingGallery, ...newImages];
      }
    }

    // Handle gallery image removal (sent as JSON array of paths to remove)
    if (req.body.removeGalleryImages) {
      try {
        const toRemove = JSON.parse(req.body.removeGalleryImages);
        const currentGallery = data.galleryImages || student.galleryImages || [];
        data.galleryImages = currentGallery.filter((img) => !toRemove.includes(img));
        // Delete files
        toRemove.forEach((imgPath) => {
          const fullPath = path.join(__dirname, "..", imgPath);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });
      } catch (e) {
        // ignore parse error
      }
    }

    await student.update(data);
    const updatedStudent = await Student.findByPk(req.params.id);
    res.json({ success: true, data: updatedStudent, message: "Student updated successfully" });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Delete associated files
    const filePaths = [student.profilePicture, student.conceptNote, student.researchProposal, student.thesisReport];
    filePaths.forEach((fp) => {
      if (fp) {
        const fullPath = path.join(__dirname, "..", fp);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    });

    // Delete gallery images
    const gallery = student.galleryImages || [];
    gallery.forEach((fp) => {
      if (fp) {
        const fullPath = path.join(__dirname, "..", fp);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    });

    await student.destroy();
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
