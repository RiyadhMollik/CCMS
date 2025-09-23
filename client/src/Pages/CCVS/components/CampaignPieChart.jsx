import React, { useState, useEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import * as htmlToImage from "html-to-image";

const CampaignPieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCalls, setTotalCalls] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const containerRef = useRef(null);

  // Track window resize for responsive charts
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Demo data for last 5 campaigns
  const demoData = [
    {
      name: "Rice Quality Survey",
      calls: 420,
      color: "#3b82f6", // blue
    },
    {
      name: "Farmer Feedback",
      calls: 365,
      color: "#10b981", // green
    },
    {
      name: "Crop Advisory",
      calls: 280,
      color: "#f59e0b", // orange
    },
    {
      name: "Weather Alert",
      calls: 195,
      color: "#ef4444", // red
    },
    {
      name: "Market Price Update",
      calls: 140,
      color: "#8b5cf6", // purple
    },
  ];

  // Load demo data
  useEffect(() => {
    const loadDemoData = () => {
      setLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        setData(demoData);
        const total = demoData.reduce((sum, item) => sum + item.calls, 0);
        setTotalCalls(total);
        setLoading(false);
      }, 700);
    };

    loadDemoData();
  }, []);

  const formatNumber = (num) =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
  const isMobile = windowWidth < 640;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalCalls) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-1 text-sm">
            {data.name}
          </h4>
          <div className="space-y-1">
            <p className="text-xs">
              <span className="font-medium">Calls:</span> {data.value.toLocaleString()}
            </p>
            <p className="text-xs">
              <span className="font-medium">Percentage:</span> {percentage}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-1 gap-2 mt-4">
        {payload.map((entry, index) => {
          const percentage = ((entry.payload.calls / totalCalls) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 truncate font-medium">
                  {entry.value}
                </span>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="font-bold text-gray-800">
                  {entry.payload.calls.toLocaleString()}
                </div>
                <div className="text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Download chart card as PNG
  const handleDownload = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Campaign_Calls_Distribution_${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download chart. Please try again.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-gray-100 lg:h-[550px] h-auto flex flex-col"
    >
      {/* Header */}
      <div className="mb-2 sm:mb-3 md:mb-4 flex-shrink-0 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 leading-tight">
            Campaign Call Distribution
          </h3>
          <p className="text-gray-500 text-xs md:text-sm">
            Last 5 campaigns and their total calls
          </p>
        </div>
        <div className="text-right flex-shrink-0 flex items-center gap-2">
          <div>
            <div className="text-base sm:text-lg md:text-xl font-bold text-gray-700 whitespace-nowrap">
              {formatNumber(totalCalls)}
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              Total calls
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center p-2 rounded-lg"
            title="Download chart as image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-grow flex flex-col lg:flex-row gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <div className="text-gray-500 flex items-center space-x-2">
              <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
              <span>Loading chart...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Pie Chart */}
            <div className="flex-1 h-48 md:h-64 lg:h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 60}
                    outerRadius={isMobile ? 80 : 100}
                    paddingAngle={2}
                    dataKey="calls"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex-1 lg:max-w-xs">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Campaign Details
                </h4>
                <CustomLegend payload={data.map(item => ({ 
                  value: item.name, 
                  color: item.color, 
                  payload: item 
                }))} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignPieChart;