import React from "react";

const FormContactInfo = ({ formData, onChange }) => {
  return (
    <fieldset className="border border-green-200 rounded-lg p-4">
      <legend className="text-sm font-bold text-green-700 px-2">
        Contact Information
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Father's Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={onChange}
            required
            placeholder="Father's full name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Mother's Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={onChange}
            required
            placeholder="Mother's full name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={onChange}
            required
            placeholder="+880..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            placeholder="student@example.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Emergency Contact <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="emergencyContactNumber"
            value={formData.emergencyContactNumber}
            onChange={onChange}
            required
            placeholder="+880..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={onChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Present Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="presentAddress"
            value={formData.presentAddress}
            onChange={onChange}
            required
            rows={2}
            placeholder="Current address"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Permanent Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={onChange}
            required
            rows={2}
            placeholder="Permanent address"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default FormContactInfo;
