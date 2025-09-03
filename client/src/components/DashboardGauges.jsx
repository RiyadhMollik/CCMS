import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const DashboardGauges = () => {
  const [modulesLoaded, setModulesLoaded] = useState(false);

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
  if (!modulesLoaded) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 flex items-center space-x-2">
            <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
            <span>Loading charts...</span>
          </div>
        </div>
      </div>
    );
  }

  // Function to render icons on gauges
  const renderIcons = function () {
    // Define icon mapping based on series name (more reliable)
    const iconMap = {
      "Total Calls Progress": "📞",
      "Answer Rate": "✅", 
      "Success Rate": "📊"
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

  // Multi-KPI Gauge Configuration (like the demo)
  const multiKPIGaugeConfig = {
    chart: {
      type: "solidgauge",
      height: 400,
      backgroundColor: "transparent",
      // Removed the render icons event for now
    },
    title: {
      text: "Call Center Performance",
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
        '<div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">{series.name}</div>' +
        '<div style="font-size: 24px; color: {point.color}; font-weight: bold;">{point.y}%</div>' +
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
      endAngle: 360,
      background: [
        {
          // Track for Total Calls
          outerRadius: "112%",
          innerRadius: "88%",
          backgroundColor: "rgba(16, 185, 129, 0.2)", // emerald with transparency
          borderWidth: 0,
        },
        {
          // Track for Received Calls
          outerRadius: "87%",
          innerRadius: "63%",
          backgroundColor: "rgba(59, 130, 246, 0.2)", // blue with transparency
          borderWidth: 0,
        },
        {
          // Track for Success Rate
          outerRadius: "62%",
          innerRadius: "38%",
          backgroundColor: "rgba(5, 150, 105, 0.2)", // green with transparency
          borderWidth: 0,
        },
      ],
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
    series: [
      {
        name: "Total Calls Progress",
        data: [
          {
            color: "#10b981", // emerald-500
            radius: "112%",
            innerRadius: "88%",
            y: 85, // 8500/10000 * 100
          },
        ],
      },
      {
        name: "Answer Rate", 
        data: [
          {
            color: "#3b82f6", // blue-500
            radius: "87%",
            innerRadius: "63%",
            y: 92, // 7800/8500 * 100
          },
        ],
      },
      {
        name: "Success Rate",
        data: [
          {
            color: "#059669", // emerald-600
            radius: "62%",
            innerRadius: "38%",
            y: 92,
          },
        ],
      },
    ],
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          Performance Overview
        </h3>
        <p className="text-gray-500 text-sm">
          Real-time call center metrics and KPIs
        </p>
      </div>

      {/* Multi-KPI Gauge (Main Feature) */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
          <div className="flex justify-center">
            <div style={{ width: "400px", height: "400px" }}>
              <HighchartsReact
                highcharts={Highcharts}
                options={multiKPIGaugeConfig}
              />
            </div>
          </div>

          {/* Legend for Multi-KPI Gauge */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">
                  Total Calls
                </span>
              </div>
              <div className="text-lg font-bold text-emerald-600">85%</div>
              <div className="text-xs text-gray-500">8,500 / 10,000</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">
                  Answer Rate
                </span>
              </div>
              <div className="text-lg font-bold text-blue-600">92%</div>
              <div className="text-xs text-gray-500">7,800 answered</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">
                  Success Rate
                </span>
              </div>
              <div className="text-lg font-bold text-green-600">92%</div>
              <div className="text-xs text-gray-500">Customer satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGauges;
