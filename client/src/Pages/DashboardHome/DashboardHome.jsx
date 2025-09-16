import React from "react";
import DashboardStats from "../../components/DashboardStats";
import DashboardAreaChart from "../../components/DashboardAreaChart";
import DashboardComposedChart from "../../components/DashboardComposedChart";
import DashboardGauges from "../../components/DashboardGauges";
import CustomShapeBarChart from "../../components/CustomShapeBarChart";
import CallStatus from "../../components/CallStatus";
import CallDuration from "../../components/CallDuration";
import CallHistoryTable from "../../components/CallHistoryTable";

const DashboardHome = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dashboard Stats Cards */}
      <DashboardStats />

      {/* Dashboard Composed Chart */}
      <DashboardComposedChart />

      {/* Dashboard Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div>
          <DashboardGauges />
        </div>
        <div>
          <div>
            <DashboardAreaChart />
          </div>
          <div>
            <CustomShapeBarChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div>
          <CallStatus />
        </div>
        <div>
          <CallDuration />
        </div>
      </div>
      <div>
        <CallHistoryTable />
      </div>
    </div>
  );
};

export default DashboardHome;
