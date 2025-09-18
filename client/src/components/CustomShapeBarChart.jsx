import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import * as htmlToImage from "html-to-image";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8B5CF6", "#EC4899", "#F59E0B"];

const data = [
  { name: "Barisal", calls: 680, population: 1200000 },
  { name: "Dhaka", calls: 200, population: 9000000 },
  { name: "Rajshahi", calls: 400, population: 2700000 },
  { name: "Rangpur", calls: 420, population: 1500000 },
  { name: "Sylhet", calls: 800, population: 3500000 },
  { name: "Chittagong", calls: 100, population: 5200000 },
  { name: "Khulna", calls: 950, population: 1600000 },
];

const getPath = (x, y, width, height) => `
  M${x},${y + height} 
  C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2},${y} 
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width},${y + height} 
  Z
`;

const TriangleBar = ({ fill, x, y, width, height }) => <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;

const CustomShapeBarChart = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const containerRef = useRef(null);

  // Track window resize for responsive charts
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobile = windowWidth < 640;

  // Download the full chart card as image
  const handleDownload = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, { cacheBust: true, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `Regional_Call_Distribution_${new Date().toISOString().split("T")[0]}.png`;
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
      className="bg-white rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-gray-100 lg:h-[380px] h-auto flex flex-col"
    >
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
          <div className="text-right flex-shrink-0 flex items-center gap-3">
            <div>
              <div className="text-base sm:text-lg md:text-xl font-bold text-emerald-600 whitespace-nowrap">1.2K</div>
              <div className="text-xs text-gray-500 whitespace-nowrap">Total calls</div>
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
            <YAxis fontSize={isMobile ? 9 : 12} width={isMobile ? 30 : 40} />
            <Bar
              dataKey="calls"
              shape={<TriangleBar />}
              label={{ position: "top", fontSize: isMobile ? 9 : 12 }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomShapeBarChart;
