"use client";
import { useState } from "react";
import { MovementsAccordion } from "./MovementsAccordion";
import { ExternalSlider } from "./ExternalSlider";

export const ExternalSection = () => {
  const [showMovements, setShowMovements] = useState(false);

  return (
    <div
      id="anthor"
      className="my-10 md:pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
    >
      <h2 className="text-4xl md:text-6xl font-black text-center mb-5 md:mb-7">
        대외사역
      </h2>

      {/* 기본 설명 텍스트 */}
      <div className="max-w-4xl mx-auto mb-5 md:mb-7 text-center w-full px-4">
        <p className="text-gray-600 text-sm md:text-base font-medium break-keep whitespace-pre-wrap">
          체리 동아리는 캠퍼스를 넘어 지역사회와 나라를 섬기는 다양한 대외사역을
          주도합니다!
          <br />
          레드하트 캠페인, My5K, 사랑나눔버스, DMZ 행진 등을 통해 하나님의
          사랑을 실천합니다.
        </p>
      </div>

      <MovementsAccordion
        showMovements={showMovements}
        setShowMovements={setShowMovements}
      />

      <ExternalSlider />
    </div>
  );
};
