import React from "react";

const MAX_FILE_SIZE_LABEL = "50 MB";

const FormFileUploads = ({ files, onChange }) => {
  const fileInputClass = "w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-3 py-3 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-emerald-600 file:to-teal-600 file:text-white file:font-semibold file:cursor-pointer hover:file:from-emerald-700 hover:file:to-teal-700 file:shadow-md file:transition-all cursor-pointer transition-all";
  
  return (
    <fieldset className="border-2 border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50/30 to-transparent">
      <legend className="text-base font-bold text-emerald-700 px-3 bg-white rounded-lg">
        📎 File Uploads{" "}
        <span className="text-gray-500 font-normal text-xs">
          (Optional — max {MAX_FILE_SIZE_LABEL} per file)
        </span>
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📸 Profile Picture
          </label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={onChange}
            className={fileInputClass}
          />
          {files.profilePicture && (
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <span>✓</span> {files.profilePicture.name}
            </p>
          )}
        </div>

        {/* Concept Note */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📄 Concept Note
          </label>
          <input
            type="file"
            name="conceptNote"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
            onChange={onChange}
            className={fileInputClass}
          />
          {files.conceptNote && (
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <span>✓</span> {files.conceptNote.name}
            </p>
          )}
        </div>

        {/* Research Proposal */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📊 Research Proposal
          </label>
          <input
            type="file"
            name="researchProposal"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
            onChange={onChange}
            className={fileInputClass}
          />
          {files.researchProposal && (
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <span>✓</span> {files.researchProposal.name}
            </p>
          )}
        </div>

        {/* Thesis / Report */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📖 Thesis / Report
          </label>
          <input
            type="file"
            name="thesisReport"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
            onChange={onChange}
            className={fileInputClass}
          />
          {files.thesisReport && (
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <span>✓</span> {files.thesisReport.name}
            </p>
          )}
        </div>

        {/* Gallery Images */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🖼️ Gallery Images{" "}
            <span className="text-gray-500 font-normal text-xs">
              (Multiple images allowed)
            </span>
          </label>
          <input
            type="file"
            name="galleryImages"
            accept="image/*"
            multiple
            onChange={onChange}
            className={fileInputClass}
          />
          {files.galleryImages && files.galleryImages.length > 0 && (
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <span>✓</span> {files.galleryImages.length} image(s) selected
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default FormFileUploads;
