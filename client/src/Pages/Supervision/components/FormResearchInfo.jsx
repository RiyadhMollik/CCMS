import React from "react";

const FormResearchInfo = ({ formData, onChange }) => {
  return (
    <fieldset className="border-2 border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50/30 to-transparent">
      <legend className="text-base font-bold text-emerald-700 px-3 bg-white rounded-lg">
        📝 Research Information
      </legend>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Research Title <span className="text-red-500">*</span>
        </label>
        <textarea
          name="researchTitle"
          value={formData.researchTitle}
          onChange={onChange}
          required
          rows={4}
          placeholder="Enter the full research title"
          className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
        />
      </div>
    </fieldset>
  );
};

export default FormResearchInfo;
