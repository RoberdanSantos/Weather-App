import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  login as userLogin,
  register as registerRequest,
  getProfile,
} from "@/lib/api";
import { AuthContextType, User } from "@/types/auth-types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("weather@token");
    const expiry = localStorage.getItem("weather@token_expiry");

    if (token && expiry && Date.now() < Number(expiry)) {
      setIsAuthenticated(true);
      getProfile()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
        });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await userLogin(email, password);
    const { access_token } = res.data;

    localStorage.setItem("weather@token", access_token);
    localStorage.setItem(
      "weather@token_expiry",
      `${Date.now() + 1000 * 60 * 60 * 24}`,
    );

    const profile = await getProfile();
    setIsAuthenticated(true);
    setUser(profile.data);
    navigate(profile.data.address ? "/" : "/signup/address");
  };

  const logout = () => {
    localStorage.removeItem("weather@token");
    localStorage.removeItem("weather@token_expiry");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const register = async (data: any): Promise<string> => {
    const res = await registerRequest(data);
    const { access_token, id } = res.data;

    localStorage.setItem("weather@token", access_token);
    localStorage.setItem(
      "weather@token_expiry",
      `${Date.now() + 1000 * 60 * 60 * 24}`,
    );

    const profile = await getProfile();
    setIsAuthenticated(true);
    setUser(profile.data);
    return id;
  };

  const fetchUser = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      logout();
    }
  };

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, register, user, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
