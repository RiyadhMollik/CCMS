import { createBrowserRouter } from "react-router";
import AdminProtected from "./AdminProtected";
import DashboardLayout from "../Layout/DashboardLayout";
import Login from "../Pages/Login/Login";

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
        element: <div>Dashboard Home</div>,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);
export default router;
