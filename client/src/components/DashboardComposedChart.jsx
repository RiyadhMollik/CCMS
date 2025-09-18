import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import * as htmlToImage from "html-to-image";

const DashboardComposedChart = () => {
  const [data, setData] = useState([
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
  ]);
  const [loading, setLoading] = useState(true);
  const [totalCalls, setTotalCalls] = useState(0);

  // Unique ID for chart
  const chartId = `dashboard-composed-chart-${Date.now()}`;

  // Handle image download
  const handleDirectImageDownload = async () => {
    const filename = `Monthly_Call_Volume_${new Date()
      .toISOString()
      .split("T")[0]}`;
    const chartElement = document.getElementById(chartId);

    if (!chartElement) {
      alert("Chart not found");
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(chartElement, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = filename + ".png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error exporting chart:", error);
      alert("Failed to download image: " + error.message);
    }
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://iinms.brri.gov.bd/api/cdr/report/all"
        );

        if (response.data.last12Months) {
          const monthNames = {
            "01": "Jan",
            "02": "Feb",
            "03": "Mar",
            "04": "Apr",
            "05": "May",
            "06": "Jun",
            "07": "Jul",
            "08": "Aug",
            "09": "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec",
          };

          const processedData = response.data.last12Months
            .map((item) => {
              const monthNum = item.month.split("-")[1];
              const year = item.month.split("-")[0].slice(-2);
              const monthName = monthNames[monthNum] || item.month;

              return {
                name: `${monthName} ${year}`,
                satisfaction: item.totalCalls,
                month: item.month,
              };
            })
            .reverse();

          setData(processedData);

          const total = processedData.reduce(
            (sum, item) => sum + item.satisfaction,
            0
          );
          setTotalCalls(total);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format number with K suffix
  const formatNumber = (num) =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg border-l-4 border-l-emerald-500">
          <p className="font-semibold text-gray-800 mb-2">{`Month: ${label}`}</p>
          <p className="text-sm font-medium text-emerald-600">
            {`Total Calls: ${payload[0]?.value?.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-start space-x-3 mb-4 md:mb-6">
            <div className="flex-1 min-w-0">
              <div className="h-5 md:h-6 bg-gray-200 rounded w-40 md:w-48 mb-2"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded w-48 md:w-64"></div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="h-6 md:h-8 bg-gray-200 rounded w-12 md:w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16 md:w-20"></div>
            </div>
          </div>
          <div className="w-full h-60 md:h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6"
      id={chartId}
    >
      {/* Chart Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between items-start space-x-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 leading-tight">
              Monthly Call Volume
            </h3>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              Last 12 months call volume trends with bar and line visualization
            </p>
          </div>
          <div className="text-right flex-shrink-0 flex items-center gap-3">
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600 whitespace-nowrap">
                {formatNumber(totalCalls)}
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">
                Total Calls
              </div>
            </div>
            {data.length > 0 && (
              <button
                onClick={handleDirectImageDownload}
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
            )}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full" style={{ height: "280px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 15, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 10 }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={12} />
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
            <Bar
              dataKey="satisfaction"
              fill="#a7f3d0"
              name="Call Volume"
              opacity={0.9}
              radius={[15, 15, 15, 15]}
              maxBarSize={60}
            />
            <Line
              type="monotone"
              dataKey="satisfaction"
              stroke="#059669"
              strokeWidth={2}
              dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#059669", strokeWidth: 2 }}
              name="Call Trend"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardComposedChart;
