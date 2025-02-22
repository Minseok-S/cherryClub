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
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/applications", {
          headers: {
            // 실제 구현시 적절한 인증 방식 추가 필요
            Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
          },
        });

        if (!response.ok) throw new Error("데이터 조회 실패");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("데이터를 불러오는 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">신청자 관리</h1>
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
