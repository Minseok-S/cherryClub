"use client";
import { useState } from "react";
import { REGION_FORM_LINKS, GENERAL_FORM_LINK } from "../lib/constants";
import { regionData } from "@/src/entities/campus";
import { MeetingSlider } from "./MeetingSlider";
import { RegionModal } from "./RegionModal";

export const MeetingSection = () => {
  const [showRegionModal, setShowRegionModal] = useState(false);

  const handleGeneralMeeting = () => {
    if (!GENERAL_FORM_LINK) {
      alert("전체모임은 추후 공지 예정입니다.");
      return;
    }
    window.open(GENERAL_FORM_LINK, "_blank");
  };

  const handleRegionSelect = (region: string) => {
    const formLink =
      REGION_FORM_LINKS[region as keyof typeof REGION_FORM_LINKS];
    if (!formLink) {
      alert(`${regionData[region].name}은(는) 추후 공지 예정입니다.`);
    } else {
      window.open(formLink, "_blank");
    }
    setShowRegionModal(false);
  };

  return (
    <div
      id="class"
      className="md:pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
    >
      <h2 className="text-4xl md:text-6xl font-black text-center mb-3 md:mb-8">
        전체/지역모임
      </h2>

      {/* 설명 추가 */}
      <div className="max-w-4xl mx-auto mb-6 md:mb-12 text-center">
        <p className="text-gray-600 text-sm md:text-base font-medium">
          매월 1회 전체모임과 지역별 모임을 통해 <br />
          체리 동아리원들과 함께 교제하며 성장합니다
        </p>
      </div>

      {/* 전체모임/지역모임 신청 버튼 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-2xl px-4">
        <button
          onClick={handleGeneralMeeting}
          className="flex-1 bg-red-500 text-white py-3 px-6 rounded-full 
                    hover:bg-red-600 transition-colors duration-300 
                    transform hover:scale-105 shadow-lg text-center 
                    text-sm md:text-base font-bold"
        >
          전체모임 참가 신청하기
        </button>
        <button
          onClick={() => setShowRegionModal(true)}
          className="flex-1 bg-white/10 backdrop-blur-sm text-white py-3 px-6 
                    rounded-full hover:bg-white/20 transition-colors duration-300 
                    transform hover:scale-105 shadow-lg text-center 
                    text-sm md:text-base font-bold"
        >
          지역모임 참가 신청하기
        </button>
      </div>

      <MeetingSlider />

      {showRegionModal && (
        <RegionModal
          onClose={() => setShowRegionModal(false)}
          onRegionSelect={handleRegionSelect}
        />
      )}
    </div>
  );
};
