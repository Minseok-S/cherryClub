"use client";
import { useRouter, usePathname } from "next/navigation";

export function AdminMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      path: "/admin/cherryApplications",
      label: "체리동아리 신청 관리",
      active: pathname === "/admin/cherryApplications",
    },
    {
      path: "/admin/club",
      label: "체리동아리 멤버 관리",
      active: pathname === "/admin/club",
    },
    {
      path: "/admin/kingsHero",
      label: "대학캠퍼스 멤버 관리",
      active: pathname === "/admin/kingsHero",
    },
    {
      path: "#",
      label: "모든 멤버 관리",
      active: false,
      disabled: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      {menuItems.map((item) => (
        <div
          key={item.label}
          className={`p-2 border rounded-lg transition-all ${
            item.active
              ? "bg-blue-900 border-blue-700"
              : "hover:bg-gray-800 border-gray-700"
          } ${
            item.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          } relative`}
          onClick={() => !item.disabled && router.push(item.path)}
        >
          <h2 className="text-sm font-semibold">{item.label}</h2>
          {item.disabled && (
            <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-1 rounded-bl">
              기능 개발중
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
