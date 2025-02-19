"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { MovementsAccordion } from "./MovementsAccordion";

import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export const CampusSection = () => {
  const [showMovements, setShowMovements] = useState(false);

  return (
    <div
      id="campus"
      className="pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
    >
      <h2 className="text-4xl md:text-6xl font-black text-center mb-6">
        캠퍼스 사역
      </h2>

      {/* 기본 설명 텍스트 */}
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8 text-sm md:text-base font-medium break-keep whitespace-pre-wrap">
        NCMN 대학캠퍼스사역은 다음 세대의 부흥을 이끄는 사역입니다.
        {"\n"}대학캠퍼스 안에서부터 5K운동을 중심으로 NCMN 5대운동(말씀배가운동,
        체리배가운동, 10만중보기도운동, 주인바꾸기운동, 5K운동)을 펼쳐서
        기독교문명개혁운동을 주도하는 사역을 하고 있습니다.
      </p>

      {/* 5대운동 설명 */}
      <MovementsAccordion
        showMovements={showMovements}
        setShowMovements={setShowMovements}
      />

      <Swiper
        loop={true}
        speed={800}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          waitForTransition: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass:
            "swiper-pagination-bullet-active custom-bullet-active",
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-[90%] md:w-[800px] mx-auto [&_.swiper-pagination-bullet-active]:!bg-red-500 [&_.swiper-pagination-bullet]:!bg-white"
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
        }}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <SwiperSlide key={num}>
            <Image
              src={`/campus${num}.jpg`}
              alt={`캠퍼스 사역 ${num}`}
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
