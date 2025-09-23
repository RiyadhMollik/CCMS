import React from "react";
import StatsCards from "./components/StatsCards";
import CallStatusChart from "./components/CallStatusChart";
import WeeklyChart from "./components/WeeklyChart";
import WeeklyCampaignsChart from "./components/WeeklyCampaignsChart";
import CampaignPieChart from "./components/CampaignPieChart";
import CampaignHistoryTable from "./components/CampaignHistoryTable";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Stats Cards Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          System Overview
        </h2>
        <StatsCards />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Analytics Dashboard
        </h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <CampaignPieChart />
          </div>
          <div className="flex-1">
            <WeeklyChart />
          </div>
        </div>
      </div>

      {/* Additional Charts Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <WeeklyCampaignsChart />
          </div>
          <div className="flex-1">
            <CallStatusChart />
          </div>
        </div>
      </div>

      {/* Campaign History Table Section */}
      <div className="mb-8">
        <CampaignHistoryTable />
      </div>
    </div>
  );
};

export default Home;
