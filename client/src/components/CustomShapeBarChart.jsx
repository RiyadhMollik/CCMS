import React, { useState, useEffect } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

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

const CustomShapeBarChart = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Track window resize for responsive charts
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobile = windowWidth < 640;
  return (
    <div className="bg-white rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-gray-100 lg:h-[380px] h-auto flex flex-col">
      {/* Chart Header */}
      <div className="mb-2 sm:mb-3 md:mb-4 flex-shrink-0">
        <div className="flex justify-between items-start space-x-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-tight">
              Top Locations by Call Volume
            </h3>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              Distribution of incoming calls by location
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-base sm:text-lg md:text-xl font-bold text-emerald-600 whitespace-nowrap">17.6K</div>
            <div className="text-xs text-gray-500 whitespace-nowrap">Total calls</div>
          </div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="w-full flex-grow flex items-center justify-center h-56 sm:h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ 
              top: isMobile ? 10 : 20, 
              right: isMobile ? 5 : 30, 
              left: isMobile ? 5 : 20, 
              bottom: 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={isMobile ? 9 : 12}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 50 : 30}
              interval={0}
            />
            <YAxis 
              fontSize={isMobile ? 9 : 12}
              width={isMobile ? 30 : 40}
            />
            <Bar
              dataKey="calls"
              fill="#8884d8"
              shape={<TriangleBar />}
              label={{ position: "top", fontSize: isMobile ? 9 : 12 }}
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
