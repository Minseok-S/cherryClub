"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [authority, setAuthority] = useState(0);
  const [error, setError] = useState("");

  // 페이지 로드 시 토큰 확인
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        try {
          const response = await fetch("/api/verifyToken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const result = await response.json();
            setIsAuthenticated(true);
            setUserName(result.userName);
            setAuthority(result.authority || 10);
          }
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "잘못된 인증 코드입니다");
        throw new Error(
          `관리자 인증 실패 (${response.status} ${response.statusText}): ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();
      console.log("Auth response:", result);

      setIsAuthenticated(true);
      setUserName(result.userName);
      setAuthority(result.authority || 10);

      // 토큰 저장
      const tokenData = {
        token: result.token, // JWT 토큰
        expiresAt: new Date().getTime() + 30 * 60 * 1000,
      };
      localStorage.setItem("adminToken", JSON.stringify(tokenData));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 max-w-md mx-auto mt-20">
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded text-black"
            placeholder="관리자 인증 코드 입력"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            인증
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
      </div>
    );
  }

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;
}
