import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const DashboardStats = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState({
    totalCall: 0,
    totalAnswer: 0,
    totalBusy: 0,
    totalNoAnswer: 0,
    successRate: "0%",
    totalDuration: 0,
  });

  // Handle card click to navigate to data analytics page
  const handleCardClick = (cardType) => {
    // Navigate to data analytics page
    navigate('/data-analytics');
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://iinms.brri.gov.bd/api/cdr/report/all"
        );
        setApiData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Calculate average call duration
  const avgCallDuration =
    apiData.totalAnswer > 0
      ? Math.round(apiData.totalDuration / apiData.totalAnswer)
      : 0;

  const statsData = [
    {
      id: 1,
      title: "Total Calls",
      value: formatNumber(apiData.totalCall),
      rawValue: apiData.totalCall,
      icon: "📞",
      color: "blue",
      bgColor: "bg-blue-50",
      progressColor: "bg-blue-500",
      textColor: "text-blue-600",
      percentage: 100,
    },
    {
      id: 2,
      title: "Answered Calls",
      value: formatNumber(apiData.totalAnswer),
      rawValue: apiData.totalAnswer,
      icon: "✅",
      color: "green",
      bgColor: "bg-green-50",
      progressColor: "bg-green-500",
      textColor: "text-green-600",
      percentage:
        apiData.totalCall > 0
          ? Math.round((apiData.totalAnswer / apiData.totalCall) * 100)
          : 0,
    },
    {
      id: 3,
      title: "Success Rate",
      value: apiData.successRate,
      rawValue: parseFloat(apiData.successRate),
      icon: "📊",
      color: "emerald",
      bgColor: "bg-emerald-50",
      progressColor: "bg-emerald-500",
      textColor: "text-emerald-600",
      percentage: parseFloat(apiData.successRate) || 0,
    },
    {
      id: 4,
      title: "Busy Calls",
      value: formatNumber(apiData.totalBusy),
      rawValue: apiData.totalBusy,
      icon: "🔴",
      color: "red",
      bgColor: "bg-red-50",
      progressColor: "bg-red-500",
      textColor: "text-red-600",
      percentage:
        apiData.totalCall > 0
          ? Math.round((apiData.totalBusy / apiData.totalCall) * 100)
          : 0,
    },
    {
      id: 5,
      title: "No Answer",
      value: formatNumber(apiData.totalNoAnswer),
      rawValue: apiData.totalNoAnswer,
      icon: "📵",
      color: "orange",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-500",
      textColor: "text-orange-600",
      percentage:
        apiData.totalCall > 0
          ? Math.round((apiData.totalNoAnswer / apiData.totalCall) * 100)
          : 0,
    },
    {
      id: 6,
      title: "Total Duration",
      value: formatDuration(apiData.totalDuration),
      rawValue: apiData.totalDuration,
      icon: "⏱️",
      color: "purple",
      bgColor: "bg-purple-50",
      progressColor: "bg-purple-500",
      textColor: "text-purple-600",
      percentage:
        avgCallDuration > 0
          ? Math.min(Math.round((avgCallDuration / 60) * 100), 100)
          : 0,
    },
  ];

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [loading]);

  const getProgressWidth = (percentage) => {
    return Math.min(Math.max(percentage, 0), 100);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <div
          key={stat.id}
          onClick={() => handleCardClick(stat.title)}
          className={`${
            stat.bgColor
          } rounded-xl p-4 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer group transform relative overflow-hidden ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Icon Background Decoration */}
          <div className="absolute -top-2 -right-2 text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            {stat.icon}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                {stat.icon}
              </span>
              <h3 className="text-gray-600 font-medium text-xs group-hover:text-gray-800 transition-colors duration-200">
                {stat.title}
              </h3>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-semibold ${stat.textColor} bg-white/50`}
            >
              {stat.percentage}%
            </div>
          </div>

          {/* Value */}
          <div className="mb-4 relative z-10">
            <div className="flex items-end justify-between">
              <h2
                className={`text-2xl font-bold ${stat.textColor} group-hover:scale-110 transition-transform duration-200`}
              >
                {stat.value}
              </h2>
            </div>
            {stat.rawValue > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Raw: {stat.rawValue.toLocaleString()}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden relative z-10">
            <div
              className={`${
                stat.progressColor
              } h-2 rounded-full transition-all duration-1000 ease-out transform origin-left relative ${
                isVisible ? "scale-x-100" : "scale-x-0"
              }`}
              style={{
                width: `${getProgressWidth(stat.percentage)}%`,
                transitionDelay: `${index * 200 + 500}ms`,
              }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          {/* Animated Background Pulse */}
          <div
            className={`absolute inset-0 ${stat.progressColor} opacity-0 rounded-xl group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
          ></div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
