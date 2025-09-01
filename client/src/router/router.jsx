import { createBrowserRouter } from "react-router";
import AdminProtected from "./AdminProtected";
import DashboardLayout from "../Layout/DashboardLayout";
import Login from "../Pages/Login/Login";
import DashboardHome from "../Pages/DashboardHome/DashboardHome";

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
        Component: DashboardHome,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);
export default router;
