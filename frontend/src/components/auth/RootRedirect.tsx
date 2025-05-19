import { useAuthContext } from "@/context/auth.context";
import { Navigate } from "react-router-dom";
import LandingPage from "@/pages/landing";
import Home from "@/pages/home";

export const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthContext();

  if (isAuthenticated === null || (isAuthenticated && user === null))
    return null;

  if (!isAuthenticated) return <LandingPage />;
  if (!user?.address) return <Navigate to="/signup/address" replace />;

  return <Home />;
};
