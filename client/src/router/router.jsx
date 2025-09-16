import { createBrowserRouter } from "react-router";
import AdminProtected from "./AdminProtected";
import DashboardLayout from "../Layout/DashboardLayout";
import Login from "../Pages/Login/Login";
// import DashboardHome from "../Pages/DashboardHome/DashboardHome";
// import AWS from "../Pages/AWS/AWS";
import VcSms from "../Pages/VcSms/VcSms";

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
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);
export default router;
