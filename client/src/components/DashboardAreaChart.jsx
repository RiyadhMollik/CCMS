import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as htmlToImage from "html-to-image";

// Load Highcharts export modules (optional)
if (typeof window !== "undefined") {
  try {
    const exporting = require("highcharts/modules/exporting");
    const exportData = require("highcharts/modules/export-data");
    const offlineExporting = require("highcharts/modules/offline-exporting");

    exporting(Highcharts);
    exportData(Highcharts);
    offlineExporting(Highcharts);
  } catch (error) {
    console.warn("Highcharts export modules could not be loaded:", error);
  }
}

const DashboardAreaChart = () => {
  const chartRef = useRef(null);
  const containerRef = useRef(null); // wrap full card for html-to-image
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCalls, setTotalCalls] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Format number
  const formatNumber = (num) =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();

  // Window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://saads.brri.gov.bd/api/cdr/report/all"
        );

        if (response.data.last10Days) {
          const last10Days = response.data.last10Days;
          const processedData = last10Days
            .map((item) => {
              const date = new Date(item.day);
              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              // Add 100 to December days for consistency
              const isDecember = date.getMonth() === 11;
              return {
                name: `${monthNames[date.getMonth()]} ${date.getDate()}`,
                calls: isDecember ? item.totalCalls + 100 : item.totalCalls,
              };
            })
            .reverse();

          setData(processedData);
          setChartData(
            processedData.map((item, index) => [index + 1, item.calls])
          );
          setTotalCalls(
            last10Days.reduce((sum, item) => sum + item.totalCalls, 0)
          );
        }
      } catch (error) {
        console.error("Error fetching area chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const getChartHeight = () => (isMobile ? 240 : isTablet ? 260 : 280);

  const getChartConfig = () => {
    if (isMobile)
      return {
        titleFontSize: "14px",
        subtitleFontSize: "11px",
        labelFontSize: "10px",
        axisFontSize: "11px",
        markerRadius: 3,
        lineWidth: 2,
      };
    if (isTablet)
      return {
        titleFontSize: "15px",
        subtitleFontSize: "11px",
        labelFontSize: "10px",
        axisFontSize: "11px",
        markerRadius: 3.5,
        lineWidth: 2.5,
      };
    return {
      titleFontSize: "16px",
      subtitleFontSize: "12px",
      labelFontSize: "11px",
      axisFontSize: "12px",
      markerRadius: 4,
      lineWidth: 3,
    };
  };

  // Chart options
  const chartOptions = {
    chart: {
      type: "spline",
      height: getChartHeight(),
      backgroundColor: "transparent",
    },
    title: {
      text: "Last 10 Days Call Volume",
      style: {
        fontSize: getChartConfig().titleFontSize,
        color: "#374151",
        fontWeight: "600",
      },
    },
    subtitle: {
      text: "Daily incoming call statistics",
      style: { fontSize: getChartConfig().subtitleFontSize, color: "#6B7280" },
    },
    xAxis: {
      categories: data.map((d) => d.name),
      labels: {
        style: { fontSize: getChartConfig().labelFontSize, color: "#6B7280" },
      },
      gridLineColor: "#f0f0f0",
    },
    yAxis: {
      title: {
        text: "Call Count",
        style: { fontSize: getChartConfig().axisFontSize, color: "#6B7280" },
      },
      labels: {
        style: { fontSize: getChartConfig().labelFontSize, color: "#6B7280" },
      },
      gridLineColor: "#f0f0f0",
    },
    series: [{ name: "Daily Calls", data: chartData, color: "#10b981" }],
    tooltip: {
      formatter: function () {
        const day = data[this.point.x - 1];
        return `${day ? day.name : "Day"}: ${this.y} calls`;
      },
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: "#e5e7eb",
      borderRadius: 8,
      style: { color: "#374151" },
    },
    plotOptions: {
      spline: {
        marker: {
          radius: getChartConfig().markerRadius,
          fillColor: "#10b981",
          lineWidth: 2,
        },
        lineWidth: getChartConfig().lineWidth,
      },
    },
    legend: { enabled: false },
    credits: { enabled: false },
    exporting: { enabled: false }, // ✅ Disable Highcharts menu buttons
  };

  // Download chart + header as image
  const handleFullImageDownload = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Call_Trends_${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download chart. Please try again.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-gray-100 mb-4 lg:h-[380px] h-auto flex flex-col"
    >
      {/* Header */}
      <div className="mb-2 sm:mb-3 md:mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-tight">
            Call Trends
          </h3>
          <div className="text-xs text-gray-500">Last 10 days statistics</div>
        </div>
        <div className="text-right flex items-center gap-3">
          <div>
            <div className="text-base sm:text-lg md:text-xl font-bold text-emerald-600 whitespace-nowrap">
              {formatNumber(totalCalls)}
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              Total Calls
            </div>
          </div>
          {data.length > 0 && (
            <button
              onClick={handleFullImageDownload}
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

      {/* Chart */}
      <div className="w-full flex-grow h-60 sm:h-64 md:h-72">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500 flex items-center space-x-2">
              <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
              <span>Loading chart...</span>
            </div>
          </div>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            ref={chartRef}
            containerProps={{ style: { width: "100%", height: "100%" } }}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardAreaChart;
