import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from "recharts";
import * as htmlToImage from "html-to-image";

const CallStatusChart = () => {
  const [data, setData] = useState([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const containerRef = useRef(null);

  // Different shades of blue
  const colors = ["#08d12d", "#f55f0f", "#4081c9"];

  // Demo data
  useEffect(() => {
    const demoData = [
      { name: "Connected", calls: 320, color: colors[0] },
      { name: "Not Connected", calls: 150, color: colors[1] },
      { name: "No Balance", calls: 80, color: colors[2] },
    ];

    setData(demoData);
    const total = demoData.reduce((sum, item) => sum + item.calls, 0);
    setTotalCalls(total);
  }, []);

  const formatNumber = (num) =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const getChartMargins = () => {
    if (isMobile) return { bottom: 15, top: 10, right: 20, left: 5 };
    if (isTablet) return { bottom: 18, top: 15, right: 30, left: 10 };
    return { bottom: 20, top: 20, right: 40, left: 15 };
  };

  const getFontSizes = () => {
    if (isMobile) return { axis: 10, label: 10 };
    if (isTablet) return { axis: 11, label: 11 };
    return { axis: 12, label: 12 };
  };

  // Download chart as PNG
  const handleDownload = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Call_Status_${
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
      className="bg-white rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-gray-100 lg:h-[400px] h-auto flex flex-col"
    >
      {/* Header */}
      <div className="mb-2 sm:mb-3 md:mb-4 flex-shrink-0 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 leading-tight">
            Call Status Analysis
          </h3>
          <p className="text-gray-500 text-xs md:text-sm">
            Distribution of connected, not connected, and no balance calls
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
            className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center p-2 rounded-lg"
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

      {/* Chart */}
      <div className="flex-grow h-48 md:h-64 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={getChartMargins()} layout="vertical">
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: getFontSizes().axis }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: getFontSizes().axis }}
              width={isMobile ? 70 : isTablet ? 90 : 100}
            />
            <Bar
              dataKey="calls"
              // Fully rounded on right side
              radius={[0, 9999, 9999, 0]}
            >
              <LabelList
                dataKey="calls"
                position="right"
                style={{
                  fontSize: `${getFontSizes().label}px`,
                  fill: "#374151",
                  fontWeight: "bold",
                }}
              />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CallStatusChart;
