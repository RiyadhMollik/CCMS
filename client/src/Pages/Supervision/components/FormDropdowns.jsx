import React from "react";

const programTypes = ["BS Intern", "BS Project", "MS Thesis", "PhD Thesis"];
const supervisionRoles = ["Supervisor", "Co-supervisor"];

const FormDropdowns = ({ formData, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Program Type <span className="text-red-500">*</span>
        </label>
        <select
          name="programType"
          value={formData.programType}
          onChange={onChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
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
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Supervision Role <span className="text-red-500">*</span>
        </label>
        <select
          name="supervisionRole"
          value={formData.supervisionRole}
          onChange={onChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
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
