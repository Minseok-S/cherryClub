"use client";
import { useEffect, useState } from "react";

interface Application {
  id: number;
  name: string;
  gender: string;
  phone: string;
  university: string;
  major: string;
  is_campus_participant: string;
  created_at: string;
  status: number;
}

export default function AdminClubPage() {
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [authCode, setAuthCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
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
        const response = await fetch(`/api/club-users`, {
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
  }, [isAuthenticated, authCode]);

  // 필터링된 데이터 계산
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
    <div className="p-4 mx-24 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">체리동아리 멤버 관리</h1>
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
              <th className="px-6 py-3 text-center text-white">대학교</th>
              <th className="px-6 py-3 text-center text-white">전공</th>
              <th className="px-6 py-3 text-center text-white">
                비전캠프 기수
              </th>
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
                    item.status == 1
                      ? "bg-blue-900/50 hover:bg-blue-800/50"
                      : "bg-red-900/50 hover:bg-red-800/50"
                  }`}
                >
                  <td className="px-6 py-4 text-center">{item.name}</td>
                  <td className="px-6 py-4 text-center">
                    {" "}
                    {item.gender === "M" ? "남" : "여"}
                  </td>
                  <td className="px-6 py-4 text-center">{item.phone}</td>
                  <td className="px-6 py-4 text-center">{item.university}</td>
                  <td className="px-6 py-4 text-center">{item.major}</td>
                  <td className="px-6 py-4 text-center">
                    {item.is_campus_participant}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={item.status}
                      className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
                      onChange={async (e) => {
                        const newStatus = Number(e.target.value);
                        try {
                          const response = await fetch(`/api/club-users`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${authCode}`,
                            },
                            body: JSON.stringify({
                              id: item.id,
                              status: newStatus,
                            }),
                          });

                          if (response.ok) {
                            // 상태 업데이트
                            setData((prevData) =>
                              prevData.map((prevItem) =>
                                prevItem.id === item.id
                                  ? { ...prevItem, status: newStatus }
                                  : prevItem
                              )
                            );
                          }
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                    >
                      <option value={1}>진행</option>
                      <option value={0}>포기</option>
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
