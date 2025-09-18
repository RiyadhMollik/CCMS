import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as htmlToImage from "html-to-image";

const DashboardGauges = () => {
  const [destinationData, setDestinationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modulesLoaded, setModulesLoaded] = useState(false);
  const [totalCalls, setTotalCalls] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const chartRef = useRef(null);
  const containerRef = useRef(null); // ✅ wrap chart + legend for html-to-image

  // Load Highcharts modules dynamically
  useEffect(() => {
    const loadModules = async () => {
      try {
        const [
          HighchartsMore,
          SolidGauge,
          Exporting,
          ExportData,
          OfflineExporting,
        ] = await Promise.all([
          import("highcharts/highcharts-more"),
          import("highcharts/modules/solid-gauge"),
          import("highcharts/modules/exporting"),
          import("highcharts/modules/export-data"),
          import("highcharts/modules/offline-exporting"),
        ]);

        HighchartsMore.default
          ? HighchartsMore.default(Highcharts)
          : HighchartsMore(Highcharts);
        SolidGauge.default
          ? SolidGauge.default(Highcharts)
          : SolidGauge(Highcharts);
        Exporting.default
          ? Exporting.default(Highcharts)
          : Exporting(Highcharts);
        ExportData.default
          ? ExportData.default(Highcharts)
          : ExportData(Highcharts);
        OfflineExporting.default
          ? OfflineExporting.default(Highcharts)
          : OfflineExporting(Highcharts);

        setModulesLoaded(true);
      } catch (error) {
        console.warn("Highcharts module load error:", error);
        setModulesLoaded(true);
      }
    };
    loadModules();
  }, []);

  // Fetch API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://iinms.brri.gov.bd/api/cdr/report/all"
        );

        if (response.data.destinationStats) {
          const destinations = response.data.destinationStats.filter(
            (d) => d.destination !== "104"
          );
          setDestinationData(destinations);

          const total = destinations.reduce(
            (sum, item) => sum + item.totalCalls,
            0
          );
          setTotalCalls(total);
        }
      } catch (err) {
        console.error("Error fetching destination data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Colors
  const colors = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  // Gauge data
  const gaugeData = destinationData
    .slice(0, 6)
    .map((dest, index) => ({
      name: dest.destinationState,
      totalCalls: dest.totalCalls,
      percentage: totalCalls
        ? Math.round((dest.totalCalls / totalCalls) * 100)
        : 0,
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .map((d, i) => ({
      ...d,
      color: colors[i % colors.length],
      radius: `${99 - i * 13}%`,
      innerRadius: `${87 - i * 13}%`,
    }));

  // Chart options
  const multiKPIGaugeConfig = {
    chart: {
      type: "solidgauge",
      height: windowWidth >= 1024 ? 450 : windowWidth >= 768 ? 400 : 256,
      backgroundColor: "#ffffff",
      plotBackgroundColor: "#ffffff",
      style: { backgroundColor: "#ffffff" },
    },
    title: { text: "" },
    credits: { enabled: false },
    exporting: { enabled: false },
    yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
    pane: {
      startAngle: 0,
      endAngle: 320,
      center: windowWidth < 640 ? ["50%", "55%"] : ["50%", "50%"],
      size: windowWidth < 640 ? "85%" : "90%",
      background: gaugeData.map((g) => ({
        outerRadius: g.radius,
        innerRadius: g.innerRadius,
        backgroundColor: `${g.color}20`,
        borderWidth: 0,
      })),
    },
    plotOptions: {
      solidgauge: { dataLabels: { enabled: false }, rounded: true },
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "#ffffff",
      borderColor: "#ddd",
      style: { color: "#374151" },
      pointFormat: `<div style="text-align:center;"><b>{series.name}</b><br/>{point.totalCalls} calls ({point.y}%)</div>`,
    },
    series: gaugeData.map((g) => ({
      name: g.name,
      data: [
        {
          color: g.color,
          radius: g.radius,
          innerRadius: g.innerRadius,
          y: g.percentage,
          totalCalls: g.totalCalls,
        },
      ],
    })),
  };

  // Download chart + legend as image
  const handleFullImageDownload = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Destination_Stats_${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download chart. Please try again.");
    }
  };

  if (loading || !modulesLoaded) {
    return (
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6 lg:h-[776px] h-auto">
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="text-gray-500 flex items-center space-x-2">
            <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
            <span>
              {loading ? "Loading data..." : "Loading chart modules..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6 flex flex-col"
    >
      {/* Header */}
      <div className="mb-3 md:mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1">
            Call Distribution by Division
          </h3>
          <p className="text-gray-500 text-xs md:text-sm">
            Real-time call volume distribution across divisions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-base md:text-xl font-bold text-gray-700">
              {totalCalls.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Total calls</div>
          </div>
          {destinationData.length > 0 && (
            <button
              onClick={handleFullImageDownload}
              className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 p-2 rounded-lg"
              title="Download chart image"
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
      <div className="flex-grow flex flex-col justify-center">
        <div className="w-full h-48 sm:h-64 md:h-[400px] lg:h-[450px] max-w-[600px] mx-auto bg-white rounded-xl">
          <HighchartsReact
            highcharts={Highcharts}
            options={multiKPIGaugeConfig}
            ref={chartRef}
          />
        </div>

        {/* Legend BELOW chart */}
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 mt-4 max-w-[600px] mx-auto">
          {gaugeData.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-center space-x-2 md:hidden">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span
                  className="text-xs font-medium truncate"
                  style={{ color: item.color }}
                >
                  {item.name.split(" ")[0]}
                </span>
              </div>

              <div
                className="hidden md:block text-center p-3 rounded-lg border"
                style={{
                  backgroundColor: `${item.color}10`,
                  borderColor: `${item.color}30`,
                }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: item.color }}
                  >
                    {item.name.split(" ")[0]}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {item.totalCalls} calls ({item.percentage}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardGauges;
