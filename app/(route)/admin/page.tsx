"use client";

import { AuthForm } from "@/src/features/auth";
import { useAuth } from "@/src/features/auth/model/model";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const {
    loading,
    isAuthenticated,
    user,
    error,
    handleAuthSubmit,
    handleLogout,
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <AuthForm onSubmit={handleAuthSubmit} error={error} loading={loading} />
    );
  }

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;

  return (
    <div className="p-8">
      <Header userName={user!.userName} handleLogout={handleLogout} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div
          className="p-6 border rounded-lg hover:bg-gray-800 cursor-pointer"
          onClick={() => router.push("/admin/cherryApplications")}
        >
          <h2 className="text-xl font-semibold mb-2">체리동아리 신청 관리</h2>
          <p className="text-gray-600">신규 신청자 및 승인 관리</p>
        </div>
        <div
          className="p-6 border rounded-lg hover:bg-gray-800 cursor-pointer"
          onClick={() => router.push("/admin/club")}
        >
          {" "}
          <h2 className="text-xl font-semibold mb-2">체리동아리 멤버 관리</h2>
          <p className="text-gray-600">체리동아리 멤버 정보 관리</p>
        </div>
        <div className="p-6 border rounded-lg hover:bg-gray-800 cursor-not-allowed opacity-50">
          <h2 className="text-xl font-semibold mb-2">대학캠퍼스 멤버 관리</h2>
          <p className="text-gray-600">대학캠퍼스 멤버 정보 관리</p>
          <p className="text-yellow-500 mt-2">🚧 개발 중 🚧</p>
        </div>
        <div className="p-6 border rounded-lg hover:bg-gray-800 cursor-not-allowed opacity-50">
          <h2 className="text-xl font-semibold mb-2">모든 멤버 관리</h2>
          <p className="text-gray-600">전체 멤버 통합 관리</p>
          <p className="text-yellow-500 mt-2">🚧 개발 중 🚧</p>
        </div>
      </div>
    </div>
  );
}

const Header = ({
  userName,
  handleLogout,
}: {
  userName: string;
  handleLogout: () => void;
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">관리자 페이지</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">안녕하세요, {userName}님</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};
