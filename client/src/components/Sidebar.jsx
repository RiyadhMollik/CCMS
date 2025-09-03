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
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, loading } = useLogout();
  const { authUser, rolePermission } = useContext(AuthContext);

  const toggleRegistration = () => {
    setIsRegistrationOpen(!isRegistrationOpen);
  };

  const toggleFeedback = () => {
    setIsFeedbackOpen(!isFeedbackOpen);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    // Close all sub-menus when collapsing
    if (!isCollapsed) {
      setIsRegistrationOpen(false);
      setIsFeedbackOpen(false);
      setIsSettingsOpen(false);
    }
  };
  return (
    <ul className={`menu bg-emerald-900 text-white rounded-r-2xl min-h-full ${isCollapsed ? 'w-18' : 'w-64'} space-y-3 overflow-y-auto scrollbar-hide transition-all duration-300`}>
      
      {/* Header Section - Logo and Collapse Button */}
      <div className={`sticky top-0 bg-emerald-900 z-10 pb-2 ${isCollapsed ? 'flex justify-center' : 'flex flex-col'}`}>
        {/* Full mode: Logo and collapse button in row */}
        {!isCollapsed && (
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex flex-col items-center flex-1">
              <img src={logo} className="w-16" alt="Logo" />
              <h1 className="font-bold text-sm">BRRI</h1>
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
          className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <HomeIcon className={`w-5 h-5 ${!isCollapsed ? 'mr-2' : ''}`} />
          {!isCollapsed && "Dashboard"}
        </NavLink>
      </li>

      {/* Registration Menu - Show only if user has any registration permissions */}
      {(rolePermission?.["AD List"] ||
        rolePermission?.["DD List"] ||
        rolePermission?.["UAO List"] ||
        rolePermission?.["SAAO List"] ||
        rolePermission?.["Farmer List"] ||
        rolePermission?.["Scientist List"] ||
        rolePermission?.["Journalist List"]) && (
        <li className="text-base font-medium">
          <button
            onClick={isCollapsed ? undefined : toggleRegistration}
            className={`flex items-center w-full px-4 py-2 text-left hover:bg-emerald-800 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "Registration" : ""}
          >
            <ClipboardDocumentListIcon className={`w-5 h-5 ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && (
              <>
                Registration
                {isRegistrationOpen ? (
                  <ChevronDownIcon className="w-4 h-4 ml-auto" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 ml-auto" />
                )}
              </>
            )}
          </button>
        </li>
      )}

      {isRegistrationOpen && !isCollapsed && (
        <>
          {rolePermission?.["AD List"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/ad-registration"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                AD Registration
              </NavLink>
            </li>
          )}
          {rolePermission?.["DD List"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/admin-registration"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Admin Registration
              </NavLink>
            </li>
          )}
          {rolePermission?.["UAO List"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/uao-registration"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                UAO Registration
              </NavLink>
            </li>
          )}
          {rolePermission?.["SAAO List"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/saao-registration"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                SAAO Registration
              </NavLink>
            </li>
          )}
          {rolePermission?.["Farmer List"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/farmer-registration"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Farmer Registration
              </NavLink>
            </li>
          )}
          {rolePermission?.["Scientist List"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/scientist-registration"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Scientist Registration
              </NavLink>
            </li>
          )}
          {rolePermission?.["Journalist List"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/journalists-registration"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Journalists Registration
              </NavLink>
            </li>
          )}
        </>
      )}

      {/* Feedback Menu - Show only if user has feedback permissions */}
      {(rolePermission?.["Send Feedback"] ||
        rolePermission?.["Feedback Table"]) && (
        <li className="text-base font-medium">
          <button
            onClick={isCollapsed ? undefined : toggleFeedback}
            className={`flex items-center w-full px-4 py-2 text-left hover:bg-emerald-800 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "Feedback" : ""}
          >
            <ChatBubbleLeftRightIcon className={`w-5 h-5 ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && (
              <>
                Feedback
                {isFeedbackOpen ? (
                  <ChevronDownIcon className="w-4 h-4 ml-auto" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 ml-auto" />
                )}
              </>
            )}
          </button>
        </li>
      )}

      {isFeedbackOpen && !isCollapsed && (
        <>
          {rolePermission?.["Send Feedback"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/send-feedback"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Send
              </NavLink>
            </li>
          )}
          {rolePermission?.["Feedback Table"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/feedback"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                User Feedbacks
              </NavLink>
            </li>
          )}
        </>
      )}

      <li className="text-base font-medium">
        <NavLink 
          to="/about"
          className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "About" : ""}
        >
          <InformationCircleIcon className={`w-5 h-5 ${!isCollapsed ? 'mr-2' : ''}`} />
          {!isCollapsed && "About"}
        </NavLink>
      </li>

      {/* Settings Menu - Show only if user has settings permissions or is not SAAO */}
      {authUser?.role?.toLowerCase() === "saao" ? (
        <li className="text-base font-medium">
          <NavLink 
            to="/update-password"
            className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "Change Password" : ""}
          >
            <Cog6ToothIcon className={`w-5 h-5 ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && "Change Password"}
          </NavLink>
        </li>
      ) : (
        (rolePermission?.["Add Region"] ||
          rolePermission?.["Add Hotspot"] ||
          rolePermission?.["Add Division"] ||
          rolePermission?.["Add District"] ||
          rolePermission?.["Add Upazela"] ||
          rolePermission?.["Add Union"] ||
          rolePermission?.["Add Block"] ||
          rolePermission?.["Add User"] ||
          rolePermission?.["Change Password"] ||
          rolePermission?.["Roles"] ||
          rolePermission?.["Permissions"]) && (
          <li className="text-base font-medium">
            <button
              onClick={isCollapsed ? undefined : toggleSettings}
              className={`flex items-center w-full px-4 py-2 text-left hover:bg-emerald-800 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? "Settings" : ""}
            >
              <Cog6ToothIcon className={`w-5 h-5 ${!isCollapsed ? 'mr-2' : ''}`} />
              {!isCollapsed && (
                <>
                  Settings
                  {isSettingsOpen ? (
                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4 ml-auto" />
                  )}
                </>
              )}
            </button>
          </li>
        )
      )}

      {isSettingsOpen && authUser?.role?.toLowerCase() !== "saao" && !isCollapsed && (
        <>
          {rolePermission?.["Add Region"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/region"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Add Region
              </NavLink>
            </li>
          )}
          {rolePermission?.["Add Hotspot"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/hotspot"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Add Hotspot
              </NavLink>
            </li>
          )}
          {rolePermission?.["Add Division"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/division"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Add Division
              </NavLink>
            </li>
          )}
          {rolePermission?.["Add District"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/district"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Add District
              </NavLink>
            </li>
          )}
          {rolePermission?.["Add Upazela"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/upazila"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Add Upazila
              </NavLink>
            </li>
          )}
          {rolePermission?.["Add Union"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/union"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Add Union
              </NavLink>
            </li>
          )}
          {rolePermission?.["Add Block"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/block"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Add Block
              </NavLink>
            </li>
          )}
          {rolePermission?.["Add User"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/user"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Add User
              </NavLink>
            </li>
          )}
          {rolePermission?.["Change Password"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/update-password"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Change Password
              </NavLink>
            </li>
          )}
          {rolePermission?.["Roles"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/roles"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Role
              </NavLink>
            </li>
          )}
          {rolePermission?.["Permissions"] && (
            <li className="text-sm font-medium pl-4">
              <NavLink
                to="/role-permission"
                className="flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors duration-200 border-l-2 border-emerald-400 ml-2"
              >
                Role Permission
              </NavLink>
            </li>
          )}
        </>
      )}

      {rolePermission?.["Profile"] && (
        <li className="text-base font-medium">
          <NavLink 
            to="/profile"
            className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "Profile" : ""}
          >
            <UserCircleIcon className={`w-5 h-5 ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && "Profile"}
          </NavLink>
        </li>
      )}

      <li>
        <button
          onClick={logout}
          disabled={loading}
          className={`text-base font-medium flex items-center ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Log out" : ""}
        >
          <ArrowRightOnRectangleIcon className={`w-5 h-5 ${!isCollapsed ? 'mr-2' : ''}`} />
          {!isCollapsed && "Log out"}
        </button>
      </li>
    </ul>
  );
};

export default Sidebar;
