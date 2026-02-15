import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import API_BASE_URL from "../../../config/api";

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:gap-2 py-1.5 border-b border-gray-100 last:border-b-0">
    <span className="text-sm font-semibold text-gray-600 sm:w-52 shrink-0">{label}:</span>
    <span className="text-sm text-gray-800 break-words">{value || "—"}</span>
  </div>
);

const FileLink = ({ label, path }) => {
  if (!path) return null;
  const url = `${API_BASE_URL}/${path}`;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2 py-1.5 border-b border-gray-100">
      <span className="text-sm font-semibold text-gray-600 sm:w-52 shrink-0">{label}:</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-green-600 hover:text-green-800 underline break-all"
      >
        View / Download
      </a>
    </div>
  );
};

const StudentViewModal = ({ student, onClose }) => {
  if (!student) return null;

  const galleryImages = student.galleryImages || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-green-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-lg font-bold">Student Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-600 rounded-lg transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture */}
          {student.profilePicture && (
            <div className="flex justify-center">
              <img
                src={`${API_BASE_URL}/${student.profilePicture}`}
                alt={student.studentName}
                className="w-32 h-32 object-cover rounded-full border-4 border-green-200 shadow-md"
              />
            </div>
          )}

          {/* Category */}
          <div>
            <h3 className="text-base font-bold text-green-700 mb-2 border-b border-green-200 pb-1">
              Program Details
            </h3>
            <InfoRow label="Program Type" value={student.programType} />
            <InfoRow label="Supervision Role" value={student.supervisionRole} />
          </div>

          {/* Student Info */}
          <div>
            <h3 className="text-base font-bold text-green-700 mb-2 border-b border-green-200 pb-1">
              Student Information
            </h3>
            <InfoRow label="Name" value={student.studentName} />
            <InfoRow label="Registration Number" value={student.registrationNumber} />
            <InfoRow label="Semester" value={student.semester} />
            <InfoRow label="Date of Immatriculation" value={student.dateOfImmatriculation} />
            <InfoRow label="Expected Completion" value={student.expectedDateOfCompletion} />
            <InfoRow label="Department" value={student.department} />
            <InfoRow label="University" value={student.universityName} />
            <InfoRow label="University Address" value={student.universityAddress} />
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-bold text-green-700 mb-2 border-b border-green-200 pb-1">
              Contact Information
            </h3>
            <InfoRow label="Father's Name" value={student.fatherName} />
            <InfoRow label="Mother's Name" value={student.motherName} />
            <InfoRow label="WhatsApp" value={student.whatsappNumber} />
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Emergency Contact" value={student.emergencyContactNumber} />
            <InfoRow label="Present Address" value={student.presentAddress} />
            <InfoRow label="Permanent Address" value={student.permanentAddress} />
            <InfoRow label="Date of Birth" value={student.dateOfBirth} />
          </div>

          {/* Research */}
          <div>
            <h3 className="text-base font-bold text-green-700 mb-2 border-b border-green-200 pb-1">
              Research
            </h3>
            <InfoRow label="Research Title" value={student.researchTitle} />
          </div>

          {/* Files */}
          <div>
            <h3 className="text-base font-bold text-green-700 mb-2 border-b border-green-200 pb-1">
              Uploaded Files
            </h3>
            <FileLink label="Concept Note" path={student.conceptNote} />
            <FileLink label="Research Proposal" path={student.researchProposal} />
            <FileLink label="Thesis / Report" path={student.thesisReport} />
            {!student.conceptNote && !student.researchProposal && !student.thesisReport && (
              <p className="text-sm text-gray-400 italic">No files uploaded</p>
            )}
          </div>

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-green-700 mb-2 border-b border-green-200 pb-1">
                Gallery ({galleryImages.length} image{galleryImages.length > 1 ? "s" : ""})
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                {galleryImages.map((img, i) => (
                  <a
                    key={i}
                    href={`${API_BASE_URL}/${img}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${API_BASE_URL}/${img}`}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200 hover:border-green-400 transition-colors"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-3 flex justify-end rounded-b-xl border-t">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentViewModal;
