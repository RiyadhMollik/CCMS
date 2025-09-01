import React from 'react';
import DashboardStats from '../../components/DashboardStats';

const DashboardHome = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                
            </div>

            {/* Dashboard Stats Cards */}
            <DashboardStats />

            {/* Additional Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                    <div className="text-gray-500">
                        <p>Activities and updates will be displayed here...</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                    <div className="text-gray-500">
                        <p>System health and status information...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;