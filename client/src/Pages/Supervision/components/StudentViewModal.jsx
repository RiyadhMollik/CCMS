import React from "react";
import { XMarkIcon, DocumentTextIcon, AcademicCapIcon, UserIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, PhotoIcon } from "@heroicons/react/24/outline";
import API_BASE_URL from "../../../config/api";

const InfoCard = ({ icon: Icon, title, children }) => (
  <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-2.5">
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:gap-3 py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm font-semibold text-gray-600 sm:min-w-[180px]">{label}</span>
    <span className="text-sm text-gray-800 break-words">{value || "—"}</span>
  </div>
);

const FileLink = ({ label, path }) => {
  if (!path) return null;
  const url = `${API_BASE_URL}/${path}`;
  const fileName = path.split("/").pop();
  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-400 transition-colors">
      <DocumentTextIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className="text-xs text-gray-500 truncate">{fileName}</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors flex-shrink-0"
      >
        View
      </a>
    </div>
  );
};

const StudentViewModal = ({ student, onClose }) => {
  if (!student) return null;

  const galleryImages = student.galleryImages || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header with gradient */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-5 flex items-center justify-between rounded-t-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Student Profile</h2>
              <p className="text-emerald-100 text-sm">{student.studentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture */}
          {student.profilePicture && (
            <div className="flex justify-center mb-4">
              <div className="relative group">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-600 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Profile picture container */}
                <div className="relative bg-white p-1.5 rounded-full">
                  <img
                    src={`${API_BASE_URL}/${student.profilePicture}`}
                    alt={student.studentName}
                    className="w-40 h-40 object-cover rounded-full shadow-xl ring-4 ring-white"
                  />
                </div>
                
                {/* Verified badge */}
                <div className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Program Details */}
            <InfoCard icon={AcademicCapIcon} title="Program Details">
              <InfoRow label="Program Type" value={student.programType} />
              <InfoRow label="Supervision Role" value={student.supervisionRole} />
            </InfoCard>

            {/* Student Information */}
            <InfoCard icon={UserIcon} title="Student Information">
              <InfoRow label="Name" value={student.studentName} />
              <InfoRow label="Registration No." value={student.registrationNumber} />
              <InfoRow label="Semester" value={student.semester} />
              <InfoRow label="Date of Initiation (DoI)" value={student.dateOfImmatriculation} />
              <InfoRow label="Expected Date of Completion (EDoC)" value={student.expectedDateOfCompletion} />
              <InfoRow label="Date of Birth" value={student.dateOfBirth} />
            </InfoCard>

            {/* University Info */}
            <InfoCard icon={AcademicCapIcon} title="University Details">
              <InfoRow label="Department" value={student.department} />
              <InfoRow label="Faculty" value={student.faculty} />
              <InfoRow label="University" value={student.universityName} />
              <InfoRow label="Address" value={student.universityAddress} />
            </InfoCard>

            {/* Contact Information */}
            <InfoCard icon={PhoneIcon} title="Contact Information">
              <InfoRow label="Father's Name" value={student.fatherName} />
              <InfoRow label="Mother's Name" value={student.motherName} />
              <InfoRow label="WhatsApp" value={student.whatsappNumber} />
              <InfoRow label="Email" value={student.email} />
              <InfoRow label="Emergency Contact" value={student.emergencyContactNumber} />
            </InfoCard>

            {/* Addresses */}
            <InfoCard icon={MapPinIcon} title="Address Details">
              <InfoRow label="Present Address" value={student.presentAddress} />
              <InfoRow label="Permanent Address" value={student.permanentAddress} />
            </InfoCard>

            {/* Research */}
            <InfoCard icon={DocumentTextIcon} title="Research Details">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">Research Title</p>
                <p className="text-sm text-gray-800 leading-relaxed">{student.researchTitle || "—"}</p>
              </div>
            </InfoCard>
          </div>

          {/* Files */}
          {(student.conceptNote || student.researchProposal || student.thesisReport) && (
            <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-xl p-5 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <DocumentTextIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-gray-800">Uploaded Documents</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <FileLink label="Concept Note" path={student.conceptNote} />
                <FileLink label="Research Proposal" path={student.researchProposal} />
                <FileLink label="Thesis / Report" path={student.thesisReport} />
              </div>
            </div>
          )}

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-xl p-5 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <PhotoIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-gray-800">
                  Gallery <span className="text-sm font-normal text-gray-500">({galleryImages.length} image{galleryImages.length > 1 ? "s" : ""})</span>
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {galleryImages.map((img, i) => (
                  <a
                    key={i}
                    href={`${API_BASE_URL}/${img}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-emerald-400 transition-all hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    <img
                      src={`${API_BASE_URL}/${img}`}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <PhotoIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end rounded-b-2xl border-t shadow-sm">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all cursor-pointer shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentViewModal;
