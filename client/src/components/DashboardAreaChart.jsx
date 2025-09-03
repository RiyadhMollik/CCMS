import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DashboardAreaChart = () => {
  const data = [
    { name: "Jan", calls: 4200 },
    { name: "Feb", calls: 3800 },
    { name: "Mar", calls: 4300 },
    { name: "Apr", calls: 3800 },
    { name: "May", calls: 3200 },
    { name: "Jun", calls: 2200 },
    { name: "Jul", calls: 5500 },
    { name: "Aug", calls: 6000 },
    { name: "Sep", calls: 4200 },
    { name: "Oct", calls: 3800 },
    { name: "Nov", calls: 3600 },
    { name: "Dec", calls: 2200 },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg border-l-4 border-l-emerald-500">
          <p className="font-semibold text-gray-800 mb-2">{`Month: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-emerald-700 font-medium">
              {`Total Calls: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      {/* Chart Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Total Calls Overview
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">53.2K</div>
            <div className="text-xs text-gray-500">Total Annual Calls</div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full" style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Single area curve with improved web colors */}
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#059669"
              fill="url(#colorGradient)"
              strokeWidth={2.5}
              name="Total Calls"
            />

            {/* Gradient definition for better visual appeal */}
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardAreaChart;
