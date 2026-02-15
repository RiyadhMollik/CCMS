const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Sub-directories for different file types
const subDirs = ["profile-pictures", "concept-notes", "research-proposals", "thesis-reports", "gallery"];
subDirs.forEach((dir) => {
  const dirPath = path.join(uploadDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Map field names to sub-directories
const fieldToDir = {
  profilePicture: "profile-pictures",
  conceptNote: "concept-notes",
  researchProposal: "research-proposals",
  thesisReport: "thesis-reports",
  galleryImages: "gallery",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = fieldToDir[file.fieldname] || "misc";
    const dest = path.join(uploadDir, subDir);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Use email from the form body for traceable naming
    const email = (req.body.email || "unknown").replace(/[^a-zA-Z0-9]/g, "_");
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
    // Format: email_fieldname_originalname_timestamp.ext
    const filename = `${email}_${file.fieldname}_${baseName}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow images for profile picture and gallery
  const imageTypes = /jpeg|jpg|png|gif|webp|avif|bmp|svg/;
  // Allow documents for concept note, research proposal, thesis
  const docTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|zip|rar/;

  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");

  if (
    file.fieldname === "profilePicture" ||
    file.fieldname === "galleryImages"
  ) {
    if (imageTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Only image files are allowed for ${file.fieldname}`), false);
    }
  } else {
    // For document uploads, allow images + documents
    if (imageTypes.test(ext) || docTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${ext} is not allowed for ${file.fieldname}`), false);
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB per file
  },
});

// Define the fields for the multi-file upload
const studentUpload = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "conceptNote", maxCount: 1 },
  { name: "researchProposal", maxCount: 1 },
  { name: "thesisReport", maxCount: 1 },
  { name: "galleryImages", maxCount: 50 }, // unlimited practically
]);

module.exports = { studentUpload, uploadDir };
