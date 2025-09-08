import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, PieChart, ResponsiveContainer, Sector, Cell } from "recharts";

const CallStatus = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCalls, setTotalCalls] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://iinms.brri.gov.bd/api/cdr/report/all');
        
        if (response.data) {
          const { totalAnswer, totalBusy, totalNoAnswer } = response.data;
          
          const chartData = [
            { name: "Calls Received", value: totalAnswer || 0, color: "#10b981" },
            { name: "Not Received", value: totalNoAnswer || 0, color: "#f59e0b" },
            { name: "Busy/Failed", value: totalBusy || 0, color: "#ef4444" },
          ];
          
          setData(chartData);
          setTotalCalls(totalAnswer + totalBusy + totalNoAnswer);
        }
      } catch (error) {
        console.error('Error fetching call status data:', error);
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
    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={-5}
          textAnchor="middle"
          fill={fill}
          fontSize="18"
          fontWeight="600"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={15}
          textAnchor="middle"
          fill="#666"
          fontSize="15"
        >
          {`${value} calls`}
        </text>
        <text
          x={cx}
          y={cy}
          dy={35}
          textAnchor="middle"
          fill="#999"
          fontSize="15"
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
          cornerRadius={10}
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:h-[550px] h-auto flex flex-col">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Call Status Overview
            </h3>
            <p className="text-gray-500 text-sm">
              Distribution of call statuses today
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-700">{formatNumber(totalCalls)}</div>
            <div className="text-xs text-gray-500">Total calls</div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-grow" style={{ minHeight: "350px" }}>
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
                innerRadius={100}
                outerRadius={180}
                paddingAngle={5}
                cornerRadius={12}
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
      <div className="flex justify-center gap-6 mt-4 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Received</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Not Received</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Busy/Failed</span>
        </div>
      </div>
    </div>
  );
};
export default CallStatus;
