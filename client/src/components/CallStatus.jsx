import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, PieChart, ResponsiveContainer, Sector, Cell } from "recharts";

const CallStatus = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCalls, setTotalCalls] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Track window resize for responsive charts
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://iinms.brri.gov.bd/api/cdr/report/all"
        );

        if (response.data) {
          const { totalAnswer, totalBusy, totalNoAnswer } = response.data;

          const chartData = [
            {
              name: "Calls Received",
              value: totalAnswer || 0,
              color: "#10b981",
            },
            {
              name: "Not Received",
              value: totalNoAnswer || 0,
              color: "#f59e0b",
            },
            { name: "Busy/Failed", value: totalBusy || 0, color: "#ef4444" },
          ];

          setData(chartData);
          setTotalCalls(totalAnswer + totalBusy + totalNoAnswer);
        }
      } catch (error) {
        console.error("Error fetching call status data:", error);
        // Keep default empty data on error
        setData([
          { name: "Calls Received", value: 0, color: "#10b981" },
          { name: "Not Received", value: 0, color: "#f59e0b" },
          { name: "Busy/Failed", value: 0, color: "#ef4444" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format number with K suffix
  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Get responsive values based on current window width
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const getChartDimensions = () => {
    if (isMobile) {
      return { innerRadius: 50, outerRadius: 90 };
    }
    if (isTablet) {
      return { innerRadius: 70, outerRadius: 120 };
    }
    return { innerRadius: 100, outerRadius: 180 };
  };

  const getTextSizes = () => {
    if (isMobile) {
      return { titleSize: 14, valueSize: 12, percentSize: 11 };
    }
    if (isTablet) {
      return { titleSize: 16, valueSize: 14, percentSize: 13 };
    }
    return { titleSize: 18, valueSize: 15, percentSize: 15 };
  };

  const renderActiveShape = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  }) => {
    const textSizes = getTextSizes();
    const yOffset = isMobile ? 3 : 5;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={-yOffset}
          textAnchor="middle"
          fill={fill}
          fontSize={textSizes.titleSize}
          fontWeight="600"
        >
          {isMobile ? payload.name.split(" ")[0] : payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={yOffset + 10}
          textAnchor="middle"
          fill="#666"
          fontSize={textSizes.valueSize}
        >
          {isMobile ? formatNumber(value) : `${value} calls`}
        </text>
        <text
          x={cx}
          y={cy}
          dy={yOffset + 25}
          textAnchor="middle"
          fill="#999"
          fontSize={textSizes.percentSize}
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          cornerRadius={isMobile ? 6 : 10}
        />
      </g>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(0);
  };

  return (
    <div className="bg-white rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-gray-100 lg:h-[550px] h-auto flex flex-col">
      {/* Header */}
      <div className="mb-2 sm:mb-3 md:mb-4 flex-shrink-0">
        <div className="flex justify-between items-start space-x-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 leading-tight">
              Call Status Overview
            </h3>
            <p className="text-gray-500 text-xs md:text-sm">
              Distribution of call statuses today
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-base sm:text-lg md:text-xl font-bold text-gray-700 whitespace-nowrap">
              {formatNumber(totalCalls)}
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              Total calls
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-grow h-48 sm:h-64 md:h-80 lg:h-96">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500 flex items-center space-x-2">
              <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
              <span>Loading chart...</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={getChartDimensions().innerRadius}
                outerRadius={getChartDimensions().outerRadius}
                paddingAngle={isMobile ? 3 : 5}
                cornerRadius={isMobile ? 6 : 12}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div
        className={`flex justify-center gap-6 mt-2 sm:mt-3 md:mt-4 flex-shrink-0`}
      >
        <div className="flex items-center justify-center">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 flex-shrink-0"></div>
          <span className="text-xs sm:text-sm text-gray-600">Received</span>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2 flex-shrink-0"></div>
          <span className="text-xs sm:text-sm text-gray-600">Not Received</span>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2 flex-shrink-0"></div>
          <span className="text-xs sm:text-sm text-gray-600">Busy/Failed</span>
        </div>
      </div>
    </div>
  );
};
export default CallStatus;
