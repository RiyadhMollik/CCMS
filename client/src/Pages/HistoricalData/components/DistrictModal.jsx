import React from "react";
import { motion } from "framer-motion";

const DistrictModal = ({
  isOpen,
  onClose,
  availableStations,
  selectedDistricts,
  onToggleDistrict,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const handleSelectAll = () => {
    if (selectedDistricts.length === availableStations.length) {
      // Deselect all
      availableStations.forEach((station) => {
        if (selectedDistricts.includes(station)) {
          onToggleDistrict(station);
        }
      });
    } else {
      // Select all
      availableStations.forEach((station) => {
        if (!selectedDistricts.includes(station)) {
          onToggleDistrict(station);
        }
      });
    }
  };

  const isAllSelected = availableStations.length > 0 && selectedDistricts.length === availableStations.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Select Stations</h2>
              <p className="text-blue-100 text-sm mt-1">
                Choose one or more stations to compare
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Select All Option */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              {isAllSelected ? "Deselect All" : "Select All"} ({availableStations.length} stations)
            </span>
          </label>
        </div>

        {/* Stations List */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {availableStations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🏢</div>
              <p className="text-gray-500">No stations available for this parameter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableStations.map((station) => (
                <label
                  key={station}
                  className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedDistricts.includes(station)
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDistricts.includes(station)}
                    onChange={() => onToggleDistrict(station)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className={`ml-3 font-medium ${
                    selectedDistricts.includes(station) ? "text-blue-700" : "text-gray-700"
                  }`}>
                    {station}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {selectedDistricts.length} station{selectedDistricts.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={selectedDistricts.length === 0}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                selectedDistricts.length > 0
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Apply Selection
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DistrictModal;
