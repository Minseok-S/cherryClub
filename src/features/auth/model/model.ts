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
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const result = await verifyToken(token);

          console.log("result", result.error);

          // 토큰 만료 여부 확인
          if (result.error) {
            handleLogout();
            return;
          }

          setIsAuthenticated(true);
          setUser({
            userName: result.userName,
            authority: result.authority,
            region: result.region,
            university: result.university,
          });
        } catch (err) {
          console.error(err);
          handleLogout(); // 토큰 검증 실패 시 로그아웃 처리
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSubmit = async (phone: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await login(phone, password);

      if (!result || !result.userName) {
        throw new Error("사용자 정보가 일치하지 않습니다");
      }

      if (result.authority === 10) {
        throw new Error("접근 권한이 없습니다");
      }

      setIsAuthenticated(true);
      setUser({
        userName: result.userName,
        authority: result.authority,
        region: result.region,
        university: result.university,
      });
      localStorage.setItem(
        "authToken",
        JSON.stringify({
          token: result.token,
          expiresAt: new Date().getTime() + 30 * 60 * 1000,
        })
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.message || "로그인에 실패했습니다. 정보를 다시 확인해주세요."
        );
      } else {
        setError("알 수 없는 오류가 발생했습니다");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
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
