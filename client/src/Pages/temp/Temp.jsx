import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const DashboardGauges = () => {
  const [destinationData, setDestinationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modulesLoaded, setModulesLoaded] = useState(false);
  const [totalCalls, setTotalCalls] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const chartRef = useRef(null);

  // Create unique ID for chart instance
  const chartId = `dashboard-gauges-${Date.now()}`;

  // Load Highcharts modules dynamically
  useEffect(() => {
    const loadModules = async () => {
      try {
        // Dynamic imports to ensure proper loading
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

        // Initialize modules with proper handling of default exports
        if (HighchartsMore.default) {
          HighchartsMore.default(Highcharts);
        } else {
          HighchartsMore(Highcharts);
        }

        if (SolidGauge.default) {
          SolidGauge.default(Highcharts);
        } else {
          SolidGauge(Highcharts);
        }

        if (Exporting.default) {
          Exporting.default(Highcharts);
        } else {
          Exporting(Highcharts);
        }

        if (ExportData.default) {
          ExportData.default(Highcharts);
        } else {
          ExportData(Highcharts);
        }

        if (OfflineExporting.default) {
          OfflineExporting.default(Highcharts);
        } else {
          OfflineExporting(Highcharts);
        }

        setModulesLoaded(true);
        console.log("Highcharts modules loaded successfully");
      } catch (error) {
        console.warn("Could not load some Highcharts modules:", error);
        setModulesLoaded(true); // Continue anyway
      }
    };

    loadModules();
  }, []);

  // ✅ Direct image download handler - enhanced to include title and legend
  const handleDirectImageDownload = async () => {
    try {
      const filename = `Destination_Statistics_${
        new Date().toISOString().split("T")[0]
      }`;

      // Method 1: Enhanced Highcharts built-in export with title and subtitle
      if (chartRef.current?.chart) {
        const chart = chartRef.current.chart;

        try {
          // Update chart title and subtitle for export
          chart.setTitle(
            {
              text: "Call Distribution by Division",
              style: {
                fontSize: "18px",
                fontWeight: "bold",
                color: "#374151",
              },
            },
            {
              text: `Real-time call volume distribution across divisions<br/>Total Calls: ${totalCalls.toLocaleString()}`,
              style: {
                fontSize: "14px",
                color: "#6B7280",
                fontWeight: "normal",
              },
            }
          );

          // Add legend data as subtitle
          const legendText = gaugeData
            .map(
              (item) =>
                `${item.name}: ${item.totalCalls} calls (${item.percentage}%)`
            )
            .join(" | ");

          chart.setSubtitle({
            text: chart.options.subtitle.text + "<br/><br/>" + legendText,
            style: {
              fontSize: "12px",
              color: "#6B7280",
            },
          });

          chart.exportChart({
            type: "image/png",
            filename,
            width: 1200,
            height: 800,
            scale: 2,
            // Add white background for export
            backgroundColor: "#ffffff",
            plotOptions: {
              series: {
                animation: false,
              },
            },
          });

          // Reset title after export
          setTimeout(() => {
            chart.setTitle({ text: "" }, { text: "" });
          }, 100);

          console.log("Download completed using enhanced Highcharts export");
          return;
        } catch (exportError) {
          console.warn(
            "Enhanced Highcharts export failed, trying fallback:",
            exportError
          );

          // Reset title in case of error
          chart.setTitle({ text: "" }, { text: "" });
        }

        // Method 2: Standard SVG fallback with canvas conversion
        try {
          const svg = chart.getSVG({
            width: 1200,
            height: 800,
            // Add white background and styling for SVG export
            backgroundColor: "#ffffff",
            chart: {
              backgroundColor: "#ffffff",
              style: {
                fontFamily: "Arial, sans-serif",
              },
            },
          });

          // Create canvas for SVG conversion with white background
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = 1200;
          canvas.height = 800;

          const img = new Image();

          img.onload = function () {
            // Fill white background
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add title and stats text
            ctx.fillStyle = "#374151";
            ctx.font = "bold 24px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Call Distribution by Division", canvas.width / 2, 40);

            ctx.font = "16px Arial";
            ctx.fillStyle = "#6B7280";
            ctx.fillText(
              "Real-time call volume distribution across divisions",
              canvas.width / 2,
              70
            );
            ctx.fillText(
              `Total Calls: ${totalCalls.toLocaleString()}`,
              canvas.width / 2,
              95
            );

            // Draw the chart SVG
            ctx.drawImage(img, 0, 120, canvas.width, canvas.height - 220);

            // Add styled legend at bottom (recreate the component legend styling)
            const legendStartY = canvas.height - 180;
            const legendBoxWidth = 180;
            const legendBoxHeight = 60;
            const legendSpacing = 20;
            const legendPerRow = 3;
            
            gaugeData.forEach((item, index) => {
              const row = Math.floor(index / legendPerRow);
              const col = index % legendPerRow;
              const legendX = 50 + col * (legendBoxWidth + legendSpacing);
              const legendY = legendStartY + row * (legendBoxHeight + 15);

              // Draw legend box background (light tinted background)
              const rgbColor = hexToRgb(item.color);
              ctx.fillStyle = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1)`;
              ctx.fillRect(legendX, legendY, legendBoxWidth, legendBoxHeight);

              // Draw legend box border
              ctx.strokeStyle = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
              ctx.lineWidth = 1;
              ctx.strokeRect(legendX, legendY, legendBoxWidth, legendBoxHeight);

              // Draw color dot
              ctx.fillStyle = item.color;
              ctx.beginPath();
              ctx.arc(legendX + 25, legendY + 20, 6, 0, 2 * Math.PI);
              ctx.fill();

              // Draw division name (colored)
              ctx.fillStyle = item.color;
              ctx.font = 'bold 14px Arial';
              ctx.textAlign = 'left';
              ctx.fillText(
                item.name.split(" ")[0],
                legendX + 40,
                legendY + 25
              );

              // Draw stats (gray text)
              ctx.fillStyle = '#6B7280';
              ctx.font = '12px Arial';
              ctx.fillText(
                `${item.totalCalls} calls (${item.percentage}%)`,
                legendX + 15,
                legendY + 45
              );
            });

            // Helper function to convert hex to rgb
            function hexToRgb(hex) {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
              } : null;
            }

            // Download the enhanced image
            canvas.toBlob(function (blob) {
              const link = document.createElement("a");
              link.download = filename + ".png";
              link.href = URL.createObjectURL(blob);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(link.href);

              console.log("Download completed with full content using canvas");
            });
          };

          img.onerror = function () {
            console.warn("Canvas conversion failed");
            // Final fallback - simple SVG download
            const blob = new Blob([svg], {
              type: "image/svg+xml;charset=utf-8",
            });
            const link = document.createElement("a");
            link.download = filename + ".svg";
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            console.log("Download completed as SVG fallback");
          };

          // Convert SVG to data URL
          const svgBlob = new Blob([svg], {
            type: "image/svg+xml;charset=utf-8",
          });
          const url = URL.createObjectURL(svgBlob);
          img.src = url;

          return;
        } catch (svgError) {
          console.warn("SVG export failed:", svgError);
        }
      }

      alert("Failed to download chart. Please try again.");
    } catch (error) {
      console.error("Error downloading chart:", error);
      alert("Failed to download chart. Please try again.");
    }
  };

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
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
  // Chart options
  const multiKPIGaugeConfig = {
    chart: {
      type: "solidgauge",
      height: windowWidth >= 1024 ? 450 : windowWidth >= 768 ? 400 : 256,
      backgroundColor: "#ffffff", // ✅ force white background
      plotBackgroundColor: "#ffffff", // ✅ also enforce
      style: {
        backgroundColor: "#ffffff",
      },
    },
    title: { text: "" },
    credits: { enabled: false },
    exporting: {
      enabled: false,
      chartOptions: {
        chart: {
          backgroundColor: "#ffffff", // ✅ background for export
        },
      },
    },
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
      backgroundColor: "#ffffff", // ✅ white tooltip background
      borderColor: "#ddd",
      style: { color: "#374151" },
      pointFormat: `<div style="text-align:center;">
      <b>{series.name}</b><br/>
      {point.totalCalls} calls ({point.y}%)
    </div>`,
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

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6 lg:h-[776px] h-auto flex flex-col">
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
              onClick={handleDirectImageDownload}
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
        <div
          className="w-full h-48 sm:h-64 md:h-[400px] lg:h-[450px] max-w-[600px] mx-auto bg-white"
          id={chartId}
          style={{ backgroundColor: "#ffffff", borderRadius: "12px" }} // ✅ ensure wrapper is white
        >
          <HighchartsReact
            highcharts={Highcharts}
            options={multiKPIGaugeConfig}
            ref={chartRef}
          />
        </div>

        {/* Legend BELOW chart - styled like original */}
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 mt-4 max-w-[600px] mx-auto">
          {gaugeData.map((item, i) => (
            <div key={i}>
              {/* Mobile/Small screens: Simple dot + name */}
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

              {/* Medium and Large screens: Full legend with background */}
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
