import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

export const PublicRoute = () => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated === null) return null;

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
