import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import API_BASE_URL from "../../config/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const HistoricalData = () => {
  const [selectedParameter, setSelectedParameter] = useState("");
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [availableStations, setAvailableStations] = useState([]);
  const [dataInterval, setDataInterval] = useState("1M");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const dataParameters = [
    { value: "maximum-temp", label: "Maximum Temperature (°C)", color: "#ef4444" },
    { value: "minimum-temp", label: "Minimum Temperature (°C)", color: "#3b82f6" },
    { value: "rainfall", label: "Rainfall (mm)", color: "#06b6d4" },
    { value: "relative-humidity", label: "Relative Humidity (%)", color: "#8b5cf6" },
    { value: "sunshine", label: "Sunshine (hrs)", color: "#f59e0b" },
    { value: "wind-speed", label: "Wind Speed (m/s)", color: "#10b981" },
    { value: "soil-moisture", label: "Soil Moisture (%)", color: "#84cc16" },
    { value: "soil-temperature", label: "Soil Temperature (°C)", color: "#f97316" },
    { value: "average-temperature", label: "Average Temperature (°C)", color: "#ec4899" },
    { value: "solar-radiation", label: "Solar Radiation (W/m²)", color: "#eab308" },
    { value: "evapo-transpiration", label: "Evapo Transpiration (mm)", color: "#14b8a6" },
  ];

  const intervals = [
    { value: "1D", label: "1 Day" },
    { value: "1W", label: "1 Week" },
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
    { value: "5Y", label: "5 Years" },
    { value: "10Y", label: "10 Years" },
    { value: "20Y", label: "20 Years" },
    { value: "30Y", label: "30 Years" },
    { value: "50Y", label: "50 Years" },
    { value: "All", label: "All Data" },
  ];

  // Fetch available stations from database
  useEffect(() => {
    const fetchStations = async () => {
      if (selectedParameter) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/${selectedParameter}/stations`
          );
          if (response.data.success) {
            setAvailableStations(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching stations:", error);
        }
      }
    };
    fetchStations();
  }, [selectedParameter]);

  const handleParameterChange = (e) => {
    const value = e.target.value;
    setSelectedParameter(value);
    setSelectedDistricts([]);
    setChartData(null);
    if (value) {
      setIsDistrictModalOpen(true);
    }
  };

  const handleDistrictToggle = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };

  const handleDistrictModalSubmit = () => {
    if (selectedDistricts.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Districts Selected",
        text: "Please select at least one district",
      });
      return;
    }
    setIsDistrictModalOpen(false);
    fetchChartData();
  };

  const fetchChartData = async () => {
    setLoading(true);
    try {
      // Calculate date range based on interval or use custom dates
      let calculatedStartDate = null;
      let calculatedEndDate = null;

      if (startDate && endDate) {
        // Use custom date range
        calculatedStartDate = startDate;
        calculatedEndDate = endDate;
        console.log("Using custom date range:", startDate, "to:", endDate);
      } else {
        // Calculate based on preset interval
        const intervalDays = {
          "1D": 1,
          "1W": 7,
          "1M": 30,
          "3M": 90,
          "6M": 180,
          "1Y": 365,
          "5Y": 1825,
          "10Y": 3650,
          "20Y": 7300,
          "30Y": 10950,
          "50Y": 18250,
          "All": null,
        };

        const daysBack = intervalDays[dataInterval];
        
        if (daysBack) {
          const endDateObj = new Date();
          calculatedEndDate = endDateObj.toISOString().split("T")[0];
          
          const startDateObj = new Date();
          startDateObj.setDate(startDateObj.getDate() - daysBack);
          calculatedStartDate = startDateObj.toISOString().split("T")[0];
          
          console.log(`Using preset interval ${dataInterval}: ${calculatedStartDate} to ${calculatedEndDate}`);
        } else {
          console.log("Fetching all data");
        }
      }

      // Fetch data for all selected districts with date range parameters
      const promises = selectedDistricts.map((station) => {
        let url = `${API_BASE_URL}/api/${selectedParameter}?station=${encodeURIComponent(station)}&limit=10000`;
        
        if (calculatedStartDate) {
          url += `&startDate=${calculatedStartDate}`;
        }
        if (calculatedEndDate) {
          url += `&endDate=${calculatedEndDate}`;
        }
        
        console.log("Fetching:", url);
        return axios.get(url);
      });

      const responses = await Promise.all(promises);
      
      console.log("API Responses:", responses.map(r => ({
        success: r.data.success,
        recordCount: r.data.data?.length
      })));

      // Process and aggregate data
      const allData = [];
      responses.forEach((response, index) => {
        const station = selectedDistricts[index];
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          console.log(`Processing ${response.data.data.length} records for ${station}`);
          
          response.data.data.forEach((record) => {
            // Convert data to time series - process all day columns
            for (let day = 1; day <= 31; day++) {
              const value = record[`day${day}`];
              
              // Only process if value exists and is not null
              if (value !== null && value !== undefined && value !== "") {
                // Create proper date
                const year = parseInt(record.year);
                const month = parseInt(record.month);
                const date = new Date(year, month - 1, day);
                
                // Skip invalid dates (e.g., Feb 30)
                if (date.getDate() === day && date.getMonth() === month - 1) {
                  const dateStr = date.toISOString().split("T")[0];
                  
                  // All data is already filtered by backend, so just add it
                  allData.push({
                    date: dateStr,
                    value: parseFloat(value),
                    station: station,
                  });
                }
              }
            }
          });
        }
      });

      console.log("Total data points:", allData.length);
      console.log("Sample data:", allData.slice(0, 5));

      if (allData.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No Data Available",
          text: "No data found for the selected criteria. The database might not have any valid values recorded for this date range.",
        });
        setChartData(null);
        setLoading(false);
        return;
      }

      // Sort by date ascending (oldest to newest, so recent appears on right)
      allData.sort((a, b) => new Date(a.date) - new Date(b.date));

      console.log("Date range in data:", allData[0]?.date, "to", allData[allData.length - 1]?.date);
      console.log("Final data points:", allData.length);

      // Create datasets for each district
      const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];
      const datasets = selectedDistricts.map((station, index) => {
        const stationData = allData.filter((d) => d.station === station);
        const color = colors[index % colors.length];
        
        console.log(`${station}: ${stationData.length} data points`);
        
        return {
          label: station,
          data: stationData.map((d) => ({ x: d.date, y: d.value })),
          borderColor: color,
          backgroundColor: color,
          borderWidth: 2,
          pointRadius: stationData.length > 1000 ? 0 : 3,
          pointHoverRadius: 5,
          fill: false,
          tension: 0.1,
        };
      });

      console.log("Datasets created:", datasets.length);
      console.log("First dataset sample:", datasets[0]?.data?.slice(0, 3));

      setChartData({
        datasets,
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load chart data",
      });
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: dataParameters.find((p) => p.value === selectedParameter)?.label || "Historical Data",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: dataInterval === "1D" ? "hour" : 
                dataInterval === "1W" ? "day" :
                dataInterval === "1M" ? "day" :
                dataInterval === "3M" ? "week" :
                dataInterval === "6M" ? "week" :
                dataInterval === "1Y" ? "month" :
                ["5Y", "10Y"].includes(dataInterval) ? "month" :
                ["20Y", "30Y", "50Y", "All"].includes(dataInterval) ? "year" : "day",
          tooltipFormat: "MMM dd, yyyy",
          displayFormats: {
            hour: "MMM dd HH:mm",
            day: "MMM dd",
            week: "MMM dd",
            month: "MMM yyyy",
            year: "yyyy",
          },
        },
        title: {
          display: true,
          text: "Date",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 15,
          font: {
            size: 11,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: dataParameters.find((p) => p.value === selectedParameter)?.label || "Value",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
        beginAtZero: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Historical Climate Data
          </h1>
          <p className="text-gray-600">
            Analyze historical climate patterns across different regions
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Parameter Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Parameter
              </label>
              <select
                value={selectedParameter}
                onChange={handleParameterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Parameter --</option>
                {dataParameters.map((param) => (
                  <option key={param.value} value={param.value}>
                    {param.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Interval
              </label>
              <select
                value={dataInterval}
                onChange={(e) => setDataInterval(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {intervals.map((interval) => (
                  <option key={interval.value} value={interval.value}>
                    {interval.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date (Optional)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Selected Districts Display */}
          {selectedDistricts.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Districts ({selectedDistricts.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedDistricts.map((district) => (
                  <span
                    key={district}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {district}
                    <button
                      onClick={() => handleDistrictToggle(district)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setIsDistrictModalOpen(true)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200"
                >
                  + Add More
                </button>
              </div>
            </div>
          )}

          {/* Generate Button */}
          {selectedParameter && selectedDistricts.length > 0 && (
            <button
              onClick={fetchChartData}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Generate Chart
            </button>
          )}
        </div>

        {/* Chart */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        )}

        {chartData && !loading && chartData.datasets && chartData.datasets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div style={{ height: "500px" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
            
            {/* Data Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Data Summary:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {chartData.datasets.map((dataset, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dataset.borderColor }}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {dataset.label}: {dataset.data.length} points
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!chartData && !loading && selectedParameter && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Data to Display
            </h3>
            <p className="text-gray-600">
              Select districts and generate the chart to view historical data
            </p>
          </div>
        )}
      </motion.div>

      {/* District Selection Modal */}
      <AnimatePresence>
        {isDistrictModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
                <h2 className="text-xl font-bold">Select Districts/Stations</h2>
                <button
                  onClick={() => setIsDistrictModalOpen(false)}
                  className="text-white hover:text-gray-200"
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

              <div className="p-6">
                {availableStations.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    No stations available for this parameter
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableStations.map((station) => (
                      <label
                        key={station}
                        className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDistricts.includes(station)}
                          onChange={() => handleDistrictToggle(station)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">{station}</span>
                      </label>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsDistrictModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDistrictModalSubmit}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Apply ({selectedDistricts.length} selected)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoricalData;
