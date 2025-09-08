import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const DashboardGauges = () => {
  const [modulesLoaded, setModulesLoaded] = useState(false);
  const [destinationData, setDestinationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCalls, setTotalCalls] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://iinms.brri.gov.bd/api/cdr/report/all"
        );

        if (response.data.destinationStats) {
          const destinations = response.data.destinationStats.filter(
            (dest) => dest.destination !== "104"
          );
          setDestinationData(destinations);

          // Calculate total calls (excluding destination 104)
          const total = destinations.reduce(
            (sum, item) => sum + item.totalCalls,
            0
          );
          setTotalCalls(total);
        }
      } catch (error) {
        console.error("Error fetching destination data:", error);
        // Keep default empty data on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize Highcharts modules
  useEffect(() => {
    const initializeModules = async () => {
      try {
        if (typeof window !== "undefined") {
          // Import modules without .default
          const HighchartsMore = await import("highcharts/highcharts-more");
          const SolidGauge = await import("highcharts/modules/solid-gauge");

          // Initialize modules
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

          setModulesLoaded(true);
        }
      } catch (error) {
        console.error("Error loading Highcharts modules:", error);
        // Fallback: try to continue without modules for basic chart functionality
        setModulesLoaded(true);
      }
    };

    initializeModules();
  }, []);

  // Don't render charts until modules are loaded
  if (!modulesLoaded || loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 lg:h-[776px] h-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 flex items-center space-x-2">
            <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
            <span>{loading ? "Loading data..." : "Loading charts..."}</span>
          </div>
        </div>
      </div>
    );
  }

  // Define colors that match website theme
  const colors = [
    "#10b981", // emerald-500
    "#3b82f6", // blue-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
  ];

  // Calculate percentages and prepare gauge data
  const maxCalls = Math.max(...destinationData.map((d) => d.totalCalls));

  const gaugeData = destinationData
    .slice(0, 6)
    .map((dest, index) => ({
      name: dest.destinationState,
      destination: dest.destination,
      totalCalls: dest.totalCalls,
      percentage:
        totalCalls > 0 ? Math.round((dest.totalCalls / totalCalls) * 100) : 0,
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.percentage - a.percentage) // Sort by percentage (highest first)
    .map((dest, index) => ({
      ...dest,
      color: colors[index % colors.length], // Reassign colors after sorting
      radius: `${99 - index * 13}%`,
      innerRadius: `${87 - index * 13}%`,
    }));

  // Function to render icons on gauges
  const renderIcons = function () {
    // Define icon mapping based on series name (more reliable)
    const iconMap = {
      "Total Calls Progress": "📞",
      "Answer Rate": "✅",
      Answer: "✅",
      "Success Rate": "📊",
      Success: "📊",
      Rate: "📊",
    };

    this.series.forEach((series) => {
      if (!series.icon && iconMap[series.name]) {
        series.icon = this.renderer
          .text(iconMap[series.name], 0, 0, true)
          .attr({
            zIndex: 10,
          })
          .css({
            color: "#374151",
            fontSize: "1.5em",
            fontWeight: "bold",
            textAnchor: "middle",
          })
          .add(series.group);
      }

      if (series.icon) {
        // Calculate position for each ring - at the start of each circle (top position)
        const centerX = this.chartWidth / 2;
        const centerY = this.chartHeight / 2;
        const point = series.points[0];
        const shapeArgs = point.shapeArgs;

        // Calculate the radius for icon placement (middle of each ring)
        const outerRadius = shapeArgs.r;
        const innerRadius = shapeArgs.innerR;
        const iconRadius = (outerRadius + innerRadius) / 2;

        // Position at the top of each circle (start angle = 0 degrees = top)
        const iconX = centerX;
        const iconY = centerY - iconRadius;

        series.icon.attr({
          x: iconX - 10, // Offset to center the icon
          y: iconY + 5, // Small adjustment for better visual alignment
        });
      }
    });
  };

  // Multi-KPI Gauge Configuration (Dynamic)
  const multiKPIGaugeConfig = {
    chart: {
      type: "solidgauge",
      height: 480,
      backgroundColor: "transparent",
    },
    title: {
      text: "",
      style: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#374151",
      },
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e5e7eb",
      borderRadius: 8,
      borderWidth: 1,
      shadow: true,
      fixed: true,
      pointFormat:
        '<div style="text-align: center; padding: 8px;">' +
        '<div style="font-size: 16px; color: #374151; font-weight: bold; margin-bottom: 6px;">{series.name}</div> <br />' +
        '<div style="font-size: 20px; color: {point.color}; font-weight: bold;">{point.totalCalls} calls</div>' +
        "</div>",
      position: {
        align: "center",
        verticalAlign: "middle",
      },
      style: {
        fontSize: "14px",
      },
    },
    pane: {
      startAngle: 0,
      endAngle: 320,
      background: gaugeData.map((item, index) => ({
        outerRadius: item.radius,
        innerRadius: item.innerRadius,
        backgroundColor: `${item.color}20`, // Add transparency
        borderWidth: 0,
      })),
    },
    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: [],
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
        linecap: "round",
        stickyTracking: false,
        rounded: true,
      },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    series: gaugeData.map((item) => ({
      name: item.name,
      data: [
        {
          color: item.color,
          radius: item.radius,
          innerRadius: item.innerRadius,
          y: item.percentage,
          totalCalls: item.totalCalls,
          percentage: item.percentage,
        },
      ],
    })),
  };

  // Individual gauge configuration (simplified)
  const createGaugeConfig = (
    title,
    value,
    max,
    color,
    unit = "",
    subtitle = ""
  ) => ({
    chart: {
      type: "solidgauge",
      height: 180,
      backgroundColor: "transparent",
      spacing: [0, 0, 0, 0],
      margin: [10, 10, 10, 10],
    },
    title: {
      text: null,
    },
    pane: {
      center: ["50%", "70%"],
      size: "100%",
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: "#f1f5f9",
        innerRadius: "60%",
        outerRadius: "100%",
        shape: "arc",
        borderWidth: 0,
      },
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0,0,0,0.8)",
      style: {
        color: "#fff",
      },
      pointFormatter: function () {
        return `<b>${this.y}${unit}</b> ${subtitle.toLowerCase()}`;
      },
    },
    yAxis: {
      min: 0,
      max: max,
      stops: [
        [0.1, color],
        [0.5, color],
        [0.9, color],
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      title: {
        text: null,
      },
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
        linecap: "round",
        stickyTracking: false,
        rounded: true,
      },
    },
    series: [
      {
        name: title,
        data: [value],
        radius: "100%",
        innerRadius: "60%",
      },
    ],
  });
  // KPI data
  const kpis = [
    {
      title: "Total Calls",
      value: 8500,
      max: 10000,
      color: "#10b981",
      unit: "",
      subtitle: "calls today",
      percentage: "85%",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Received Calls",
      value: 7800,
      max: 8500,
      color: "#3b82f6",
      unit: "",
      subtitle: "calls answered",
      percentage: "92%",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Rejected Calls",
      value: 700,
      max: 1000,
      color: "#ef4444",
      unit: "",
      subtitle: "calls missed",
      percentage: "8%",
      trend: "-3%",
      trendUp: false,
    },
    {
      title: "Success Rate",
      value: 92,
      max: 100,
      color: "#059669",
      unit: "%",
      subtitle: "satisfaction",
      percentage: "92%",
      trend: "+2%",
      trendUp: true,
    },
  ];
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 lg:h-[776px] h-auto flex flex-col">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Call Distribution by Division
            </h3>
            <p className="text-gray-500 text-sm">
              Real-time call volume distribution across divisions
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-700">
              {totalCalls.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Total calls</div>
          </div>
        </div>
      </div>

      {/* Multi-KPI Gauge (Main Feature) */}
      <div className="flex-grow flex flex-col justify-center overflow-hidden">
        <div className="rounded-xl p-4">
          <div className="flex justify-center">
            <div style={{ width: "100%", height: "480px", maxWidth: "500px" }}>
              <HighchartsReact
                highcharts={Highcharts}
                options={multiKPIGaugeConfig}
              />
            </div>
          </div>

          {/* Legend for Multi-KPI Gauge */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {gaugeData.map((item, index) => (
              <div
                key={index}
                className="text-center p-3 rounded-lg border"
                style={{
                  backgroundColor: `${item.color}10`,
                  borderColor: `${item.color}30`,
                }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: item.color }}
                  >
                    {item.name.split(" ")[0]}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {item.totalCalls} calls ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGauges;
