/* eslint-disable react/no-unescaped-entities */

import { useContext } from "react";
import { AuthContext } from "../components/context/AuthProvider";
import { Navigate } from "react-router";

const AdminProtected = ({ children }) => {
  const { authUser, loadingUser } = useContext(AuthContext);
  if (loadingUser) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-ring loading-xs"></span>
        <span className="loading loading-ring loading-sm"></span>
        <span className="loading loading-ring loading-md"></span>
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }
  if (authUser) {
    return children;
  }
  return <Navigate state={location.pathname} to="/login"></Navigate>;
};
export default AdminProtected;
