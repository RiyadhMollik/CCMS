import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

const WeeklyChart = () => {
  const data = [
    { week: "Week 1", callVolume: 1240, expenses: 150, avgCallDuration: 2.8 },
    { week: "Week 2", callVolume: 1580, expenses: 330, avgCallDuration: 3.2 },
    {
      week: "Week 3",
      callVolume: 1320,
      expenses: 150,
      avgCallDuration: 2.9,
    },
    { week: "Week 4", callVolume: 1250, expenses: 180, avgCallDuration: 3.5 },
    { week: "Week 5", callVolume: 1450, expenses: 290, avgCallDuration: 3.1 },
    { week: "Week 6", callVolume: 1680, expenses: 370, avgCallDuration: 3.4 },
    { week: "Week 7", callVolume: 1250, expenses: 190, avgCallDuration: 2.7 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">{label}</h4>
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm mb-1"
            >
              <div className="flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.dataKey === "callVolume" ? "Call Volume" : "Expenses"}
              </div>
              <span className="font-bold text-gray-800">
                {entry.dataKey === "callVolume"
                  ? entry.value.toLocaleString()
                  : `$${entry.value.toFixed(2)}`}
              </span>
            </div>
          ))}
          <div className="text-xs text-gray-500 border-t pt-2 mt-2">
            Avg Duration: {payload[0]?.payload?.avgCallDuration} min
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div className="flex justify-center mt-4 space-x-6">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">
            {entry.dataKey === "callVolume" ? "Call Volume" : "Expenses ($)"}
          </span>
        </div>
      ))}
    </div>
  );

  // Calculate totals for summary
  const totalCallVolume = data.reduce((sum, item) => sum + item.callVolume, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const avgDuration =
    data.reduce((sum, item) => sum + item.avgCallDuration, 0) / data.length;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Weekly Call Volume & Expenses
        </h3>
        <p className="text-gray-600 text-sm">
          Track weekly performance and costs
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fontSize: 12, fill: "#3B82F6" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: "#EF4444" }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />

          {/* Blue Line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="callVolume"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: "#3B82F6", r: 5 }}
            activeDot={{ r: 7, stroke: "#3B82F6", strokeWidth: 2 }}
          />

          {/* Red Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="expenses"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ fill: "#EF4444", r: 5 }}
            activeDot={{ r: 7, stroke: "#EF4444", strokeWidth: 2 }}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg border border-blue-100 bg-blue-50">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 rounded-full mr-2 bg-blue-500" />
            <span className="text-xs font-medium text-gray-600">
              Total Calls
            </span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            {totalCallVolume.toLocaleString()}
          </div>
        </div>

        <div className="text-center p-3 rounded-lg border border-red-100 bg-red-50">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 rounded-full mr-2 bg-red-500" />
            <span className="text-xs font-medium text-gray-600">
              Total Expenses
            </span>
          </div>
          <div className="text-lg font-bold text-red-600">
            ${totalExpenses.toFixed(0)}
          </div>
        </div>

        <div className="text-center p-3 rounded-lg border border-green-100 bg-green-50">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 rounded-full mr-2 bg-green-500" />
            <span className="text-xs font-medium text-gray-600">
              Avg Duration
            </span>
          </div>
          <div className="text-lg font-bold text-green-600">
            {avgDuration.toFixed(1)} min
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;
