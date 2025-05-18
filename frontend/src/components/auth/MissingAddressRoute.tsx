import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

export const MissingAddressRoute = () => {
  const { isAuthenticated, user } = useAuthContext();

  if (isAuthenticated === null || user === null) return null;

  const hasAddress = !!user.address;

  return !hasAddress ? <Outlet /> : <Navigate to="/" replace />;
};