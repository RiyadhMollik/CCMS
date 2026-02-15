import React from "react";

const MAX_FILE_SIZE_LABEL = "50 MB";

const FormFileUploads = ({ files, onChange }) => {
  return (
    <fieldset className="border border-green-200 rounded-lg p-4">
      <legend className="text-sm font-bold text-green-700 px-2">
        File Uploads{" "}
        <span className="text-gray-500 font-normal text-xs">
          (Optional — max {MAX_FILE_SIZE_LABEL} per file)
        </span>
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-green-50 file:text-green-700 file:font-medium hover:file:bg-green-100 cursor-pointer"
          />
          {files.profilePicture && (
            <p className="text-xs text-green-600 mt-1">
              Selected: {files.profilePicture.name}
            </p>
          )}
        </div>

        {/* Concept Note */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Concept Note
          </label>
          <input
            type="file"
            name="conceptNote"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-green-50 file:text-green-700 file:font-medium hover:file:bg-green-100 cursor-pointer"
          />
          {files.conceptNote && (
            <p className="text-xs text-green-600 mt-1">
              Selected: {files.conceptNote.name}
            </p>
          )}
        </div>

        {/* Research Proposal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Research Proposal
          </label>
          <input
            type="file"
            name="researchProposal"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-green-50 file:text-green-700 file:font-medium hover:file:bg-green-100 cursor-pointer"
          />
          {files.researchProposal && (
            <p className="text-xs text-green-600 mt-1">
              Selected: {files.researchProposal.name}
            </p>
          )}
        </div>

        {/* Thesis / Report */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Thesis / Report
          </label>
          <input
            type="file"
            name="thesisReport"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-green-50 file:text-green-700 file:font-medium hover:file:bg-green-100 cursor-pointer"
          />
          {files.thesisReport && (
            <p className="text-xs text-green-600 mt-1">
              Selected: {files.thesisReport.name}
            </p>
          )}
        </div>

        {/* Gallery Images */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Gallery Images{" "}
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-green-50 file:text-green-700 file:font-medium hover:file:bg-green-100 cursor-pointer"
          />
          {files.galleryImages && files.galleryImages.length > 0 && (
            <p className="text-xs text-green-600 mt-1">
              {files.galleryImages.length} image(s) selected
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default FormFileUploads;
