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
    "w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-5 flex items-center justify-between rounded-t-2xl z-10 shadow-lg">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>✏️</span> Edit Student
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-all cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Dropdowns */}
          <div className="bg-gradient-to-br from-emerald-50/30 to-transparent border-2 border-emerald-200 rounded-xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Program Type *</label>
                <select
                  name="programType"
                  value={formData.programType}
                  onChange={handleChange}
                  required
                  className={inputClass + " bg-white"}
                >
                  <option value="">Select Program Type</option>
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
                  <option value="">Select Role</option>
                  {supervisionRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <fieldset className="border-2 border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50/30 to-transparent">
            <legend className="text-base font-bold text-emerald-700 px-3 bg-white rounded-lg">
              🎓 Student Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              <div className="md:col-span-2 lg:col-span-3">
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
          <fieldset className="border-2 border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50/30 to-transparent">
            <legend className="text-base font-bold text-emerald-700 px-3 bg-white rounded-lg">
              📞 Contact Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
          <fieldset className="border-2 border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50/30 to-transparent">
            <legend className="text-base font-bold text-emerald-700 px-3 bg-white rounded-lg">
              🔬 Research
            </legend>
            <label className={labelClass}>Research Title *</label>
            <textarea
              name="researchTitle"
              value={formData.researchTitle}
              onChange={handleChange}
              required
              rows={3}
              className={inputClass}
            />
          </fieldset>

          {/* File Uploads */}
          <fieldset className="border-2 border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50/30 to-transparent">
            <legend className="text-base font-bold text-emerald-700 px-3 bg-white rounded-lg">
              📎 File Uploads
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  name: "profilePicture",
                  label: "📸 Profile Picture",
                  accept: "image/*",
                  existing: student.profilePicture,
                },
                {
                  name: "conceptNote",
                  label: "📄 Concept Note",
                  accept:
                    ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar",
                  existing: student.conceptNote,
                },
                {
                  name: "researchProposal",
                  label: "📊 Research Proposal",
                  accept:
                    ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar",
                  existing: student.researchProposal,
                },
                {
                  name: "thesisReport",
                  label: "📖 Thesis / Report",
                  accept:
                    ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar",
                  existing: student.thesisReport,
                },
              ].map((f) => (
                <div key={f.name} className="space-y-2">
                  <label className={labelClass}>{f.label}</label>
                  {f.existing && (
                    <a
                      href={`${API_BASE_URL}/${f.existing}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                    >
                      <span>👁️</span>
                      <span>View Current</span>
                    </a>
                  )}
                  <input
                    type="file"
                    name={f.name}
                    accept={f.accept}
                    onChange={handleFileChange}
                    className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-emerald-600 file:to-teal-600 file:text-white file:font-semibold file:cursor-pointer hover:file:from-emerald-700 hover:file:to-teal-700 file:shadow-md file:transition-all cursor-pointer"
                  />
                </div>
              ))}

              {/* Gallery */}
              <div className="md:col-span-2 space-y-3">
                <label className={labelClass}>🖼️ Add More Gallery Images</label>
                <input
                  type="file"
                  name="galleryImages"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-emerald-600 file:to-teal-600 file:text-white file:font-semibold file:cursor-pointer hover:file:from-emerald-700 hover:file:to-teal-700 file:shadow-md file:transition-all cursor-pointer"
                />
                {files.galleryImages.length > 0 && (
                  <p className="text-sm text-emerald-600 font-semibold flex items-center gap-1">
                    <span>✓</span> {files.galleryImages.length} new image(s) selected
                  </p>
                )}

                {/* Existing gallery with remove option */}
                {(student.galleryImages || []).length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-bold text-gray-700 mb-3">
                      📌 Existing Gallery:
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {(student.galleryImages || []).map((img, i) => (
                        <div
                          key={i}
                          className={`relative group ${galleryToRemove.includes(img) ? "opacity-40 scale-95" : ""} transition-all`}
                        >
                          <img
                            src={`${API_BASE_URL}/${img}`}
                            alt={`Gallery ${i + 1}`}
                            className="w-full aspect-square object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => toggleRemoveGalleryImage(img)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
                            title={
                              galleryToRemove.includes(img)
                                ? "Undo remove"
                                : "Remove image"
                            }
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {galleryToRemove.length > 0 && (
                      <p className="text-sm text-red-600 font-semibold mt-3 flex items-center gap-1">
                        <span>⚠️</span>
                        {galleryToRemove.length} image(s) will be removed on save
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEditModal;
