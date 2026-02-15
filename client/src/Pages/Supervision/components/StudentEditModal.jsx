import React, { useState } from "react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import API_BASE_URL from "../../../config/api";

const programTypes = ["BS Intern", "BS Project", "MS Thesis", "PhD Thesis"];
const supervisionRoles = ["Supervisor", "Co-supervisor"];

const StudentEditModal = ({ student, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    programType: student.programType || "",
    supervisionRole: student.supervisionRole || "",
    studentName: student.studentName || "",
    registrationNumber: student.registrationNumber || "",
    semester: student.semester || "",
    dateOfImmatriculation: student.dateOfImmatriculation || "",
    expectedDateOfCompletion: student.expectedDateOfCompletion || "",
    department: student.department || "",
    universityName: student.universityName || "",
    universityAddress: student.universityAddress || "",
    fatherName: student.fatherName || "",
    motherName: student.motherName || "",
    whatsappNumber: student.whatsappNumber || "",
    email: student.email || "",
    emergencyContactNumber: student.emergencyContactNumber || "",
    presentAddress: student.presentAddress || "",
    permanentAddress: student.permanentAddress || "",
    dateOfBirth: student.dateOfBirth || "",
    researchTitle: student.researchTitle || "",
  });

  const [files, setFiles] = useState({
    profilePicture: null,
    conceptNote: null,
    researchProposal: null,
    thesisReport: null,
    galleryImages: [],
  });

  const [galleryToRemove, setGalleryToRemove] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const existingGallery = (student.galleryImages || []).filter(
    (img) => !galleryToRemove.includes(img),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (name === "galleryImages") {
      setFiles((prev) => ({
        ...prev,
        galleryImages: Array.from(selectedFiles),
      }));
    } else {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] || null }));
    }
  };

  const toggleRemoveGalleryImage = (imgPath) => {
    setGalleryToRemove((prev) =>
      prev.includes(imgPath)
        ? prev.filter((p) => p !== imgPath)
        : [...prev, imgPath],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [key, value] of Object.entries(formData)) {
      if (!value || value.toString().trim() === "") {
        toast.error(`Please fill in: ${key.replace(/([A-Z])/g, " $1").trim()}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });

      if (files.profilePicture)
        fd.append("profilePicture", files.profilePicture);
      if (files.conceptNote) fd.append("conceptNote", files.conceptNote);
      if (files.researchProposal)
        fd.append("researchProposal", files.researchProposal);
      if (files.thesisReport) fd.append("thesisReport", files.thesisReport);
      if (files.galleryImages.length > 0) {
        files.galleryImages.forEach((img) => fd.append("galleryImages", img));
      }

      if (galleryToRemove.length > 0) {
        fd.append("removeGalleryImages", JSON.stringify(galleryToRemove));
      }

      const res = await fetch(`${API_BASE_URL}/api/students/${student.id}`, {
        method: "PUT",
        body: fd,
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Student updated successfully!");
        onSuccess?.();
      } else {
        toast.error(json.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error updating student");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "block text-xs font-semibold text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-green-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-lg font-bold">Edit Student</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-600 rounded-lg transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Program Type *</label>
              <select
                name="programType"
                value={formData.programType}
                onChange={handleChange}
                required
                className={inputClass + " bg-white"}
              >
                <option value="">Select</option>
                {programTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Supervision Role *</label>
              <select
                name="supervisionRole"
                value={formData.supervisionRole}
                onChange={handleChange}
                required
                className={inputClass + " bg-white"}
              >
                <option value="">Select</option>
                {supervisionRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Info */}
          <fieldset className="border border-green-200 rounded-lg p-4">
            <legend className="text-xs font-bold text-green-700 px-2">
              Student Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: "studentName", label: "Student Name", type: "text" },
                {
                  name: "registrationNumber",
                  label: "Registration Number",
                  type: "text",
                },
                { name: "semester", label: "Semester", type: "text" },
                {
                  name: "dateOfImmatriculation",
                  label: "Date of Immatriculation",
                  type: "date",
                },
                {
                  name: "expectedDateOfCompletion",
                  label: "Expected Completion",
                  type: "date",
                },
                { name: "department", label: "Department", type: "text" },
                {
                  name: "universityName",
                  label: "University Name",
                  type: "text",
                },
              ].map((f) => (
                <div key={f.name}>
                  <label className={labelClass}>{f.label} *</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className={labelClass}>University Address *</label>
                <input
                  type="text"
                  name="universityAddress"
                  value={formData.universityAddress}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>

          {/* Contact Info */}
          <fieldset className="border border-green-200 rounded-lg p-4">
            <legend className="text-xs font-bold text-green-700 px-2">
              Contact Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: "fatherName", label: "Father's Name", type: "text" },
                { name: "motherName", label: "Mother's Name", type: "text" },
                { name: "whatsappNumber", label: "WhatsApp", type: "text" },
                { name: "email", label: "Email", type: "email" },
                {
                  name: "emergencyContactNumber",
                  label: "Emergency Contact",
                  type: "text",
                },
                { name: "dateOfBirth", label: "Date of Birth", type: "date" },
              ].map((f) => (
                <div key={f.name}>
                  <label className={labelClass}>{f.label} *</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="md:col-span-2 lg:col-span-3">
                <label className={labelClass}>Present Address *</label>
                <textarea
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleChange}
                  required
                  rows={2}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className={labelClass}>Permanent Address *</label>
                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  required
                  rows={2}
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>

          {/* Research */}
          <fieldset className="border border-green-200 rounded-lg p-4">
            <legend className="text-xs font-bold text-green-700 px-2">
              Research
            </legend>
            <label className={labelClass}>Research Title *</label>
            <textarea
              name="researchTitle"
              value={formData.researchTitle}
              onChange={handleChange}
              required
              rows={2}
              className={inputClass}
            />
          </fieldset>

          {/* File Uploads */}
          <fieldset className="border border-green-200 rounded-lg p-4">
            <legend className="text-xs font-bold text-green-700 px-2">
              File Uploads
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  name: "profilePicture",
                  label: "Profile Picture",
                  accept: "image/*",
                  existing: student.profilePicture,
                },
                {
                  name: "conceptNote",
                  label: "Concept Note",
                  accept:
                    ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar",
                  existing: student.conceptNote,
                },
                {
                  name: "researchProposal",
                  label: "Research Proposal",
                  accept:
                    ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar",
                  existing: student.researchProposal,
                },
                {
                  name: "thesisReport",
                  label: "Thesis / Report",
                  accept:
                    ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar",
                  existing: student.thesisReport,
                },
              ].map((f) => (
                <div key={f.name}>
                  <label className={labelClass}>{f.label}</label>
                  {f.existing && (
                    <p className="text-xs text-green-600 mb-1">
                      Current:{" "}
                      <a
                        href={`${API_BASE_URL}/${f.existing}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        View
                      </a>
                    </p>
                  )}
                  <input
                    type="file"
                    name={f.name}
                    accept={f.accept}
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-green-50 file:text-green-700 file:font-medium cursor-pointer"
                  />
                </div>
              ))}

              {/* Gallery */}
              <div className="md:col-span-2">
                <label className={labelClass}>Add More Gallery Images</label>
                <input
                  type="file"
                  name="galleryImages"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-green-50 file:text-green-700 file:font-medium cursor-pointer"
                />
                {files.galleryImages.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    {files.galleryImages.length} new image(s) selected
                  </p>
                )}

                {/* Existing gallery with remove option */}
                {(student.galleryImages || []).length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Existing Gallery:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(student.galleryImages || []).map((img, i) => (
                        <div
                          key={i}
                          className={`relative group ${galleryToRemove.includes(img) ? "opacity-40" : ""}`}
                        >
                          <img
                            src={`${API_BASE_URL}/${img}`}
                            alt={`Gallery ${i + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => toggleRemoveGalleryImage(img)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title={
                              galleryToRemove.includes(img)
                                ? "Undo remove"
                                : "Remove image"
                            }
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {galleryToRemove.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {galleryToRemove.length} image(s) will be removed on
                        save
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white px-8 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEditModal;
