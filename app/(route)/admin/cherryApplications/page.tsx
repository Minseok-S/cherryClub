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
  [key: string]: any;
}

export default function CherryApplicationsPage() {
  const [data, setData] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Application | null>(
    null
  );

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

          // 데이터에서 고유한 지역 추출 (타입 명시)
          const regions: string[] = [
            ...new Set<string>(result.map((item: Application) => item.region)),
          ];
          setAvailableRegions(regions);
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

  // 신청서 클릭 핸들러 수정
  const handleMessageClick = (application: Application) => {
    setSelectedMessage(application);
  };

  if (!isAuthenticated) {
    return (
      <AuthForm onSubmit={handleAuthSubmit} error={error} loading={loading} />
    );
  }

  // 필터링된 데이터 계산
  const filteredData = data.filter((item) => {
    // 날짜 범위 필터링
    if (dateRange.start && dateRange.end) {
      const itemDate = new Date(item.created_at);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      if (itemDate < startDate || itemDate > endDate) {
        return false;
      }
    }

    // 검색어가 있으면 모든 필드에서 검색
    if (searchTerm) {
      const searchableFields = Object.values(item)
        .filter((value) => typeof value === "string")
        .map((value) => value.toLowerCase());

      if (
        !searchableFields.some((field) =>
          field.includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }
    }

    // 개별 필터링
    return Object.entries(filters).every(([key, filterValue]) => {
      if (filterValue && item[key] !== filterValue) {
        return false;
      }
      return true;
    });
  });

  // 필터 변경 핸들러
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === "all" ? "" : value,
    }));
  };

  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (type: "start" | "end", value: string) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <div className="p-4 mx-24 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">신청자 관리</h1>
          <p className="text-sm text-gray-400 mt-1">
            각 셀을 클릭시 상세한 정보 확인이 가능합니다.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
        <div className="space-y-1 col-span-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            성별
          </label>
          <div className="relative">
            <select
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700 cursor-pointer"
            >
              <option value="all">전체 보기</option>
              <option value="남">남성</option>
              <option value="여">여성</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-1 col-span-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            지역
          </label>
          <div className="relative">
            <select
              onChange={(e) => handleFilterChange("region", e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700 cursor-pointer"
            >
              <option value="all">전체 지역</option>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-1 col-span-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            상태
          </label>
          <div className="relative">
            <select
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700 cursor-pointer"
            >
              <option value="all">모든 상태</option>
              <option value="PENDING">신청 대기</option>
              <option value="PROCESSING">진행 중</option>
              <option value="APPROVED">참여 확정</option>
              <option value="REJECTED">참여 포기</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-1 col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            날짜 범위
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="date"
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700"
                value={dateRange.start}
                onChange={(e) => handleDateRangeChange("start", e.target.value)}
              />
            </div>
            <span className="text-gray-400 self-center">~</span>
            <div className="relative flex-1">
              <input
                type="date"
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange("end", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="space-y-1 col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            검색
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="이름, 전공, 학번 등으로 검색"
              className="p-2 pl-10 rounded-lg bg-gray-800 border border-gray-600 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-6 py-3 text-center text-white">no.</th>
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
                <td colSpan={12} className="text-center py-4">
                  검색 결과가 없습니다
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-t border-gray-700 cursor-pointer ${
                    item.status === "PENDING"
                      ? "bg-blue-900/50 hover:bg-blue-800/50"
                      : item.status === "PROCESSING"
                      ? "bg-yellow-900/50 hover:bg-yellow-800/50"
                      : item.status === "APPROVED"
                      ? "bg-green-900/50 hover:bg-green-800/50"
                      : "bg-red-900/50 hover:bg-red-800/50"
                  }`}
                  onClick={() => handleMessageClick(item)}
                >
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4 text-center">{item.name}</td>
                  <td className="px-6 py-4 text-center">{item.gender}</td>
                  <td className="px-6 py-4 text-center">{item.phone}</td>
                  <td className="px-6 py-4 text-center">{item.birthday}</td>
                  <td className="px-6 py-4 text-center">{item.region}</td>
                  <td className="px-6 py-4 text-center">{item.university}</td>
                  <td className="px-6 py-4 text-center">{item.major}</td>
                  <td className="px-6 py-4 text-center">{item.student_id}</td>
                  <td className="px-6 py-4 text-center">{item.grade}</td>
                  <td className="px-6 py-4 text-center ">
                    {item.message.length > 10
                      ? `${item.message.substring(0, 10)}...`
                      : item.message}
                  </td>
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

      {/* 모달 수정 */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">신청자 상세 정보</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">이름</p>
                <p>{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-gray-400">성별</p>
                <p>{selectedMessage.gender}</p>
              </div>
              <div>
                <p className="text-gray-400">연락처</p>
                <p>{selectedMessage.phone}</p>
              </div>
              <div>
                <p className="text-gray-400">생년월일</p>
                <p>{selectedMessage.birthday}</p>
              </div>
              <div>
                <p className="text-gray-400">지역</p>
                <p>{selectedMessage.region}</p>
              </div>
              <div>
                <p className="text-gray-400">대학교</p>
                <p>{selectedMessage.university}</p>
              </div>
              <div>
                <p className="text-gray-400">전공</p>
                <p>{selectedMessage.major}</p>
              </div>
              <div>
                <p className="text-gray-400">학번</p>
                <p>{selectedMessage.student_id}</p>
              </div>
              <div>
                <p className="text-gray-400">학년</p>
                <p>{selectedMessage.grade}</p>
              </div>
              <div>
                <p className="text-gray-400">신청일시</p>
                <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">상태</p>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => {
                    handleStatusChange(selectedMessage.id, e.target.value);
                    setSelectedMessage({
                      ...selectedMessage,
                      status: e.target.value,
                    });
                  }}
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                >
                  <option value="PENDING">신청</option>
                  <option value="PROCESSING">진행</option>
                  <option value="APPROVED">참여</option>
                  <option value="REJECTED">포기</option>
                </select>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">신청서 내용</p>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMessage(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
