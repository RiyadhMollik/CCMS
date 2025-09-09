import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";

const DashboardAreaChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCalls, setTotalCalls] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Track window resize for responsive charts
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://iinms.brri.gov.bd/api/cdr/report/all');
        
        if (response.data.last10Days) {
          const last10Days = response.data.last10Days;
          
          // Process data for chart
          const processedData = last10Days.map((item, index) => {
            const date = new Date(item.day);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthName = monthNames[date.getMonth()];
            const day = date.getDate();
            
            return {
              name: `${monthName} ${day}`,
              calls: item.totalCalls,
              originalData: item
            };
          }).reverse(); // Reverse the array so most recent day is first
          
          // Create chart points with correct index mapping after reversal
          const chartPoints = processedData.map((item, index) => [index + 1, item.calls]);
          
          setData(processedData);
          setChartData(chartPoints);
          
          // Calculate total calls
          const total = last10Days.reduce((sum, item) => sum + item.totalCalls, 0);
          setTotalCalls(total);
        }
      } catch (error) {
        console.error('Error fetching area chart data:', error);
        // Keep default empty data on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format number with K suffix
  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Get responsive values based on current window width
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  
  const getChartHeight = () => {
    if (isMobile) return 240;
    if (isTablet) return 260;
    return 280;
  };

  const getChartConfig = () => {
    if (isMobile) {
      return {
        titleFontSize: '14px',
        subtitleFontSize: '11px',
        labelFontSize: '10px',
        axisFontSize: '11px',
        markerRadius: 3,
        lineWidth: 2
      };
    }
    if (isTablet) {
      return {
        titleFontSize: '15px',
        subtitleFontSize: '11px',
        labelFontSize: '10px',
        axisFontSize: '11px',
        markerRadius: 3.5,
        lineWidth: 2.5
      };
    }
    return {
      titleFontSize: '16px',
      subtitleFontSize: '12px',
      labelFontSize: '11px',
      axisFontSize: '12px',
      markerRadius: 4,
      lineWidth: 3
    };
  };

  useEffect(() => {
    if (chartRef.current && chartData.length > 0 && !loading) {
      const config = getChartConfig();
      
      Highcharts.chart(chartRef.current, {
        chart: {
          type: 'spline',
          inverted: false,
          backgroundColor: 'transparent',
          height: getChartHeight(),
          margin: isMobile ? [20, 10, 40, 40] : [30, 20, 50, 50]
        },
        title: {
          text: isMobile ? 'Call Trends (10 Days)' : 'Last 10 Days Call Volume',
          style: {
            fontSize: config.titleFontSize,
            fontWeight: '600',
            color: '#374151'
          }
        },
        subtitle: {
          text: isMobile ? 'Daily call stats' : 'Daily incoming call statistics',
          style: {
            color: '#6b7280',
            fontSize: config.subtitleFontSize
          }
        },
        xAxis: {
          reversed: false,
          title: {
            enabled: !isMobile,
            style: {
              color: '#6b7280',
              fontSize: config.axisFontSize
            }
          },
          labels: {
            formatter: function() {
              // Use the processed date names
              if (data[this.value - 1]) {
                return isMobile ? data[this.value - 1].name.split(' ')[1] : data[this.value - 1].name;
              }
              return `${this.value}`;
            },
            style: {
              color: '#6b7280',
              fontSize: config.labelFontSize
            },
            rotation: isMobile ? -45 : 0
          },
          accessibility: {
            rangeDescription: `Range: Day 1 to Day ${data.length}.`
          },
          maxPadding: 0.05,
          showLastLabel: true,
          gridLineColor: '#f0f0f0'
        },
        yAxis: {
          title: {
            text: isMobile ? 'Calls' : 'Call Count',
            style: {
              color: '#6b7280',
              fontSize: config.axisFontSize
            }
          },
          labels: {
            format: '{value}',
            style: {
              color: '#6b7280',
              fontSize: config.labelFontSize
            }
          },
          accessibility: {
            rangeDescription: 'Range: 0 to maximum calls.'
          },
          lineWidth: 1,
          gridLineColor: '#f0f0f0'
        },
        legend: {
          enabled: false
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormatter: function() {
            const dayData = data[this.x - 1];
            return `${dayData ? dayData.name : `Day ${this.x}`}: ${this.y} calls`;
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e7eb',
          borderRadius: 8,
          shadow: true,
          style: {
            color: '#374151'
          }
        },
        plotOptions: {
          spline: {
            marker: {
              enabled: true,
              radius: config.markerRadius,
              fillColor: '#10b981',
              lineColor: '#059669',
              lineWidth: 2
            },
            lineWidth: config.lineWidth,
            color: '#10b981'
          }
        },
        series: [{
          name: 'Daily Calls',
          data: chartData,
          color: '#10b981'
        }],
        credits: {
          enabled: false
        }
      });
    }
  }, [chartData, data, loading, windowWidth]);

  return (
    <div className="bg-white rounded-xl p-2 sm:p-4 md:p-6 shadow-sm border border-gray-100 mb-4 lg:h-[380px] h-auto flex flex-col">
      {/* Chart Header */}
      <div className="mb-2 sm:mb-3 md:mb-4 flex-shrink-0">
        <div className="flex justify-between items-start space-x-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-tight">
              Call Trends
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-base sm:text-lg md:text-xl font-bold text-emerald-600 whitespace-nowrap">
              {formatNumber(totalCalls)}
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">Last 10 days total</div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full flex-grow h-60 sm:h-64 md:h-72">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500 flex items-center space-x-2">
              <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
              <span>Loading chart...</span>
            </div>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-full"></div>
        )}
      </div>
    </div>
  );
};

export default DashboardAreaChart;
