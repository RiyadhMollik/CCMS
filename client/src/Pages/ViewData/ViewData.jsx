import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

const ViewData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize] = useState(50);

  // Filters
  const [selectedDataType, setSelectedDataType] = useState("maximum-temp");
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [stations, setStations] = useState([]);
  const [years, setYears] = useState([]);

  const dataTypeOptions = [
    { value: "maximum-temp", label: "Maximum Temperature" },
    { value: "minimum-temp", label: "Minimum Temperature" },
    { value: "rainfall", label: "Rainfall" },
    { value: "relative-humidity", label: "Relative Humidity" },
    { value: "sunshine", label: "Sunshine" },
  ];

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    fetchFilters();
  }, [selectedDataType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStation, selectedYear, selectedMonth, selectedDataType]);

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedStation, selectedYear, selectedMonth, selectedDataType]);

  const fetchFilters = async () => {
    try {
      const [stationsRes, yearsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/${selectedDataType}/stations`),
        axios.get(`http://localhost:5000/api/${selectedDataType}/years`),
      ]);

      if (stationsRes.data.success) setStations(stationsRes.data.data);
      if (yearsRes.data.success) setYears(yearsRes.data.data);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", pageSize);
      if (selectedStation) params.append("station", selectedStation);
      if (selectedYear) params.append("year", selectedYear);
      if (selectedMonth) params.append("month", selectedMonth);

      const response = await axios.get(
        `http://localhost:5000/api/${selectedDataType}?${params.toString()}`
      );

      if (response.data.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalRecords(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch data",
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/${selectedDataType}/${id}`);
        Swal.fire("Deleted!", "Record has been deleted.", "success");
        fetchData();
      } catch (error) {
        console.error("Error deleting record:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to delete record",
        });
      }
    }
  };

  const formatTemp = (value) => {
    if (value === null || value === undefined) return "-";
    return parseFloat(value).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-full mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {dataTypeOptions.find(dt => dt.value === selectedDataType)?.label || "Climate"} Data
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage {selectedDataType === 'rainfall' ? 'rainfall' : selectedDataType.replace('-', ' ')} records from weather stations
          </p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Filter Data
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Data Type
              </label>
              <select
                value={selectedDataType}
                onChange={(e) => setSelectedDataType(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dataTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Station
              </label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- All Stations --</option>
                {stations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- All Years --</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- All Months --</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>

            {(selectedStation || selectedYear || selectedMonth) && (
              <button
                onClick={() => {
                  setSelectedStation("");
                  setSelectedYear("");
                  setSelectedMonth("");
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {data.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm sm:text-base">{totalRecords} records found</span>
            </motion.div>
          )}
        </motion.div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-base sm:text-lg">Loading data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-600 text-base sm:text-lg">No data available</p>
              <p className="text-gray-500 text-sm mt-2">
                Upload some data or adjust your filters
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold border-b-2 border-r">
                        Station
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold border-b-2 border-r">
                        Year
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold border-b-2 border-r">
                        Month
                      </th>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <th
                          key={day}
                          className="px-1 sm:px-2 py-3 text-center text-[10px] sm:text-xs font-medium border-b-2 border-r"
                        >
                          {day}
                        </th>
                      ))}
                      <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold border-b-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-800 border-b border-r">
                          {row.station}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-center text-gray-700 border-b border-r">
                          {row.year}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-center text-gray-700 border-b border-r">
                          {months.find((m) => m.value === row.month.toString())?.label ||
                            row.month}
                        </td>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <td
                            key={day}
                            className="px-1 sm:px-2 py-2 text-[10px] sm:text-xs text-center text-gray-600 border-b border-r"
                          >
                            {formatTemp(row[`day${day}`])}
                          </td>
                        ))}
                        <td className="px-2 sm:px-4 py-2 text-center border-b">
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords}{" "}
                  records
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Page</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          setCurrentPage(page);
                        }
                      }}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-600">of {totalPages}</span>
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ViewData;
