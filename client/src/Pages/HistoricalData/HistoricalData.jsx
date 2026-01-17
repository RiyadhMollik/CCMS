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
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";

// Import components
import {
  DistrictModal,
  ControlPanel,
  ChartDisplay,
  dataParameters,
  intervals,
  chartColors,
  getChartOptions,
} from "./components";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

const HistoricalData = () => {
  // State management
  const [selectedParameter, setSelectedParameter] = useState("");
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [availableStations, setAvailableStations] = useState([]);
  const [dataInterval, setDataInterval] = useState("1M");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch available stations when parameter changes
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
          setAvailableStations([]);
        }
      }
    };
    fetchStations();
  }, [selectedParameter]);

  // Handlers
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
        title: "No Stations Selected",
        text: "Please select at least one station",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }
    setIsDistrictModalOpen(false);
    fetchChartData();
  };

  // Fetch and process chart data
  const fetchChartData = async () => {
    setLoading(true);
    try {
      const useCustomDateRange = startDate && endDate;

      // Fetch data for all selected districts
      const promises = selectedDistricts.map((station) => {
        let url = `${API_BASE_URL}/api/${selectedParameter}?station=${encodeURIComponent(station)}&limit=10000`;
        
        if (useCustomDateRange) {
          url += `&startDate=${startDate}&endDate=${endDate}`;
        }
        
        return axios.get(url);
      });

      const responses = await Promise.all(promises);

      // Process and aggregate data
      const allData = [];
      responses.forEach((response, index) => {
        const station = selectedDistricts[index];
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          response.data.data.forEach((record) => {
            for (let day = 1; day <= 31; day++) {
              const value = record[`day${day}`];
              
              if (value !== null && value !== undefined && value !== "") {
                const year = parseInt(record.year);
                const month = parseInt(record.month);
                const date = new Date(year, month - 1, day);
                
                // Skip invalid dates
                if (date.getDate() === day && date.getMonth() === month - 1) {
                  allData.push({
                    date: date.toISOString().split("T")[0],
                    value: parseFloat(value),
                    station: station,
                  });
                }
              }
            }
          });
        }
      });

      if (allData.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Data Found",
          text: "No data available for the selected stations.",
          confirmButtonColor: "#3b82f6",
        });
        setChartData(null);
        setLoading(false);
        return;
      }

      // Sort by date
      allData.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Filter by interval if not using custom date range
      let filteredData = allData;
      if (!useCustomDateRange && dataInterval !== "All") {
        const mostRecentDate = new Date(allData[allData.length - 1].date);
        
        const intervalDays = {
          "1D": 1, "1W": 7, "1M": 30, "3M": 90, "6M": 180,
          "1Y": 365, "5Y": 1825, "10Y": 3650, "20Y": 7300,
          "30Y": 10950, "50Y": 18250,
        };

        const daysBack = intervalDays[dataInterval] || 30;
        const cutoffDate = new Date(mostRecentDate);
        cutoffDate.setDate(cutoffDate.getDate() - daysBack);
        const cutoffDateStr = cutoffDate.toISOString().split("T")[0];

        filteredData = allData.filter(d => d.date >= cutoffDateStr);
      }

      if (filteredData.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Data Found",
          text: "No data available for the selected time range.",
          confirmButtonColor: "#3b82f6",
        });
        setChartData(null);
        setLoading(false);
        return;
      }

      // Create datasets for each district
      const datasets = selectedDistricts.map((station, index) => {
        const stationData = filteredData.filter((d) => d.station === station);
        const color = chartColors[index % chartColors.length];
        
        return {
          label: station,
          data: stationData.map((d) => ({ x: d.date, y: d.value })),
          borderColor: color,
          backgroundColor: `${color}20`,
          borderWidth: 2.5,
          pointRadius: stationData.length > 500 ? 0 : stationData.length > 100 ? 2 : 4,
          pointHoverRadius: 6,
          pointBackgroundColor: color,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          fill: false,
          tension: 0.3,
        };
      });

      setChartData({ datasets });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load chart data",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get chart options
  const chartOptions = getChartOptions(dataInterval, selectedParameter, dataParameters);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Historical Climate Data
              </h1>
              <p className="text-slate-500 mt-1">
                Analyze and compare historical climate patterns across different regions
              </p>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <ControlPanel
          selectedParameter={selectedParameter}
          onParameterChange={handleParameterChange}
          dataParameters={dataParameters}
          dataInterval={dataInterval}
          onIntervalChange={setDataInterval}
          intervals={intervals}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          selectedDistricts={selectedDistricts}
          onRemoveDistrict={handleDistrictToggle}
          onAddMoreClick={() => setIsDistrictModalOpen(true)}
          onGenerateChart={fetchChartData}
        />

        {/* Chart Display */}
        <ChartDisplay
          chartData={chartData}
          chartOptions={chartOptions}
          loading={loading}
          selectedParameter={selectedParameter}
          dataParameters={dataParameters}
        />
      </motion.div>

      {/* District Selection Modal */}
      <AnimatePresence>
        {isDistrictModalOpen && (
          <DistrictModal
            isOpen={isDistrictModalOpen}
            onClose={() => setIsDistrictModalOpen(false)}
            availableStations={availableStations}
            selectedDistricts={selectedDistricts}
            onToggleDistrict={handleDistrictToggle}
            onSubmit={handleDistrictModalSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoricalData;
