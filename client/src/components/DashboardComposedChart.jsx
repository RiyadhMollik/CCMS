import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DashboardComposedChart = () => {
  const [data, setData] = useState([
    { name: "Jan", satisfaction: 95 },
    { name: "Feb", satisfaction: 89 },
    { name: "Mar", satisfaction: 92 },
    { name: "Apr", satisfaction: 88 },
    { name: "May", satisfaction: 94 },
    { name: "Jun", satisfaction: 87 },
    { name: "Jul", satisfaction: 96 },
    { name: "Aug", satisfaction: 91 },
    { name: "Sep", satisfaction: 89 },
    { name: "Oct", satisfaction: 93 },
    { name: "Nov", satisfaction: 88 },
    { name: "Dec", satisfaction: 95 },
  ]);
  const [loading, setLoading] = useState(true);
  const [totalCalls, setTotalCalls] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://iinms.brri.gov.bd/api/cdr/report/all');
        
        // Process the last12Months data
        if (response.data.last12Months) {
          const monthNames = {
            '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
            '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
            '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
          };
          
          const processedData = response.data.last12Months.map(item => {
            const monthNum = item.month.split('-')[1];
            const year = item.month.split('-')[0].slice(-2); // Get last 2 digits of year
            const monthName = monthNames[monthNum] || item.month;
            
            return {
              name: `${monthName} ${year}`,
              satisfaction: item.totalCalls, // Using satisfaction key to keep chart design intact
              month: item.month
            };
          }).reverse(); // Reverse the array so latest month is first
          
          setData(processedData);
          
          // Calculate total calls
          const total = processedData.reduce((sum, item) => sum + item.satisfaction, 0);
          setTotalCalls(total);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        // Keep default data on error
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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg border-l-4 border-l-emerald-500">
          <p className="font-semibold text-gray-800 mb-2">{`Month: ${label}`}</p>
          <div className="space-y-1">
            <p className="text-sm font-medium text-emerald-600">
              {`Total Calls: ${payload[0]?.value?.toLocaleString()}`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="text-right">
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div className="w-full h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      {/* Chart Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Monthly Call Volume
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{formatNumber(totalCalls)}</div>
            <div className="text-xs text-gray-500">Total Calls</div>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Last 12 months call volume trends with bar and line visualization
        </p>
      </div>

      {/* Chart Container */}
      <div className="w-full" style={{ height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Gradient definitions */}
            <defs>
              <linearGradient
                id="satisfactionGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* Bar chart for satisfaction */}
            <Bar
              dataKey="satisfaction"
              fill="#a7f3d0"
              name="Call Volume"
              opacity={0.9}
              radius={[25, 25, 25, 25]}
              maxBarSize={80}
            />

            {/* Line chart for satisfaction */}
            <Line
              type="monotone"
              dataKey="satisfaction"
              stroke="#059669"
              strokeWidth={3}
              dot={{ fill: "#059669", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: "#059669", strokeWidth: 2 }}
              name="Call Trend"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardComposedChart;
