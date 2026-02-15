import React from "react";

const programTypes = ["BS Intern", "BS Project", "MS Thesis", "PhD Thesis"];
const supervisionRoles = ["Supervisor", "Co-supervisor"];

const FormDropdowns = ({ formData, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Program Type <span className="text-red-500">*</span>
        </label>
        <select
          name="programType"
          value={formData.programType}
          onChange={onChange}
          required
          className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white transition-all cursor-pointer"
        >
          <option value="">Select Program Type</option>
          {programTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Supervision Role <span className="text-red-500">*</span>
        </label>
        <select
          name="supervisionRole"
          value={formData.supervisionRole}
          onChange={onChange}
          required
          className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white transition-all cursor-pointer"
        >
          <option value="">Select Role</option>
          {supervisionRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FormDropdowns;
