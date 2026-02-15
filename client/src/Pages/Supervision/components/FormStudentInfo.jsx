import React from "react";

const FormStudentInfo = ({ formData, onChange }) => {
  const inputClass = "w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all";
  
  return (
    <fieldset className="border-2 border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50/30 to-transparent">
      <legend className="text-base font-bold text-emerald-700 px-3 bg-white rounded-lg">
        🎓 Student Information
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Student Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={onChange}
            required
            placeholder="Full name"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Registration Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={onChange}
            required
            placeholder="e.g. 2020-1234"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Semester <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={onChange}
            required
            placeholder="e.g. Spring 2025"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Date of Immatriculation <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dateOfImmatriculation"
            value={formData.dateOfImmatriculation}
            onChange={onChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Expected Date of Completion <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="expectedDateOfCompletion"
            value={formData.expectedDateOfCompletion}
            onChange={onChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={onChange}
            required
            placeholder="Department name"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            University Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="universityName"
            value={formData.universityName}
            onChange={onChange}
            required
            placeholder="University name"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            University Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="universityAddress"
            value={formData.universityAddress}
            onChange={onChange}
            required
            placeholder="Full university address"
            className={inputClass}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default FormStudentInfo;
