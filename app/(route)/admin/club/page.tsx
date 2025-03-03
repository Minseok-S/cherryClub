"use client";
import { useAuth } from "@/src/features/auth/model/model";
import { useEffect, useState } from "react";
import { AdminMenu } from "@/src/widgets/AdminMenu";

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
  [key: string]: string | number;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20; // 한 페이지당 표시할 항목 수

  const { isAuthenticated, user, handleLogout } = useAuth();

  const handleLogoutAndRedirect = () => {
    handleLogout();
    window.location.href = "/admin";
  };

  // 신청자 데이터 가져오기
  useEffect(() => {
    console.log("user", user);

    if (isAuthenticated && user) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/club-users?authority=${user.authority}&region=${user.region}&university=${user.university}&page=${currentPage}&limit=${limit}`
          );
          const result = await response.json();
          setData(result.data);
          setTotalPages(result.pagination.totalPages);

          console.log("result", result);

          // 데이터에서 고유한 지역 추출 (타입 명시)
          const regions: string[] = [
            ...new Set<string>(
              result.data.map((item: Application) => item.region)
            ),
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
  }, [isAuthenticated, user, currentPage]); // currentPage가 변경될 때마다 데이터 다시 가져오기

  // 상태 변경 핸들러 추가
  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch(
        `/api/club-users?id=${id}&status=${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        setData((prevData) =>
          prevData.map((item) => (item.id === id ? { ...item, status } : item))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (isLoading) {
    return <div> 로딩중..</div>;
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
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      [field]: value === "all" ? "" : value,
    }));
  };

  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (type: "start" | "end", value: string) => {
    setCurrentPage(1);
    setDateRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    setSearchTerm(value);
  };

  // 모바일용 페이징 컨트롤 수정
  const PaginationControls = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm py-2 z-40">
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
        >
          이전
        </button>
        <span className="px-3 py-1 bg-gray-800 text-white text-sm">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
        >
          다음
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 mx-2 sm:mx-24 bg-black text-white pb-20">
      <AdminMenu />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            체리 동아리 멤버 관리
          </h1>
        </div>
        <button
          onClick={handleLogoutAndRedirect}
          className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-red-600 text-sm sm:text-base"
        >
          로그아웃
        </button>
      </div>

      {/* 필터 섹션 수정 */}
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-4">
        <div className="space-y-1 col-span-1">
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            성별
          </label>
          <div className="relative">
            <select
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700 cursor-pointer text-xs sm:text-sm"
            >
              <option value="all">전체</option>
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
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            지역
          </label>
          <div className="relative">
            <select
              onChange={(e) => handleFilterChange("region", e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700 cursor-pointer text-xs sm:text-sm"
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
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            상태
          </label>
          <div className="relative">
            <select
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700 cursor-pointer text-xs sm:text-sm"
            >
              <option value="all">모든 상태</option>
              <option value={1}>참여</option>
              <option value={0}>포기</option>
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
        <div className="space-y-1 col-span-3 sm:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            날짜 범위
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="date"
                className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700 text-xs sm:text-sm"
                value={dateRange.start}
                onChange={(e) => handleDateRangeChange("start", e.target.value)}
              />
            </div>
            <span className="text-gray-400 self-center text-xs sm:text-sm">
              ~
            </span>
            <div className="relative flex-1">
              <input
                type="date"
                className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700 text-xs sm:text-sm"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange("end", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="space-y-1 col-span-3 sm:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            검색
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="이름, 전공, 학번 등으로 검색"
              className="p-2 pl-10 rounded-lg bg-gray-800 border border-gray-600 text-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-700 text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
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

      {/* 테이블 스크롤 최적화 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-700 text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                no.
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                이름
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                성별
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                연락처
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                생년월일
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                지역
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                대학교
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                전공
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                학번
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                학년
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                비전캠프 기수
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                참여 일시
              </th>
              <th className="px-2 py-1 sm:px-6 sm:py-3 text-center text-white">
                동아리 상태
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="text-center py-2 text-xs sm:text-sm"
                >
                  검색 결과가 없습니다
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-t border-gray-700 cursor-pointer ${
                    item.is_cherry_club_member === 1
                      ? "bg-green-900/50 hover:bg-green-800/50"
                      : "bg-red-900/50 hover:bg-red-800/50"
                  }`}
                >
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {index + 1}
                  </td>
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {item.name}
                  </td>
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {item.gender}
                  </td>
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {item.phone}
                  </td>
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {item.birthday}
                  </td>
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {item.region}
                  </td>
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {item.university}
                  </td>
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {item.major}
                  </td>
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {item.student_id}
                  </td>
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {item.grade}
                  </td>
                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {item.vision_camp_batch}
                  </td>

                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    {new Date(item.created_at).toLocaleString()}
                  </td>

                  <td className="px-2 py-1 sm:px-6 sm:py-4 text-center">
                    <select
                      value={item.is_cherry_club_member}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
                    >
                      <option value={1}>참여</option>
                      <option value={0}>중단</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls />
    </div>
  );
}
