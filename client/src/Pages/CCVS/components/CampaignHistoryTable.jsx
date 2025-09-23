import React, { useState, useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";

const CampaignHistoryTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  // Demo data for recent 10 campaign history
  const demoData = [
    {
      id: 1,
      campaignName: "Rice Quality Survey",
      campaignTime: "2025-01-15 09:30:00",
      totalCalls: 420,
      connectedCalls: 320,
      notConnected: 85,
      noBalance: 15,
      totalBillsec: 96000, // in seconds
      totalExpenses: 1250.5,
    },
    {
      id: 2,
      campaignName: "Farmer Feedback",
      campaignTime: "2025-01-14 14:15:00",
      totalCalls: 365,
      connectedCalls: 280,
      notConnected: 70,
      noBalance: 15,
      totalBillsec: 84000,
      totalExpenses: 1095.75,
    },
    {
      id: 3,
      campaignName: "Crop Advisory",
      campaignTime: "2025-01-13 11:00:00",
      totalCalls: 280,
      connectedCalls: 210,
      notConnected: 60,
      noBalance: 10,
      totalBillsec: 63000,
      totalExpenses: 840.25,
    },
    {
      id: 4,
      campaignName: "Weather Alert",
      campaignTime: "2025-01-12 08:45:00",
      totalCalls: 195,
      connectedCalls: 150,
      notConnected: 35,
      noBalance: 10,
      totalBillsec: 45000,
      totalExpenses: 585.5,
    },
    {
      id: 5,
      campaignName: "Market Price Update",
      campaignTime: "2025-01-11 16:20:00",
      totalCalls: 140,
      connectedCalls: 105,
      notConnected: 25,
      noBalance: 10,
      totalBillsec: 31500,
      totalExpenses: 420.75,
    },
    {
      id: 6,
      campaignName: "Pest Control Advisory",
      campaignTime: "2025-01-10 13:10:00",
      totalCalls: 120,
      connectedCalls: 95,
      notConnected: 20,
      noBalance: 5,
      totalBillsec: 28500,
      totalExpenses: 360.25,
    },
    {
      id: 7,
      campaignName: "Soil Health Check",
      campaignTime: "2025-01-09 10:30:00",
      totalCalls: 110,
      connectedCalls: 85,
      notConnected: 20,
      noBalance: 5,
      totalBillsec: 25500,
      totalExpenses: 330.5,
    },
    {
      id: 8,
      campaignName: "Seed Information",
      campaignTime: "2025-01-08 15:45:00",
      totalCalls: 95,
      connectedCalls: 70,
      notConnected: 20,
      noBalance: 5,
      totalBillsec: 21000,
      totalExpenses: 285.75,
    },
    {
      id: 9,
      campaignName: "Irrigation Guide",
      campaignTime: "2025-01-07 12:00:00",
      totalCalls: 85,
      connectedCalls: 65,
      notConnected: 15,
      noBalance: 5,
      totalBillsec: 19500,
      totalExpenses: 255.25,
    },
    {
      id: 10,
      campaignName: "Harvest Advisory",
      campaignTime: "2025-01-06 09:15:00",
      totalCalls: 75,
      connectedCalls: 55,
      notConnected: 15,
      noBalance: 5,
      totalBillsec: 16500,
      totalExpenses: 225.5,
    },
  ];

  // Load demo data
  useEffect(() => {
    const loadDemoData = () => {
      setLoading(true);

      // Simulate loading delay
      setTimeout(() => {
        setData(demoData);
        setLoading(false);
      }, 800);
    };

    loadDemoData();
  }, []);

  // Format time duration from seconds to HH:MM:SS
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format campaign time
  const formatCampaignTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `৳${amount.toFixed(2)}`;
  };

  // Download table as PNG
  const handleDownload = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `Campaign_History_${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download table. Please try again.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
            Campaign History
          </h3>
          <p className="text-gray-500 text-sm">
            Recent 10 campaigns with detailed statistics
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center p-2 rounded-lg"
          title="Download table as image"
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

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500 flex items-center space-x-2">
            <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
            <span>Loading campaign data...</span>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-green-50 border-b border-gray-200">
              <tr className="text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 text-left">Campaign Name</th>
                <th className="py-3 px-4 text-left">Campaign Time</th>
                <th className="py-3 px-4 text-center">Total Calls</th>
                <th className="py-3 px-4 text-center">Connected</th>
                <th className="py-3 px-4 text-center">Not Connected</th>
                <th className="py-3 px-4 text-center">No Balance</th>
                <th className="py-3 px-4 text-center">Total Duration</th>
                <th className="py-3 px-4 text-right">Total Expenses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((campaign, index) => (
                <tr
                  key={campaign.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-green-50 transition-colors duration-200`}
                >
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{campaign.campaignName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {formatCampaignTime(campaign.campaignTime)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-gray-800">
                      {campaign.totalCalls.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {campaign.connectedCalls.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {campaign.notConnected.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {campaign.noBalance.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 text-sm font-mono">
                    {formatDuration(campaign.totalBillsec)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(campaign.totalExpenses)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Footer */}
      {!loading && data.length > 0 && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-800">
                {data
                  .reduce((sum, item) => sum + item.totalCalls, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total Calls</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {data
                  .reduce((sum, item) => sum + item.connectedCalls, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Connected</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {data
                  .reduce((sum, item) => sum + item.notConnected, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Not Connected</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">
                {data
                  .reduce((sum, item) => sum + item.noBalance, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">No Balance</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">
                {formatCurrency(
                  data.reduce((sum, item) => sum + item.totalExpenses, 0)
                )}
              </div>
              <div className="text-xs text-gray-500">Total Expenses</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignHistoryTable;
