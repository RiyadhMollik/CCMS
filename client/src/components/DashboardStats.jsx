import React, { useState, useEffect } from 'react';

const DashboardStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({});

  const statsData = [
    {
      id: 1,
      title: 'Service',
      value: '2564K',
      change: '+ 98%',
      changeType: 'increase',
      color: 'purple',
      bgColor: 'bg-purple-50',
      progressColor: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      id: 2,
      title: 'Handling Time',
      value: '5564H',
      change: '+ 95%',
      changeType: 'increase',
      color: 'blue',
      bgColor: 'bg-blue-50',
      progressColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Call Rate',
      value: '64K',
      change: '+ 85%',
      changeType: 'increase',
      color: 'pink',
      bgColor: 'bg-pink-50',
      progressColor: 'bg-pink-500',
      textColor: 'text-pink-600'
    },
    {
      id: 4,
      title: 'Hold Time',
      value: '2164H',
      change: '+ 80%',
      changeType: 'increase',
      color: 'red',
      bgColor: 'bg-red-50',
      progressColor: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      id: 5,
      title: 'Hold Time',
      value: '2164H',
      change: '+ 80%',
      changeType: 'increase',
      color: 'red',
      bgColor: 'bg-red-50',
      progressColor: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      id: 6,
      title: 'Hold Time',
      value: '2164H',
      change: '+ 80%',
      changeType: 'increase',
      color: 'red',
      bgColor: 'bg-red-50',
      progressColor: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const getProgressWidth = (change) => {
    const percentage = parseInt(change.replace(/[^0-9]/g, ''));
    return Math.min(percentage, 100);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <div
          key={stat.id}
          className={`${stat.bgColor} rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer group transform ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
            animationDelay: `${index * 100}ms`
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 font-medium text-xs group-hover:text-gray-800 transition-colors duration-200">
              {stat.title}
            </h3>
            <div className="flex space-x-1 group-hover:animate-pulse">
              <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-600 transition-colors duration-200"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-600 transition-colors duration-200"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-600 transition-colors duration-200"></div>
            </div>
          </div>

          {/* Value and Change */}
          <div className="mb-4">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-200">
                {stat.value}
              </h2>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`${stat.progressColor} h-1.5 rounded-full transition-all duration-1000 ease-out transform origin-left ${
                isVisible ? 'scale-x-100' : 'scale-x-0'
              }`}
              style={{ 
                width: `${getProgressWidth(stat.change)}%`,
                transitionDelay: `${(index * 200) + 500}ms`
              }}
            ></div>
          </div>

          {/* Animated Background Pulse */}
          <div className={`absolute inset-0 ${stat.progressColor} opacity-0 rounded-xl group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
