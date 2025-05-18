import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

export const PrivateRoute = () => {
  const { isAuthenticated, user } = useAuthContext();

  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated && user && !user.address) {
    return <Navigate to="/signup/address" replace />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
