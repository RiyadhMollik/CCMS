const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // --- Category ---
    programType: {
      type: DataTypes.ENUM("BS Intern", "BS Project", "MS Thesis", "PhD Thesis"),
      allowNull: false,
      comment: "Type of program",
    },
    supervisionRole: {
      type: DataTypes.ENUM("Supervisor", "Co-supervisor"),
      allowNull: false,
      comment: "Role in supervision",
    },
    // --- Student Info ---
    studentName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    registrationNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dateOfImmatriculation: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Date of immatriculation",
    },
    expectedDateOfCompletion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Expected date of completion",
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    faculty: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Faculty name",
    },
    universityName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    universityAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // --- Contact Info ---
    fatherName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    motherName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    whatsappNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    emergencyContactNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    presentAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    permanentAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // --- Research ---
    researchTitle: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // --- Files (store paths) ---
    profilePicture: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Path to profile picture",
    },
    conceptNote: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Path to concept note file",
    },
    researchProposal: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Path to research proposal file",
    },
    thesisReport: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Path to thesis/report file",
    },
    // --- Gallery images (JSON array of paths) ---
    galleryImages: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON array of gallery image paths",
      get() {
        const val = this.getDataValue("galleryImages");
        return val ? JSON.parse(val) : [];
      },
      set(val) {
        this.setDataValue("galleryImages", JSON.stringify(val || []));
      },
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

module.exports = Student;
