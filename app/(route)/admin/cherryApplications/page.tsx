"use client";
import { useEffect, useState } from "react";

interface Application {
  id: number;
  name: string;
  gender: string;
  phone: string;
  birthday: string;
  region: string;
  university: string;
  major: string;
  student_id: string;
  grade: string;
  created_at: string;
  message: string;
  status: string;
}

export default function AdminPage() {
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [authority, setAuthority] = useState(0);
  const [region, setRegion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
        throw new Error(
          `관리자 인증 실패 (${response.status} ${response.statusText}): ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();
      setIsAuthenticated(true);
      setUserName(result.userName);
      setAuthority(result.authority || 10);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/application/cherry_club?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
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
          `/api/application/cherry_club?authority=${authority}&userName=${encodeURIComponent(
            userName
          )}&region=${encodeURIComponent(region)}`,
          {
            headers: {
              Authorization: `Bearer ${password}`,
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
  }, [isAuthenticated, password, authority, region, userName]);

  // 필터링된 데이터 계산
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  //TODO: 보여줄 값 확인
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
        </form>
      </div>
    );
  }

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;

  return (
    <div className="p-4 mx-24 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">신청자 관리</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="검색"
              className="p-2 pl-10 rounded bg-gray-800 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="text-gray-400">{userName}님 안녕하세요 👋</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-6 py-3 text-center text-white">이름</th>
              <th className="px-6 py-3 text-center text-white">성별</th>
              <th className="px-6 py-3 text-center text-white">연락처</th>
              <th className="px-6 py-3 text-center text-white">생년월일</th>
              <th className="px-6 py-3 text-center text-white">지역</th>
              <th className="px-6 py-3 text-center text-white">대학교</th>
              <th className="px-6 py-3 text-center text-white">전공</th>
              <th className="px-6 py-3 text-center text-white">학번</th>
              <th className="px-6 py-3 text-center text-white">학년</th>
              <th className="px-6 py-3 text-center text-white">신청서</th>
              <th className="px-6 py-3 text-center text-white">신청일시</th>
              <th className="px-6 py-3 text-center text-white">상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-4">
                  검색 결과가 없습니다
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t border-gray-700 ${
                    item.status === "PENDING"
                      ? "bg-blue-900/50 hover:bg-blue-800/50"
                      : item.status === "PROCESSING"
                      ? "bg-yellow-900/50 hover:bg-yellow-800/50"
                      : item.status === "APPROVED"
                      ? "bg-green-900/50 hover:bg-green-800/50"
                      : "bg-red-900/50 hover:bg-red-800/50"
                  }`}
                >
                  <td className="px-6 py-4 text-center">{item.name}</td>
                  <td className="px-6 py-4 text-center">{item.gender}</td>
                  <td className="px-6 py-4 text-center">{item.phone}</td>
                  <td className="px-6 py-4 text-center">{item.birthday}</td>
                  <td className="px-6 py-4 text-center">{item.region}</td>
                  <td className="px-6 py-4 text-center">{item.university}</td>
                  <td className="px-6 py-4 text-center">{item.major}</td>
                  <td className="px-6 py-4 text-center">{item.student_id}</td>
                  <td className="px-6 py-4 text-center">{item.grade}</td>
                  <td className="px-6 py-4 text-center">{item.message}</td>
                  <td className="px-6 py-4 text-center">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
                    >
                      <option value="PENDING">신청</option>
                      <option value="PROCESSING">진행</option>
                      <option value="APPROVED">참여</option>
                      <option value="REJECTED">포기</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
