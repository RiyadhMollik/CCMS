import React from "react";
import DashboardStats from "../../components/DashboardStats";
import DashboardAreaChart from "../../components/DashboardAreaChart";
import DashboardComposedChart from "../../components/DashboardComposedChart";
import DashboardGauges from "../../components/DashboardGauges";

const DashboardHome = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dashboard Stats Cards */}
      <DashboardStats />
      
      {/* Dashboard Area Chart */}
      <DashboardAreaChart />
      
      {/* Dashboard Composed Chart */}
      <DashboardComposedChart />
      
      {/* Dashboard Gauges */}
      <DashboardGauges />
    </div>
  );
};

export default DashboardHome;
