import { useEffect, useState } from "react";
import { login } from "../api/loginApi";
import { verifyToken } from "../api/verifyTokenApi";
import { User } from "./types";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("loginToken");
      if (token) {
        try {
          const result = await verifyToken(token);
          setIsAuthenticated(true);
          setUser({
            userName: result.userName,
            authority: result.authority,
            region: result.region,
            university: result.university,
          });
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSubmit = async (password: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await login(password);
      setIsAuthenticated(true);
      setUser({
        userName: result.userName,
        authority: result.authority,
        region: result.region,
        university: result.university,
      });
      localStorage.setItem(
        "loginToken",
        JSON.stringify({
          token: result.token,
          expiresAt: new Date().getTime() + 30 * 60 * 1000,
        })
      );
    } catch (err) {
      setError("잘못된 인증 코드입니다");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loginToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    loading,
    isAuthenticated,
    user,
    error,
    handleAuthSubmit,
    handleLogout,
  };
};
