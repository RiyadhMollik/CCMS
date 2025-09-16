import React, { useState, useContext } from "react";
import { NavLink } from "react-router";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  PaperAirplaneIcon,
  BanknotesIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline"; // Outline icons
import logo from "/logo.png";
import useLogout from "./Hook/useLogout";
import { AuthContext } from "./context/AuthProvider";

const Sidebar = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, loading } = useLogout();
  const { authUser, rolePermission } = useContext(AuthContext);

  const toggleFeedback = () => {
    setIsFeedbackOpen(!isFeedbackOpen);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setIsFeedbackOpen(false);
      setIsSettingsOpen(false);
    }
  };
  return (
    <ul
      className={`menu bg-emerald-900 text-white rounded-r-2xl min-h-full ${
        isCollapsed ? "w-18" : "w-64"
      } space-y-3 overflow-y-auto scrollbar-hide transition-all duration-300`}
    >
      {/* Header Section - Logo and Collapse Button */}
      <div
        className={`sticky top-0 bg-emerald-900 z-10 pb-2 ${
          isCollapsed ? "flex justify-center" : "flex flex-col"
        }`}
      >
        {/* Full mode: Logo and collapse button in row */}
        {!isCollapsed && (
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex flex-col items-center flex-1">
              <img src={logo} className="w-16" alt="Logo" />
              <h1 className="font-bold text-sm mt-4">CCMS</h1>
              <p className="text-xs text-center my-2">Call Center Management System</p>
            </div>
            <button
              onClick={toggleCollapse}
              className="p-1 hover:bg-emerald-800 rounded-lg transition-colors duration-200 ml-2"
              title="Collapse sidebar"
            >
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Collapsed mode: Only collapse button */}
        {isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="p-2 hover:bg-emerald-800 rounded-lg transition-colors duration-200"
            title="Expand sidebar"
          >
            <ChevronDoubleRightIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <hr className="border-gray-400" />

      {/* Menu Items */}
      <li className="text-base font-medium">
        <NavLink
          to="/"
          end
          className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <HomeIcon className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""}`} />
          {!isCollapsed && "Dashboard"}
        </NavLink>
      </li>

       <li className="text-base font-medium">
        <NavLink
          to="/about"
          className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "About" : ""}
        >
          <InformationCircleIcon
            className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""}`}
          />
          {!isCollapsed && "Data Analytics"}
        </NavLink>
      </li>

      <li className="text-base font-medium">
        <NavLink
          to="/about"
          className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "About" : ""}
        >
          <InformationCircleIcon
            className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""}`}
          />
          {!isCollapsed && "About"}
        </NavLink>
      </li>

      <li>
        <button
          onClick={logout}
          disabled={loading}
          className={`text-base font-medium flex items-center ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Log out" : ""}
        >
          <ArrowRightOnRectangleIcon
            className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""}`}
          />
          {!isCollapsed && "Log out"}
        </button>
      </li>
    </ul>
  );
};

export default Sidebar;
