import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import * as htmlToImage from "html-to-image";

/**
 * DashboardGauges — dynamically loads Highcharts + modules and only renders
 * the chart after modules are registered to avoid Highcharts error #17.
 */
const DashboardGauges = () => {
  // Data + UI states
  const [destinationData, setDestinationData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Highcharts dynamic loader states
  const [HC, setHC] = useState(null); // Highcharts instance
  const [HCReact, setHCReact] = useState(null); // HighchartsReact component
  const [hcReady, setHcReady] = useState(false); // everything loaded & registered

  const [totalCalls, setTotalCalls] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const chartIdRef = useRef(
    `dashboard-gauges-${Math.random().toString(36).slice(2, 9)}`
  );

  // === DYNAMICALLY LOAD HIGCHARTS + MODULES ===
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Import Highcharts and the React wrapper dynamically
        const HighchartsModule = await import("highcharts");
        const Highcharts = HighchartsModule?.default ?? HighchartsModule;

        const HighchartsReactModule = await import("highcharts-react-official");
        const HighchartsReact =
          HighchartsReactModule?.default ?? HighchartsReactModule;

        // Load modules (await each import). If any fail we'll log & stop to avoid partial registration.
        const highchartsMore = await import("highcharts/highcharts-more");
        const solidGauge = await import("highcharts/modules/solid-gauge");
        const exporting = await import("highcharts/modules/exporting");
        const exportData = await import("highcharts/modules/export-data");
        const offlineExporting = await import(
          "highcharts/modules/offline-exporting"
        );

        // register modules with Highcharts
        const applyModule = (mod) => {
          if (!mod) return;
          if (typeof mod.default === "function") mod.default(Highcharts);
          else if (typeof mod === "function") mod(Highcharts);
        };

        applyModule(highchartsMore);
        applyModule(solidGauge); // CRITICAL: register solid-gauge BEFORE creating a solidgauge chart.
        applyModule(exporting);
        applyModule(exportData);
        applyModule(offlineExporting);

        if (mounted) {
          setHC(Highcharts);
          setHCReact(() => HighchartsReact); // store component
          setHcReady(true);
        }
      } catch (err) {
        // If registration fails, we log an error and keep hcReady false so chart will not render.
        console.error("Failed to load/register Highcharts modules:", err);
        if (mounted) {
          setHcReady(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // === FETCH DATA ===
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingData(true);
        const res = await axios.get(
          "https://iinms.brri.gov.bd/api/cdr/report/all"
        );
        if (!mounted) return;

        if (res?.data?.destinationStats) {
          const destinations = res.data.destinationStats.filter(
            (d) => d.destination !== "104"
          );
          setDestinationData(destinations);
          const total = destinations.reduce(
            (s, it) => s + (it.totalCalls || 0),
            0
          );
          setTotalCalls(total);
        } else {
          setDestinationData([]);
          setTotalCalls(0);
        }
      } catch (err) {
        console.error("Error fetching destination data:", err);
        setDestinationData([]);
        setTotalCalls(0);
      } finally {
        if (mounted) setLoadingData(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // === WINDOW RESIZE ===
  useEffect(() => {
    const h = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  // === PREPARE GAUGE DATA ===
  const colors = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  const gaugeData = useMemo(() => {
    return destinationData
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
  }, [destinationData, totalCalls]);

  // === BUILD CHART CONFIG ONLY WHEN HC MODULES READY ===
  const buildGaugeConfig = (dataArr, w) => {
    return {
      chart: {
        type: "solidgauge",
        height: w >= 1024 ? 450 : w >= 768 ? 400 : 256,
        backgroundColor: "#ffffff",
      },
      title: { text: "" },
      credits: { enabled: false },
      exporting: { enabled: false },
      yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
      pane: {
        startAngle: 0,
        endAngle: 320,
        center: w < 640 ? ["50%", "55%"] : ["50%", "50%"],
        size: w < 640 ? "85%" : "90%",
        background: dataArr.map((g) => ({
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
      series: dataArr.map((g) => ({
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
  };

  // Only build final options when hcReady is true (so type 'solidgauge' is safe)
  const chartOptions = useMemo(() => {
    if (!hcReady) return null;
    return buildGaugeConfig(gaugeData, windowWidth);
  }, [hcReady, gaugeData, windowWidth]);

  // === IMAGE DOWNLOAD via html-to-image (only visible when chart is ready) ===
  const handleDownload = async () => {
    if (!containerRef.current) return;
    try {
      // html-to-image will capture the container. backgroundColor ensures white background.
      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `Destination_Stats_${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Try reloading the chart and try again.");
    }
  };

  // === RENDER ===
  const isBusy = loadingData || !hcReady;

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 md:h-[588px] lg:h-[773px] h-auto flex flex-col"
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

          {!isBusy && gaugeData.length > 0 && (
            <button
              onClick={handleDownload}
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

      {/* Chart area */}
      <div className="flex-grow flex flex-col justify-center">
        <div className="w-full h-48 sm:h-64 md:h-[400px] lg:h-[450px] max-w-[600px] mx-auto bg-white rounded-xl">
          {isBusy ? (
            <div className="flex justify-center items-center h-full text-gray-400">
              Chart loading...
            </div>
          ) : // safe to render HighchartsReact only AFTER hcReady is true
          HC && HCReact && chartOptions ? (
            <HCReact highcharts={HC} options={chartOptions} ref={chartRef} />
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400">
              Chart loading...
            </div>
          )}
        </div>

        {/* Legend below the chart */}
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 mt-4 max-w-[600px] mx-auto">
          {gaugeData.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-center space-x-2 md:hidden">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
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
                  />
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
