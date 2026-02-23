import React from "react";

const FormContactInfo = ({ formData, onChange }) => {
  const inputClass = "w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all";
  
  return (
    <fieldset className="border-2 border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-emerald-50/30 to-transparent">
      <legend className="text-base font-bold text-emerald-700 px-3 bg-white rounded-lg">
        📞 Contact Information
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Father's Name
          </label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={onChange}
            placeholder="Father's full name"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Mother's Name
          </label>
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={onChange}
            placeholder="Mother's full name"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={onChange}
            required
            placeholder="+880..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            placeholder="student@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Emergency Contact
          </label>
          <input
            type="text"
            name="emergencyContactNumber"
            value={formData.emergencyContactNumber}
            onChange={onChange}
            placeholder="+880..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={onChange}
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Present Address
          </label>
          <textarea
            name="presentAddress"
            value={formData.presentAddress}
            onChange={onChange}
            rows={2}
            placeholder="Current address"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Permanent Address
          </label>
          <textarea
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={onChange}
            rows={2}
            placeholder="Permanent address"
            className={inputClass}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default FormContactInfo;
