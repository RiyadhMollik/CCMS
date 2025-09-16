import React, { useRef, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo2.png";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Navbar */}
        <div className="navbar w-full bg-base-100 shadow px-4">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="text-lg md:text-2xl font-medium flex-1">
            <div className="hidden md:block">
              <h1 className="font-bold bg-gradient-to-r from-[#084420] to-[#82cd20] bg-clip-text text-transparent text-xl md:text-2xl">
                Welcome to Call Center Management System Dashboard
              </h1>
            </div>
            <div className="md:hidden">
              <h1 className="font-bold text-[#084420] text-lg">
                CCMS
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <a
              href="tel:09644300300"
              className="font-semibold text-green-800 bg-white border border-green-400 px-3 py-1.5 rounded-md shadow-sm hover:bg-green-50 hover:border-green-600 focus:ring-2 focus:ring-green-300 transition-all duration-150 outline-none cursor-pointer flex items-center gap-2"
              title="Call Helpline"
            >
              Helpline: 09644300300
            </a>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
