"use client";
import { useEffect, useState } from "react";

interface Application {
  id: number;
  name: string;
  phone: string;
  university: string;
  created_at: string;
  region: string;
}

export default function AdminPage() {
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [authCode, setAuthCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/validate-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: authCode }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error("인증 실패");

      setIsAuthenticated(true);
      setUserName(result.userName || "관리자");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const response = await fetch("/api/applications", {
          headers: {
            Authorization: `Bearer ${authCode}`,
          },
        });

        if (!response.ok) throw new Error("데이터 조회 실패");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="p-4 max-w-md mx-auto mt-20">
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <input
            type="password"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            className="w-full p-2 rounded text-black"
            placeholder="관리자 인증 코드 입력"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            인증
          </button>
        </form>
      </div>
    );
  }

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">신청자 관리</h1>
        <div className="text-gray-400">{userName}님 안녕하세요 👋</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-6 py-3 text-left text-white">ID</th>
              <th className="px-6 py-3 text-left text-white">이름</th>
              <th className="px-6 py-3 text-left text-white">연락처</th>
              <th className="px-6 py-3 text-left text-white">대학교</th>
              <th className="px-6 py-3 text-left text-white">지역</th>
              <th className="px-6 py-3 text-left text-white">신청일시</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t border-gray-700">
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.phone}</td>
                <td className="px-6 py-4">{item.university}</td>
                <td className="px-6 py-4">{item.region}</td>
                <td className="px-6 py-4">
                  {new Date(item.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
