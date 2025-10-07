import { createBrowserRouter } from "react-router";
import AdminProtected from "./AdminProtected";
import DashboardLayout from "../Layout/DashboardLayout";
import Login from "../Pages/Login/Login";
// import DashboardHome from "../Pages/DashboardHome/DashboardHome";
import AWS from "../Pages/AWS/AWS";
import VcSms from "../Pages/VcSms/VcSms";
import CdrTable from "../Pages/DataAnalytics/CdrTable";
import About from "../Pages/About/About";
import Home from "../Pages/CCVS/home";
import CISTable from "../components/CISTable";

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
        path: "/cis-table",
        Component:CISTable
      },
      {
        path: "/ccvs",
        Component: Home,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);
export default router;
