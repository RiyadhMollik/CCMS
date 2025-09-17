import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const WeatherChart = ({ stationId, parameter, title, unit, icon }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeRange, setTimeRange] = useState("month");

  const parseDate = (dateString) => {
    if (!dateString) return null;
    try {
      let date;
      if (typeof dateString === "string") {
        date = new Date(dateString);
        if (isNaN(date.getTime())) {
          date = new Date(dateString.replace(" ", "T"));
        }
      } else if (dateString instanceof Date) {
        date = dateString;
      } else {
        return null;
      }
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return null;
      }
      return date.getTime();
    } catch (error) {
      console.warn("Error parsing date:", dateString, error);
      return null;
    }
  };

  const parseValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  // Filter data based on selected time range
  const filterDataByTimeRange = (fullData, range) => {
    if (range === "all" || fullData.length === 0) {
      return fullData;
    }

    const now = new Date();
    let startDate;

    switch (range) {
      case "day":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "3month":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "6month":
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "1year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return fullData;
    }

    return fullData.filter((point) => point[0] >= startDate.getTime());
  };

  // Filter data to show every 8 hours (skip 7 hours each time)
  const filterBy8Hours = (data) => {
    if (data.length === 0) return data;
    
    // Sort data by timestamp to ensure chronological order
    const sortedData = [...data].sort((a, b) => a[0] - b[0]);
    
    // Filter to show data at 8-hour intervals: 00:00, 08:00, 16:00
    const filtered = [];
    const seenIntervals = new Set();
    
    sortedData.forEach(([timestamp, value]) => {
      const date = new Date(timestamp);
      const hour = date.getHours();
      
      // Create a unique key for each 8-hour interval
      // This ensures we only take one reading per 8-hour slot per day
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      // Determine which 8-hour slot this falls into (0-7 = slot 0, 8-15 = slot 1, 16-23 = slot 2)
      const slot = Math.floor(hour / 8);
      const intervalKey = `${dayStart.getTime()}_${slot}`;
      
      // Only include if we haven't seen this interval yet
      if (!seenIntervals.has(intervalKey)) {
        filtered.push([timestamp, value]);
        seenIntervals.add(intervalKey);
      }
    });
    
    console.log(`8-hour filtering: ${data.length} points -> ${filtered.length} points`);
    return filtered;
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    const timeRangeFiltered = filterDataByTimeRange(data, range);
    const hourlyFiltered = filterBy8Hours(timeRangeFiltered);
    setFilteredData(hourlyFiltered);
  };

  // Fetch data for specific station and parameter
  const fetchData = async (stationId, measure) => {
    if (!stationId || !measure) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://iinms.brri.gov.bd/api/research-measures/station/${stationId}/parameter/${encodeURIComponent(
          measure
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const measuresData = await response.json();

      const chartData = measuresData
        .map((item) => {
          const timestamp = parseDate(item.date_value);
          const value = parseValue(item.last_value);

          if (timestamp !== null && value !== null) {
            return [timestamp, value];
          }
          return null;
        })
        .filter((item) => item !== null)
        .sort((a, b) => a[0] - b[0]);

      console.log(`Processed chart data for ${measure}:`, chartData);
      setData(chartData);
      const timeRangeFiltered = filterDataByTimeRange(chartData, timeRange);
      const hourlyFiltered = filterBy8Hours(timeRangeFiltered);
      setFilteredData(hourlyFiltered);

      if (chartData.length === 0) {
        setError("No valid data available for this parameter");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when stationId or parameter changes
  useEffect(() => {
    if (stationId && parameter) {
      fetchData(stationId, parameter);
    }
  }, [stationId, parameter]);

  // Update filtered data when time range changes
  useEffect(() => {
    if (data.length > 0) {
      const timeRangeFiltered = filterDataByTimeRange(data, timeRange);
      const hourlyFiltered = filterBy8Hours(timeRangeFiltered);
      setFilteredData(hourlyFiltered);
    }
  }, [data, timeRange]);

  // Calculate daily averages for recent 5 days
  const getDailyAverages = () => {
    if (data.length === 0) return [];

    // Group data by date
    const dailyGroups = {};
    
    data.forEach(([timestamp, value]) => {
      const date = new Date(timestamp);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!dailyGroups[dateKey]) {
        dailyGroups[dateKey] = [];
      }
      dailyGroups[dateKey].push(value);
    });

    // Calculate daily statistics (average, min, max for temperature; total for rain)
    const isTemperature = parameter === 'Air Temperature';
    const isRainfall = parameter === 'Rain Gauge';
    
    const dailyAverages = Object.entries(dailyGroups)
      .map(([date, values]) => {
        if (isTemperature) {
          const average = values.reduce((sum, val) => sum + val, 0) / values.length;
          const min = Math.min(...values);
          const max = Math.max(...values);
          return {
            date,
            average: parseFloat(average.toFixed(2)),
            min: parseFloat(min.toFixed(2)),
            max: parseFloat(max.toFixed(2)),
            count: values.length
          };
        } else if (isRainfall) {
          // For rainfall, sum all values to get total daily rainfall
          const total = values.reduce((sum, val) => sum + val, 0);
          return {
            date,
            total: parseFloat(total.toFixed(2)),
            count: values.length
          };
        } else {
          // For other parameters, calculate average
          const average = values.reduce((sum, val) => sum + val, 0) / values.length;
          return {
            date,
            average: parseFloat(average.toFixed(2)),
            count: values.length
          };
        }
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending (most recent first)
      .slice(0, 7); // Get recent 7 days

    return dailyAverages;
  };

  // Get color configuration based on parameter type
  const getColorConfig = () => {
    const paramLower = parameter?.toLowerCase() || "";
    
    if (paramLower.includes('temperature') || paramLower.includes('temp')) {
      // Temperature: Yellow to Red gradient
      return {
        lineColor: '#DC2626',
        gradientStops: [
          [0, '#FEF3C7'], [0.3, '#FCD34D'], [0.6, '#F59E0B'], 
          [0.8, '#EA580C'], [1, '#DC2626']
        ],
        hoverLineColor: '#DC2626',
      };
    } else if (paramLower.includes('humidity')) {
      // Humidity: Light blue to teal
      return {
        lineColor: '#0891B2',
        gradientStops: [
          [0, '#E0F7FA'], [0.3, '#80DEEA'], [0.6, '#26C6DA'], 
          [0.8, '#00ACC1'], [1, '#0891B2']
        ],
        hoverLineColor: '#0891B2',
      };
    } else if (paramLower.includes('rain') || paramLower.includes('precipitation')) {
      // Rain: Light gray to dark blue
      return {
        lineColor: '#1E3A8A',
        gradientStops: [
          [0, '#F1F5F9'], [0.3, '#CBD5E1'], [0.6, '#64748B'], 
          [0.8, '#334155'], [1, '#1E3A8A']
        ],
        hoverLineColor: '#1E3A8A',
      };
    } else if (paramLower.includes('wind')) {
      // Wind: Light green to dark green
      return {
        lineColor: '#166534',
        gradientStops: [
          [0, '#F0FDF4'], [0.3, '#BBF7D0'], [0.6, '#4ADE80'], 
          [0.8, '#16A34A'], [1, '#166534']
        ],
        hoverLineColor: '#166534',
      };
    } else if (paramLower.includes('solar') || paramLower.includes('radiation')) {
      // Solar: Light yellow to orange
      return {
        lineColor: '#EA580C',
        gradientStops: [
          [0, '#FFFBEB'], [0.3, '#FED7AA'], [0.6, '#FB923C'], 
          [0.8, '#F97316'], [1, '#EA580C']
        ],
        hoverLineColor: '#EA580C',
      };
    } else if (paramLower.includes('pressure')) {
      // Pressure: Light purple to dark purple
      return {
        lineColor: '#7C3AED',
        gradientStops: [
          [0, '#F5F3FF'], [0.3, '#DDD6FE'], [0.6, '#A78BFA'], 
          [0.8, '#8B5CF6'], [1, '#7C3AED']
        ],
        hoverLineColor: '#7C3AED',
      };
    } else {
      // Default: Blue gradient
      return {
        lineColor: '#1E40AF',
        gradientStops: [
          [0, '#93C5FD'], [0.5, '#3B82F6'], [1, '#1E40AF']
        ],
        hoverLineColor: '#1E40AF',
      };
    }
  };

  // Highcharts configuration
  const getHighchartsOptions = () => {
    if (filteredData.length === 0) return {};

    const chartData = filteredData.map((point) => [point[0], point[1]]);
    const colorConfig = getColorConfig();

    // Calculate dynamic Y-axis range
    const values = chartData.map(point => point[1]);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    const padding = Math.max(range * 0.05, 1);

    return {
      chart: {
        type: "areaspline",
        zooming: { type: "x" },
        backgroundColor: "transparent",
        height: 380,
        animation: { duration: 1000, easing: 'easeOutQuart' },
        style: { fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif' },
      },
      title: {
        text: title,
        align: "left",
        style: { fontSize: "16px", fontWeight: "bold", color: "#374151" },
      },
      subtitle: {
        text: unit ? `Unit: ${unit} • 8-hour intervals` : "8-hour intervals",
        align: "left",
        style: { color: "#6B7280", fontSize: "12px" },
      },
      xAxis: {
        type: "datetime",
        gridLineColor: "rgba(0, 0, 0, 0.1)",
        gridLineDashStyle: "Dash",
        labels: { style: { fontSize: "10px" } },
      },
      yAxis: {
        title: { text: unit || "", style: { fontSize: "12px", fontWeight: "bold" } },
        gridLineColor: "rgba(0, 0, 0, 0.1)",
        gridLineDashStyle: "Dash",
        min: Math.max(0, minValue - padding),
        max: maxValue + padding,
        labels: { style: { fontSize: "10px" } },
      },
      tooltip: {
        crosshairs: true,
        shared: true,
        xDateFormat: "%A, %b %e, %Y %H:%M",
        headerFormat: "<b>{point.key}</b><br/>",
        pointFormat: `<span style="color:{series.color}">${title}</span>: <b>{point.y:.2f}</b> ${unit || ""}<br/>`,
        style: { fontSize: "11px" },
      },
      legend: { enabled: false },
      plotOptions: {
        areaspline: {
          lineWidth: 2,
          fillOpacity: 0.3,
          marker: { enabled: false, states: { hover: { enabled: true, radius: 4 } } },
          connectNulls: true,
          states: { hover: { lineWidth: 3 } }
        },
      },
      series: [{
        name: title,
        data: chartData,
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 },
          stops: colorConfig.gradientStops,
        },
        fillColor: 'transparent',
        lineWidth: 2,
        marker: { enabled: false },
        connectNulls: true,
      }],
      credits: { enabled: false },
    };
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 mx-1 sm:mx-0">
      <div className="card-body p-3 sm:p-4">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">{icon}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">{title}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{unit} • 8-hour intervals</p>
            </div>
          </div>
          {data.length > 0 && (
            <div className="badge badge-primary badge-xs sm:badge-sm flex-shrink-0 ml-2">
              <span className="hidden sm:inline">{data.length} points</span>
              <span className="sm:hidden">{data.length}</span>
            </div>
          )}
        </div>

        {/* Time Range Selection */}
        {data.length > 0 && (
          <div className="mb-2 sm:mb-3">
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
              {[
                { key: "day", label: "1D" },
                { key: "week", label: "1W" },
                { key: "month", label: "1M" },
                { key: "3month", label: "3M" },
                { key: "all", label: "All" },
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => handleTimeRangeChange(range.key)}
                  className={`btn btn-xs sm:btn-sm transition-all duration-200 text-xs sm:text-sm ${
                    timeRange === range.key ? "btn-primary" : "btn-outline btn-primary"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chart Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-3">
            <div className="loading loading-spinner loading-md text-primary"></div>
            <p className="text-sm text-gray-600">Loading {title}...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-3">
            <div className="text-4xl opacity-30">⚠️</div>
            <p className="text-sm text-gray-600 text-center">{error}</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-4">
            {/* Chart Section - Full width on mobile, 60% on desktop */}
            <div className="lg:col-span-7">
              <div className="w-full bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="h-96 w-full">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={getHighchartsOptions()}
                  />
                </div>
              </div>
            </div>
            
            {/* Table Section - Full width on mobile, 40% on desktop */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4 min-h-[16rem] sm:min-h-[20rem] lg:h-96 flex flex-col">
                <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2 flex-shrink-0">
                  📊 <span className="hidden sm:inline">Recent 7 Days</span>
                  <span className="sm:hidden">7 Days</span> 
                  {parameter === 'Air Temperature' ? 'Temperature Range' : 
                   parameter === 'Rain Gauge' ? 'Total Rainfall' : 'Average'}
                </h4>
                <div className="overflow-x-auto flex-1">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-xs sm:text-sm font-semibold text-gray-600 px-2 sm:px-3">Date</th>
                        {parameter === 'Air Temperature' ? (
                          <>
                            <th className="text-xs sm:text-sm font-semibold text-gray-600 px-1 sm:px-2">Min {unit}</th>
                            <th className="text-xs sm:text-sm font-semibold text-gray-600 px-1 sm:px-2">Max {unit}</th>
                            <th className="text-xs sm:text-sm font-semibold text-gray-600 px-1 sm:px-2">Avg {unit}</th>
                          </>
                        ) : (
                          <th className="text-xs sm:text-sm font-semibold text-gray-600 px-2 sm:px-3">
                            {parameter === 'Rain Gauge' ? 'Total' : 'Avg'} {unit}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {getDailyAverages().map((item, index) => (
                        <tr key={item.date} className={index === 0 ? "bg-blue-100" : ""}>
                          <td className="text-xs sm:text-sm text-gray-700 px-2 sm:px-3">
                            <span className="hidden sm:inline">
                              {new Date(item.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: '2-digit'
                              })}
                            </span>
                            <span className="sm:hidden">
                              {new Date(item.date).toLocaleDateString('en-US', {
                                month: 'numeric',
                                day: 'numeric'
                              })}
                            </span>
                          </td>
                          {parameter === 'Air Temperature' ? (
                            <>
                              <td className="text-xs sm:text-sm font-medium text-blue-600 px-1 sm:px-2">
                                {item.min}
                              </td>
                              <td className="text-xs sm:text-sm font-medium text-red-600 px-1 sm:px-2">
                                {item.max}
                              </td>
                              <td className="text-xs sm:text-sm font-medium text-gray-800 px-1 sm:px-2">
                                {item.average}
                              </td>
                            </>
                          ) : parameter === 'Rain Gauge' ? (
                            <td className="text-xs sm:text-sm font-medium text-gray-800 px-2 sm:px-3">
                              {item.total}
                            </td>
                          ) : (
                            <td className="text-xs sm:text-sm font-medium text-gray-800 px-2 sm:px-3">
                              {item.average}
                            </td>
                          )}
                        </tr>
                      ))}
                      {getDailyAverages().length === 0 && (
                        <tr>
                          <td colSpan={parameter === 'Air Temperature' ? "4" : "2"} className="text-center text-xs sm:text-sm text-gray-500 py-4 sm:py-6">
                            No daily data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 space-y-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-4xl opacity-30">{icon}</div>
            <p className="text-sm text-gray-500 text-center">No data available</p>
          </div>
        )}

        {/* Data Stats */}
        {filteredData.length > 0 && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Showing {filteredData.length} of {data.length} data points (8-hour intervals)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherChart;
