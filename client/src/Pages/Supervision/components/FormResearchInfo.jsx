import React from "react";

const FormResearchInfo = ({ formData, onChange }) => {
  return (
    <fieldset className="border border-green-200 rounded-lg p-4">
      <legend className="text-sm font-bold text-green-700 px-2">
        Research Information
      </legend>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Research Title <span className="text-red-500">*</span>
        </label>
        <textarea
          name="researchTitle"
          value={formData.researchTitle}
          onChange={onChange}
          required
          rows={3}
          placeholder="Enter the full research title"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </fieldset>
  );
};

export default FormResearchInfo;
