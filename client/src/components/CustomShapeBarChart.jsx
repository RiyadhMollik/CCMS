import React from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8B5CF6", "#EC4899", "#F59E0B"];

const data = [
  { name: "Barisal", calls: 2680, population: 1200000 },
  { name: "Dhaka", calls: 4200, population: 9000000 },
  { name: "Rajshahi", calls: 3400, population: 2700000 },
  { name: "Rangpur", calls: 2420, population: 1500000 },
  { name: "Sylhet", calls: 2800, population: 3500000 },
  { name: "Chittagong", calls: 3100, population: 5200000 },
  { name: "Khulna", calls: 4950, population: 1600000 },
];

const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

import { ResponsiveContainer } from "recharts";

const CustomShapeBarChart = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:h-[380px] h-auto flex flex-col">
      {/* Chart Header */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Top Locations by Call Volume
            </h3>
            <p className="text-gray-500 text-sm">
              Distribution of incoming calls by location
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-emerald-600">17.6K</div>
            <div className="text-xs text-gray-500">Total calls</div>
          </div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="w-full flex-grow flex items-center justify-center" style={{ minHeight: "280px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar
              dataKey="calls"
              fill="#8884d8"
              shape={<TriangleBar />}
              label={{ position: "top" }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomShapeBarChart;
