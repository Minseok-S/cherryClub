import { movements } from "../lib/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { ServiceCard } from "./ServiceCard";

interface MovementsAccordionProps {
  showMovements: boolean;
  setShowMovements: (show: boolean) => void;
}

export const MovementsAccordion = ({
  showMovements,
  setShowMovements,
}: MovementsAccordionProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-4 md:mb-10">
      <button
        onClick={() => setShowMovements(!showMovements)}
        className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm p-4 rounded-lg transition-all duration-300"
      >
        <h3 className="text-xl md:text-2xl font-bold text-center">
          대외사역 소개
        </h3>
        <svg
          className={`w-6 h-6 transform transition-transform duration-300 ${
            showMovements ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`transition-all duration-500 overflow-hidden ${
          showMovements ? "max-h-[800px] mt-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* PC 버전 */}
        <div className="hidden md:grid md:grid-cols-2 gap-4">
          {movements.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* 모바일 버전 - Swiper */}
        <div className="md:hidden">
          <Swiper
            loop={true}
            speed={800}
            spaceBetween={20}
            centeredSlides={true}
            pagination={{
              clickable: true,
              bulletActiveClass:
                "swiper-pagination-bullet-active custom-bullet-active",
            }}
            modules={[Pagination, Navigation]}
            className="w-full [&_.swiper-pagination-bullet-active]:!bg-red-500 [&_.swiper-pagination-bullet]:!bg-white"
          >
            {movements.map((service, index) => (
              <SwiperSlide key={index}>
                <ServiceCard {...service} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
