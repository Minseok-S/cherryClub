"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { MovementsAccordion } from "./MovementsAccordion";

import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export const CampusSection = () => {
  const [showMovements, setShowMovements] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      id="campus"
      className="mt-10 md:mt-0 px-4 md:min-h-screen flex flex-col items-center justify-center"
    >
      <h2 className="text-4xl md:text-6xl font-black text-center mb-6">
        캠퍼스 사역
      </h2>

      {/* 기본 설명 텍스트 */}
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8 text-sm md:text-base font-medium break-keep whitespace-pre-wrap">
        체리동아리의 캠퍼스 사역은 대학캠퍼스에
        {isClient && window.innerWidth > 640 && (
          <span className="block md:inline">부흥을 이끄는 사역입니다.</span>
        )}
        {isClient && window.innerWidth > 640 && "\n"}
        대학캠퍼스 안에서 5K 무료나눔, 5K 청년밥차,
        <span className="block md:inline">
          캠퍼스 워십, Red HeartDay를 주도합니다!
        </span>
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
              src={`/images/campus/campus${num}.jpg`}
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
