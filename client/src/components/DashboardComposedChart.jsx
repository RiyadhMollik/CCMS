import React from "react";
import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DashboardComposedChart = () => {
  const data = [
    { name: "Jan", satisfaction: 95 },
    { name: "Feb", satisfaction: 89 },
    { name: "Mar", satisfaction: 92 },
    { name: "Apr", satisfaction: 88 },
    { name: "May", satisfaction: 94 },
    { name: "Jun", satisfaction: 87 },
    { name: "Jul", satisfaction: 96 },
    { name: "Aug", satisfaction: 91 },
    { name: "Sep", satisfaction: 89 },
    { name: "Oct", satisfaction: 93 },
    { name: "Nov", satisfaction: 88 },
    { name: "Dec", satisfaction: 95 },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg border-l-4 border-l-emerald-500">
          <p className="font-semibold text-gray-800 mb-2">{`Month: ${label}`}</p>
          <div className="space-y-1">
            <p className="text-sm font-medium text-emerald-600">
              {`Satisfaction: ${payload[0]?.value}%`}
            </p>
          </div>
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
            Customer Satisfaction
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">91.2%</div>
            <div className="text-xs text-gray-500">Average Score</div>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Monthly customer satisfaction trends with bar and line visualization
        </p>
      </div>

      {/* Chart Container */}
      <div className="w-full" style={{ height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
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
              domain={[80, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Gradient definitions */}
            <defs>
              <linearGradient
                id="satisfactionGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* Bar chart for satisfaction */}
            <Bar
              dataKey="satisfaction"
              fill="#a7f3d0"
              name="Satisfaction %"
              opacity={0.9}
              radius={[25, 25, 25, 25]}
              maxBarSize={80}
            />

            {/* Line chart for satisfaction */}
            <Line
              type="monotone"
              dataKey="satisfaction"
              stroke="#059669"
              strokeWidth={3}
              dot={{ fill: "#059669", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: "#059669", strokeWidth: 2 }}
              name="Satisfaction Trend"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardComposedChart;
