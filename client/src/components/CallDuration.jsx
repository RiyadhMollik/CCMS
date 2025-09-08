import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Cell, LabelList } from "recharts";

const CallDuration = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCalls, setTotalCalls] = useState(0);

  // Define colors for each duration range
  const colors = [
    "#ec4899", // 180s+
    "#8b5cf6", // 120-180s
    "#ef4444", // 91-120s
    "#f59e0b", // 61-90s
    "#3b82f6", // 31-60s
    "#10b981", // 0-30s
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://iinms.brri.gov.bd/api/cdr/report/all');
        
        if (response.data.durationRanges) {
          const durationRanges = response.data.durationRanges;
          
          // Map API data to chart format (in reverse order for display)
          const chartData = [
            { name: "180s+", calls: durationRanges["180+"] || 0, color: colors[0] },
            { name: "121-180s", calls: durationRanges["121-180"] || 0, color: colors[1] },
            { name: "91-120s", calls: durationRanges["91-120"] || 0, color: colors[2] },
            { name: "61-90s", calls: durationRanges["61-90"] || 0, color: colors[3] },
            { name: "31-60s", calls: durationRanges["31-60"] || 0, color: colors[4] },
            { name: "0-30s", calls: durationRanges["0-30"] || 0, color: colors[5] },
          ];
          
          setData(chartData);
          
          // Calculate total calls
          const total = Object.values(durationRanges).reduce((sum, value) => sum + value, 0);
          setTotalCalls(total);
        }
      } catch (error) {
        console.error('Error fetching call duration data:', error);
        // Keep default empty data on error
        setData([
          { name: "180s+", calls: 0, color: colors[0] },
          { name: "121-180s", calls: 0, color: colors[1] },
          { name: "91-120s", calls: 0, color: colors[2] },
          { name: "61-90s", calls: 0, color: colors[3] },
          { name: "31-60s", calls: 0, color: colors[4] },
          { name: "0-30s", calls: 0, color: colors[5] },
        ]);
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

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:h-[550px] h-auto flex flex-col">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Call Duration Analysis
            </h3>
            <p className="text-gray-500 text-sm">
              Distribution by call duration ranges
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-700">{formatNumber(totalCalls)}</div>
            <div className="text-xs text-gray-500">Total calls</div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-grow" style={{ minHeight: "280px" }}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500 flex items-center space-x-2">
              <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
              <span>Loading chart...</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ bottom: 20, top: 20, right: 40 }}
              layout="vertical"
            >
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis 
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Bar dataKey="calls" radius={[0, 4, 4, 0]}>
                <LabelList 
                  dataKey="calls" 
                  position="right" 
                  style={{ 
                    fontSize: '12px', 
                    fill: '#374151', 
                    fontWeight: 'bold' 
                  }}
                />
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
export default CallDuration;
