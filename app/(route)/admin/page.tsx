"use client";
import { useEffect, useState } from "react";

interface Application {
  id: number;
  name: string;
  gender: string;
  phone: string;
  birthdate: string;
  region: string;
  university: string;
  major: string;
  student_id: string;
  grade: string;
  created_at: string;
  status: string;
}

export default function AdminPage() {
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [authCode, setAuthCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [authority, setAuthority] = useState(0);
  const [region, setRegion] = useState("");

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `관리자 인증 실패 (${response.status} ${response.statusText}): ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();
      setIsAuthenticated(true);
      setUserName(result.userName || "관리자");
      setAuthority(result.authority || 0);
      setRegion(result.region || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCode}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("상태 업데이트 실패");

      // Update local data
      setData(
        data.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/applications?authority=${authority}&userName=${encodeURIComponent(
            userName
          )}&region=${encodeURIComponent(region)}`,
          {
            headers: {
              Authorization: `Bearer ${authCode}`,
            },
          }
        );

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
              <th className="px-6 py-3 text-left text-white">성별</th>
              <th className="px-6 py-3 text-left text-white">연락처</th>
              <th className="px-6 py-3 text-left text-white">생년월일</th>
              <th className="px-6 py-3 text-left text-white">지역</th>
              <th className="px-6 py-3 text-left text-white">대학교</th>
              <th className="px-6 py-3 text-left text-white">전공</th>
              <th className="px-6 py-3 text-left text-white">학번</th>
              <th className="px-6 py-3 text-left text-white">학년</th>
              <th className="px-6 py-3 text-left text-white">신청일시</th>
              <th className="px-6 py-3 text-left text-white">상태</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t border-gray-700">
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.gender}</td>
                <td className="px-6 py-4">{item.phone}</td>
                <td className="px-6 py-4">{item.birthdate}</td>
                <td className="px-6 py-4">{item.region}</td>
                <td className="px-6 py-4">{item.university}</td>
                <td className="px-6 py-4">{item.major}</td>
                <td className="px-6 py-4">{item.student_id}</td>
                <td className="px-6 py-4">{item.grade}</td>
                <td className="px-6 py-4">
                  {new Date(item.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value)
                    }
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
                  >
                    <option value="신청 완료">신청</option>
                    <option value="연락 완료">진행</option>
                    <option value="동아리 개설">완료</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
