import React, { useState, useEffect } from "react";
import WeatherChart from "../../components/WeatherChart";

const AWS = () => {
  const [location, setLocation] = useState("");
  const [stations, setStations] = useState([]);

  // Weather parameters configuration
  const weatherParameters = [
    {
      parameter: "Air Temperature",
      title: "Air Temperature",
      unit: "°C",
      icon: "🌡️",
    },
    {
      parameter: "Rain Gauge",
      title: "Rain Gauge", 
      unit: "mm",
      icon: "🌧️",
    },
    {
      parameter: "Air Humidity",
      title: "Air Humidity",
      unit: "%",
      icon: "💧",
    },
    {
      parameter: "Wind Speed Gust",
      title: "Wind Speed Gust",
      unit: "m/s",
      icon: "💨",
    },
    {
      parameter: "Wind Direction Gust", 
      title: "Wind Direction Gust",
      unit: "°",
      icon: "🧭",
    },
    {
      parameter: "Solar Radiation",
      title: "Solar Radiation",
      unit: "W/m²",
      icon: "☀️",
    },
    {
      parameter: "Sunshine Duration",
      title: "Sunshine Duration", 
      unit: "hours",
      icon: "🌞",
    },
  ];

  // Fetch stations from API
  const fetchStations = async () => {
    try {
      const response = await fetch(
        "https://iinms.brri.gov.bd/api/research-measures/stations"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stations");
      }
      const stationsData = await response.json();
      setStations(stationsData);
      
      // Set default station to "DAE-BRRI Gazipur" if available, otherwise first station
      if (stationsData.length > 0 && !location) {
        const gazipurStation = stationsData.find(station => 
          station.station_name?.toLowerCase().includes('gazipur') ||
          station.station_name?.toLowerCase().includes('dae-brri gazipur')
        );
        
        if (gazipurStation) {
          setLocation(gazipurStation.station_id);
        } else {
          setLocation(stationsData[0].station_id);
        }
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-2 leading-tight">
            🌤️ Agromet Weather Station (AgWS)
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base lg:text-lg px-2 sm:px-0">
            Climate Monitoring by{" "}
            <span className="font-semibold text-primary">
              Bangladesh Meteorological Department
            </span>{" "}
            &{" "}
            <span className="font-semibold text-secondary">
              Department of Agricultural Extension
            </span>
          </p>
          <div className="flex justify-center mt-2 sm:mt-3">
            <div className="badge badge-outline badge-sm sm:badge-md lg:badge-lg">
              Real-time Weather Data Analysis
            </div>
          </div>
        </div>

        {/* Compact Station Selection Bar */}
        <div className="card bg-gradient-to-r from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 mx-1 sm:mx-0">
          <div className="card-body p-3 sm:p-4 lg:p-5">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Station Info - Always stacked on mobile */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-focus rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white text-sm sm:text-lg">🏢</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">Weather Station</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{stations.length} monitoring sites available</p>
                </div>
              </div>
              
              {/* Selection Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="select select-bordered select-sm sm:select-md w-full bg-white border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm"
                  >
                    <option value="">🔍 Choose weather station...</option>
                    {stations.map((station) => (
                      <option
                        key={station.station_id}
                        value={station.station_id}
                      >
                        {station.station_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Charts Grid */}
        {location && (
          <div className="space-y-4 sm:space-y-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {weatherParameters.map((param, index) => (
                <WeatherChart
                  key={`${location}-${param.parameter}`}
                  stationId={location}
                  parameter={param.parameter}
                  title={param.title}
                  unit={param.unit}
                  icon={param.icon}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!location && (
          <div className="card bg-base-100 shadow-xl mx-1 sm:mx-0">
            <div className="card-body p-6 sm:p-8 lg:p-12">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                <div className="text-4xl sm:text-6xl lg:text-8xl opacity-30">🌤️</div>
                <div className="text-center max-w-sm sm:max-w-md px-2">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-content/70 mb-2 sm:mb-3">
                    Select a Weather Station
                  </h3>
                  <p className="text-sm sm:text-base text-base-content/50 leading-relaxed">
                    Choose a weather station from the dropdown above to view comprehensive climate data across 7 different parameters including temperature, humidity, rainfall, wind, and solar radiation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-4 sm:mt-6 py-3 sm:py-4 text-center px-2">
          <p className="text-xs sm:text-sm text-base-content/60 leading-relaxed">
            🕒 Last updated:{" "}
            <span className="hidden sm:inline">
              {new Date().toLocaleString("en-BD", {
                timeZone: "Asia/Dhaka",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              BD Time
            </span>
            <span className="sm:hidden">
              {new Date().toLocaleString("en-BD", {
                timeZone: "Asia/Dhaka",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              BD
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AWS;
