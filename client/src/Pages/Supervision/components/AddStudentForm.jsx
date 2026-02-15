import React, { useState } from "react";
import toast from "react-hot-toast";
import API_BASE_URL from "../../../config/api";
import FormDropdowns from "./FormDropdowns";
import FormStudentInfo from "./FormStudentInfo";
import FormContactInfo from "./FormContactInfo";
import FormResearchInfo from "./FormResearchInfo";
import FormFileUploads from "./FormFileUploads";

const initialFormData = {
  programType: "",
  supervisionRole: "",
  studentName: "",
  registrationNumber: "",
  semester: "",
  dateOfImmatriculation: "",
  expectedDateOfCompletion: "",
  department: "",
  universityName: "",
  universityAddress: "",
  fatherName: "",
  motherName: "",
  whatsappNumber: "",
  email: "",
  emergencyContactNumber: "",
  presentAddress: "",
  permanentAddress: "",
  dateOfBirth: "",
  researchTitle: "",
};

const AddStudentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [files, setFiles] = useState({
    profilePicture: null,
    conceptNote: null,
    researchProposal: null,
    thesisReport: null,
    galleryImages: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (name === "galleryImages") {
      setFiles((prev) => ({ ...prev, galleryImages: Array.from(selectedFiles) }));
    } else {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] || null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    for (const [key, value] of Object.entries(formData)) {
      if (!value || value.toString().trim() === "") {
        toast.error(`Please fill in: ${key.replace(/([A-Z])/g, " $1").trim()}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const fd = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });

      // Append file fields
      if (files.profilePicture) fd.append("profilePicture", files.profilePicture);
      if (files.conceptNote) fd.append("conceptNote", files.conceptNote);
      if (files.researchProposal) fd.append("researchProposal", files.researchProposal);
      if (files.thesisReport) fd.append("thesisReport", files.thesisReport);
      if (files.galleryImages.length > 0) {
        files.galleryImages.forEach((img) => fd.append("galleryImages", img));
      }

      const res = await fetch(`${API_BASE_URL}/api/students`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Student added successfully!");
        setFormData(initialFormData);
        setFiles({ profilePicture: null, conceptNote: null, researchProposal: null, thesisReport: null, galleryImages: [] });
        onSuccess?.();
      } else {
        toast.error(json.message || "Failed to add student");
      }
    } catch (err) {
      toast.error("Error submitting form");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-green-100">
      <h2 className="text-xl font-bold text-green-700 mb-4 border-b border-green-100 pb-2">
        Add New Student
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormDropdowns formData={formData} onChange={handleChange} />
        <FormStudentInfo formData={formData} onChange={handleChange} />
        <FormContactInfo formData={formData} onChange={handleChange} />
        <FormResearchInfo formData={formData} onChange={handleChange} />
        <FormFileUploads files={files} onChange={handleFileChange} />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white px-8 py-2.5 rounded-lg font-medium transition-colors cursor-pointer"
          >
            {submitting ? "Submitting..." : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;
