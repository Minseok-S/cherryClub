"use client";
import { AuthForm } from "@/src/features/auth";
import { useAuth } from "@/src/features/auth/model/model";
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

export default function CherryApplicationsPage() {
  const [data, setData] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    isAuthenticated,
    loading,
    user,
    error,
    handleAuthSubmit,
    handleLogout,
  } = useAuth();

  // 신청자 데이터 가져오기
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/application/cherry_club?authority=${user.authority}&region=${user.region}&university=${user.university}`
          );
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error("Error fetching applications:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated, user]);

  // 상태 변경 핸들러 추가
  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/application/cherry_club?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setData((prevData) =>
          prevData.map((item) => (item.id === id ? { ...item, status } : item))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthForm onSubmit={handleAuthSubmit} error={error} loading={loading} />
    );
  }

  // 필터링된 데이터 계산
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            로그아웃
          </button>
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
