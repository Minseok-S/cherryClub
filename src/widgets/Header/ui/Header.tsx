"use client";

import Image from "next/image";
import { useState } from "react";
import { clubJoinLink } from "@/src/entities/link";
import { Sections } from "@/src/shared/constants";
import { getSectionName } from "../lib/getSectionName";
import { useScrollSpyHeader } from "../model/useScrollSpyHeader";

export const Header = ({
  setSelectedRegion,
}: {
  setSelectedRegion: (region: string | null) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { activeSection } = useScrollSpyHeader({
    onSectionChange: (section: string) => {
      if (section && section !== "map") {
        setSelectedRegion(null);
      }
    },
  });

  return (
    <>
      <header className="fixed top-0 w-full z-50" id="main-header">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* 햄버거 메뉴, 로고 및 네비게이션 */}
          <div className="flex items-center space-x-8">
            <button
              className="md:hidden text-2xl"
              onClick={() => setIsMenuOpen(true)}
            >
              ☰
            </button>
            {/* PC 버전 로고 */}
            <div className="hidden md:block">
              <Image
                src="/logo.png"
                alt="Cherry Club Logo"
                width={80}
                height={80}
                className="h-16 w-auto cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              />
            </div>
            <nav className="hidden md:flex md:space-x-6">
              {Sections.map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(section)?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className={`hover:text-gray-300 md:text-xl font-black ${
                    activeSection === section ? "text-red-500" : ""
                  }`}
                >
                  {getSectionName(section)}
                </a>
              ))}
            </nav>
          </div>

          {/* 오른쪽 영역 */}
          <div className="flex items-center space-x-6">
            <a
              href={clubJoinLink}
              target="_blank"
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 
                        transition-colors duration-300 text-xs md:text-base font-black"
            >
              동아리 가입 신청
            </a>
          </div>
        </div>
      </header>

      {/* 모바일 사이드 메뉴 */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <div className="p-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-300 hover:text-white"
          >
            ✕
          </button>
          {/* 로고 추가 */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Cherry Club Logo"
              width={80}
              height={80}
              className="h-16 w-auto cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsMenuOpen(false);
              }}
            />
          </div>
          <div className="space-y-4">
            {Sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(section)?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  setIsMenuOpen(false);
                }}
                className={`block py-2 text-gray-300 hover:text-white text-lg font-black 
                ${activeSection === section ? "text-red-400" : ""}`}
              >
                {getSectionName(section)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 오버레이 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};
