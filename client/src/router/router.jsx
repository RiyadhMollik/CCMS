import { createBrowserRouter } from "react-router";
import AdminProtected from "./AdminProtected";
import DashboardLayout from "../Layout/DashboardLayout";
import Login from "../Pages/Login/Login";
// import DashboardHome from "../Pages/DashboardHome/DashboardHome";
import AWS from "../Pages/AWS/AWS";
import HistoricalData from "../Pages/HistoricalData/HistoricalData";
import VcSms from "../Pages/VcSms/VcSms";
import CdrTable from "../Pages/DataAnalytics/CdrTable";
import About from "../Pages/About/About";
import Home from "../Pages/CCVS/home";
import CISTable from "../components/CISTable";
import AddData from "../Pages/AddData/AddData";
import ViewData from "../Pages/ViewData/ViewData";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AdminProtected>
        <DashboardLayout />
      </AdminProtected>
    ),
    children: [
      {
        index: true,
        Component: VcSms,
      },
      {
        path: "/data-analytics",
        Component: CdrTable,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/aws",
        Component: AWS,
      },
      {
        path: "/historical-data",
        Component: HistoricalData,
      },
      {
        path: "/cis-table",
        Component:CISTable
      },
      {
        path: "/ccvs",
        Component: Home,
      },
      {
        path: "/add-data",
        Component: AddData,
      },
      {
        path: "/view-data",
        Component: ViewData,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);
export default router;
