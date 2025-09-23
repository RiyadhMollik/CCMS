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
      icon: "📞",
      color: "blue",
      bgColor: "bg-blue-50",
      progressColor: "bg-blue-500",
      textColor: "text-blue-600",
      percentage: 100,
      description: "All calls made",
    },
    {
      id: 2,
      title: "Connected",
      value: formatNumber(statsData.connected),
      rawValue: statsData.connected,
      icon: "✅",
      color: "green",
      bgColor: "bg-green-50",
      progressColor: "bg-green-500",
      textColor: "text-green-600",
      percentage: connectedPercentage,
      description: "Successfully connected",
    },
    {
      id: 3,
      title: "Not Connected",
      value: formatNumber(statsData.notConnected),
      rawValue: statsData.notConnected,
      icon: "❌",
      color: "red",
      bgColor: "bg-red-50",
      progressColor: "bg-red-500",
      textColor: "text-red-600",
      percentage: notConnectedPercentage,
      description: "Failed to connect",
    },
    {
      id: 4,
      title: "Duration",
      value: formatDuration(statsData.totalDuration),
      rawValue: statsData.totalDuration,
      icon: "⏱️",
      color: "purple",
      bgColor: "bg-purple-50",
      progressColor: "bg-purple-500",
      textColor: "text-purple-600",
      percentage: Math.min(
        Math.round((statsData.totalDuration / 86400) * 100),
        100
      ), // Max 24h
      description: "Total call time",
    },
    {
      id: 5,
      title: "Campaigns",
      value: statsData.campaigns,
      rawValue: statsData.campaigns,
      icon: "📢",
      color: "indigo",
      bgColor: "bg-indigo-50",
      progressColor: "bg-indigo-500",
      textColor: "text-indigo-600",
      percentage: Math.min(statsData.campaigns * 5, 100), // Arbitrary scaling
      description: "Active campaigns",
    },
    {
      id: 6,
      title: "No Balance Calls",
      value: statsData.noBalanceCalls,
      rawValue: statsData.noBalanceCalls,
      icon: "💸",
      color: "orange",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-500",
      textColor: "text-orange-600",
      percentage:
        statsData.totalCalls > 0
          ? Math.round((statsData.noBalanceCalls / statsData.totalCalls) * 100)
          : 0,
      description: "Insufficient balance",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="mb-4">
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`${
            card.bgColor
          } rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer group transform relative overflow-hidden ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Background Icon Decoration */}
          <div className="absolute -top-2 -right-2 text-5xl opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            {card.icon}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {card.icon}
              </span>
              <div>
                <h3 className="text-gray-700 font-semibold text-sm group-hover:text-gray-900 transition-colors duration-200">
                  {card.title}
                </h3>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${card.textColor} bg-white/70 shadow-sm`}
            >
              {card.percentage}%
            </div>
          </div>

          {/* Value */}
          <div className="mb-4 relative z-10">
            <div className="flex items-end justify-between">
              <h2
                className={`text-3xl font-bold ${card.textColor} group-hover:scale-110 transition-transform duration-200`}
              >
                {card.value}
              </h2>
            </div>
            {card.rawValue !== card.value && (
              <p className="text-xs text-gray-600 mt-2 font-medium">
                Raw: {card.rawValue.toLocaleString()}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden relative z-10 shadow-inner">
            <div
              className={`${
                card.progressColor
              } h-2 rounded-full transition-all duration-1000 ease-out transform origin-left relative ${
                isVisible ? "scale-x-100" : "scale-x-0"
              }`}
              style={{
                width: `${Math.min(Math.max(card.percentage, 0), 100)}%`,
                transitionDelay: `${index * 200 + 500}ms`,
              }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div
            className={`absolute inset-0 ${card.progressColor} opacity-0 rounded-xl group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
          ></div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%]"></div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
