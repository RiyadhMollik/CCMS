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
                Call Center Management System
              </h1>
            </div>
            <div className="md:hidden">
              <h1 className="font-bold text-[#084420] text-lg">
                CCMS
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            {/* <p className="font-medium">data 1</p> */}
            <div>
              <img
                src={logo}
                alt="Profile"
                className="w-12 h-12 rounded-full border"
              />
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="p-4 flex-1 lg:ml-3">
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
