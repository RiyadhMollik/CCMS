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
  faculty: "",
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
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 mb-8 border border-emerald-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-800">
          Add New Student
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormDropdowns formData={formData} onChange={handleChange} />
        <FormStudentInfo formData={formData} onChange={handleChange} />
        <FormContactInfo formData={formData} onChange={handleChange} />
        <FormResearchInfo formData={formData} onChange={handleChange} />
        <FormFileUploads files={files} onChange={handleFileChange} />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span>Add Student</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;
