import React from "react";

const FormStudentInfo = ({ formData, onChange }) => {
  return (
    <fieldset className="border border-green-200 rounded-lg p-4">
      <legend className="text-sm font-bold text-green-700 px-2">
        Student Information
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Student Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={onChange}
            required
            placeholder="Full name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Registration Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={onChange}
            required
            placeholder="e.g. 2020-1234"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Semester <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={onChange}
            required
            placeholder="e.g. Spring 2025"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date of Immatriculation <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dateOfImmatriculation"
            value={formData.dateOfImmatriculation}
            onChange={onChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Expected Date of Completion <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="expectedDateOfCompletion"
            value={formData.expectedDateOfCompletion}
            onChange={onChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={onChange}
            required
            placeholder="Department name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            University Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="universityName"
            value={formData.universityName}
            onChange={onChange}
            required
            placeholder="University name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            University Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="universityAddress"
            value={formData.universityAddress}
            onChange={onChange}
            required
            placeholder="Full university address"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default FormStudentInfo;
