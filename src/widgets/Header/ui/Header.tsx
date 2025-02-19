"use client";

import { joinLink } from "@/src/entities/link";
import Image from "next/image";
import { HeaderProps } from "../model/type";
import { getSectionName } from "../lib/getSectionName";
import { Sections } from "@/src/shared/constants";

export const Header = ({ activeSection }: HeaderProps) => {
  return (
    <header className="fixed top-0 w-full z-50" id="main-header">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* 로고 및 메뉴 그룹 */}
        <div className="flex items-center space-x-8">
          <Image
            src="/logo.png"
            alt="Cherry Club Logo"
            width={80}
            height={80}
            className="h-8 md:h-20 w-auto cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
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
            href={joinLink}
            target="_blank"
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 
                      transition-colors duration-300 text-xs md:text-base font-black"
          >
            신청하기
          </a>
        </div>
      </div>
    </header>
  );
};
