import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  CartesianGrid,
  Tooltip,
} from "recharts";
import * as htmlToImage from "html-to-image";

const WeeklyCampaignsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const containerRef = useRef(null);

  const demoData = [
    { name: "Week 1", campaigns: 8, color: "#3b82f6" },
    { name: "Week 2", campaigns: 12, color: "#8b5cf6" },
    { name: "Week 3", campaigns: 6, color: "#10b981" },
    { name: "Week 4", campaigns: 15, color: "#f59e0b" },
    { name: "Week 5", campaigns: 9, color: "#ef4444" },
    { name: "Week 6", campaigns: 11, color: "#06b6d4" },
    { name: "Week 7", campaigns: 7, color: "#84cc16" },
  ];

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setData(demoData);
        const total = demoData.reduce((sum, item) => sum + item.campaigns, 0);
        setTotalCampaigns(total);
        setLoading(false);
      }, 600);
    };
    loadData();
  }, []);

  const formatNumber = (num) =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();

  const handleDownload = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Weekly_Campaigns_${new Date()
        .toISOString()
        .split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download chart. Please try again.");
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md border-l-4 border-l-emerald-500">
          <p className="font-semibold text-gray-800 mb-1">{`Week: ${label}`}</p>
          <p className="text-sm font-medium text-emerald-600">
            {`Campaigns: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col"
      style={{ minHeight: "400px" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Weekly Campaigns
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Number of campaigns per week
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xl md:text-2xl font-bold text-emerald-600">
              {formatNumber(totalCampaigns)}
            </div>
            <div className="text-xs text-gray-500">Total campaigns</div>
          </div>
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 p-2 rounded-lg flex items-center justify-center"
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
      <div className="flex-grow h-56 md:h-72">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500 flex items-center space-x-2">
              <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
              <span>Loading chart...</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="campaigns" radius={[6, 6, 0, 0]} maxBarSize={50}>
                <LabelList
                  dataKey="campaigns"
                  position="top"
                  style={{ fontSize: 12, fill: "#374151", fontWeight: "bold" }}
                />
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default WeeklyCampaignsChart;
