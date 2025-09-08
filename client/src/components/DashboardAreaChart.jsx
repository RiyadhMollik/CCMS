import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";

const DashboardAreaChart = () => {
  const chartRef = useRef(null);

  // Last 10 days call data
  const data = [
    [1, 42],
    [2, 38], 
    [3, 45],
    [4, 49],
    [5, 43],
    [6, 35],
    [7, 48],
    [8, 41],
    [9, 49],
    [10, 55]
  ];

  useEffect(() => {
    if (chartRef.current) {
      Highcharts.chart(chartRef.current, {
        chart: {
          type: 'spline',
          inverted: false,
          backgroundColor: 'transparent',
          height: 280
        },
        title: {
          text: 'Last 10 Days Call Volume',
          style: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151'
          }
        },
        subtitle: {
          text: 'Daily incoming call statistics',
          style: {
            color: '#6b7280',
            fontSize: '12px'
          }
        },
        xAxis: {
          reversed: false,
          title: {
            enabled: true,
            // text: 'Days',
            style: {
              color: '#6b7280',
              fontSize: '12px'
            }
          },
          labels: {
            format: 'Day {value}',
            style: {
              color: '#6b7280',
              fontSize: '11px'
            }
          },
          accessibility: {
            rangeDescription: 'Range: Day 1 to Day 10.'
          },
          maxPadding: 0.05,
          showLastLabel: true,
          gridLineColor: '#f0f0f0'
        },
        yAxis: {
          title: {
            text: 'Call Count',
            style: {
              color: '#6b7280',
              fontSize: '12px'
            }
          },
          labels: {
            format: '{value}',
            style: {
              color: '#6b7280',
              fontSize: '11px'
            }
          },
          accessibility: {
            rangeDescription: 'Range: 300 to 600 calls.'
          },
          lineWidth: 1,
          gridLineColor: '#f0f0f0'
        },
        legend: {
          enabled: false
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormat: 'Day {point.x}: {point.y} calls',
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
              radius: 4,
              fillColor: '#10b981',
              lineColor: '#059669',
              lineWidth: 2
            },
            lineWidth: 3,
            color: '#10b981'
          }
        },
        series: [{
          name: 'Daily Calls',
          data: data,
          color: '#10b981'
        }],
        credits: {
          enabled: false
        }
      });
    }
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4 lg:h-[380px] h-auto flex flex-col">
      {/* Chart Header */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Call Trends
          </h3>
          <div className="text-right">
            <div className="text-xl font-bold text-emerald-600">4.5K</div>
            <div className="text-xs text-gray-500">Last 10 days total</div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full flex-grow" style={{ minHeight: "280px" }}>
        <div ref={chartRef} className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default DashboardAreaChart;
