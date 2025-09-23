import React, { useState, useEffect } from "react";

const StatsCards = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - you can replace this with API calls later
  const [statsData, setStatsData] = useState({
    totalCalls: 1250,
    connected: 987,
    notConnected: 263,
    totalDuration: 45680, // in seconds
    campaigns: 12,
    noBalanceCalls: 45,
  });

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Format duration from seconds to hours and minutes
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Calculate percentages
  const connectedPercentage =
    statsData.totalCalls > 0
      ? Math.round((statsData.connected / statsData.totalCalls) * 100)
      : 0;

  const notConnectedPercentage =
    statsData.totalCalls > 0
      ? Math.round((statsData.notConnected / statsData.totalCalls) * 100)
      : 0;

  const cards = [
    {
      id: 1,
      title: "Total Calls",
      value: formatNumber(statsData.totalCalls),
      rawValue: statsData.totalCalls,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L7.5 11.5c-.897.46-1.275 1.375-.837 2.15.196.348.481.685.837.987M17.5 11.5l2.724-2.113a1 1 0 00-.502-1.21L18.224 3.684A1 1 0 0017.276 3H14a2 2 0 00-2 2v1"
          />
        </svg>
      ),
      gradient: "from-blue-500 to-indigo-600",
      lightBg: "from-blue-50 to-indigo-50",
      darkColor: "text-blue-600",
      percentage: 100,
      trend: "+12%",
      trendPositive: true,
    },
    {
      id: 2,
      title: "Connected Calls",
      value: formatNumber(statsData.connected),
      rawValue: statsData.connected,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradient: "from-green-500 to-emerald-600",
      lightBg: "from-green-50 to-emerald-50",
      darkColor: "text-green-600",
      percentage: connectedPercentage,
      trend: "+8%",
      trendPositive: true,
    },
    {
      id: 3,
      title: "Failed Calls",
      value: formatNumber(statsData.notConnected),
      rawValue: statsData.notConnected,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradient: "from-red-500 to-rose-600",
      lightBg: "from-red-50 to-rose-50",
      darkColor: "text-red-600",
      percentage: notConnectedPercentage,
      trend: "-5%",
      trendPositive: false,
    },
    {
      id: 4,
      title: "Call Duration",
      value: formatDuration(statsData.totalDuration),
      rawValue: statsData.totalDuration,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradient: "from-purple-500 to-violet-600",
      lightBg: "from-purple-50 to-violet-50",
      darkColor: "text-purple-600",
      percentage: Math.min(
        Math.round((statsData.totalDuration / 86400) * 100),
        100
      ),
      trend: "+15%",
      trendPositive: true,
    },
    {
      id: 5,
      title: "Total Campaigns",
      value: statsData.campaigns,
      rawValue: statsData.campaigns,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-600",
      lightBg: "from-amber-50 to-orange-50",
      darkColor: "text-amber-600",
      percentage: Math.min(statsData.campaigns * 8, 100),
      trend: "+3",
      trendPositive: true,
    },
    {
      id: 6,
      title: "No Balance",
      value: statsData.noBalanceCalls,
      rawValue: statsData.noBalanceCalls,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradient: "from-cyan-500 to-teal-600",
      lightBg: "from-cyan-50 to-teal-50",
      darkColor: "text-cyan-600",
      percentage:
        statsData.totalCalls > 0
          ? Math.round((statsData.noBalanceCalls / statsData.totalCalls) * 100)
          : 0,
      trend: "-2%",
      trendPositive: false,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse overflow-hidden"
          >
            {/* Skeleton gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-12 h-4 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`relative group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
          }}
        >
          {/* Gradient Background on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.lightBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>

          <div className="relative z-10">
            {/* Icon and Title */}
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}
              >
                {card.icon}
              </div>
              <div
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  card.trendPositive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {card.trend}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-gray-600 font-medium text-sm mb-3">
              {card.title}
            </h3>

            {/* Value */}
            <div className="mb-4">
              <h2
                className={`text-2xl font-bold ${card.darkColor} group-hover:scale-105 transition-transform duration-200`}
              >
                {card.value}
              </h2>
            </div>

            {/* Simple Progress Bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${
                  card.gradient
                } rounded-full transition-all duration-1000 ease-out ${
                  isVisible ? "scale-x-100" : "scale-x-0"
                } origin-left`}
                style={{
                  width: `${Math.min(Math.max(card.percentage, 0), 100)}%`,
                  transitionDelay: `${index * 200 + 500}ms`,
                }}
              ></div>
            </div>
          </div>

          {/* Subtle Hover Glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
