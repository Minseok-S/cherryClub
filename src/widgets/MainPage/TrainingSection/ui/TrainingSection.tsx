"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { trainingData } from "../lib/constants";
import React, { useState } from "react";

import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { TrainingCard } from "./TrainingCard";

export const TrainingSection = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  return (
    <div
      id="training"
      className="md:pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
    >
      <h1 className="font-black text-center mb-5 md:mb-7">리더십 훈련</h1>

      <div className="max-w-4xl mx-auto mb-5 md:mb-7 text-center w-full px-4">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {trainingData.map((card, index) => (
            <TrainingCard
              key={index}
              title={card.title}
              front={card.front}
              back={card.back}
              isFlipped={flippedIndex === index}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>

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
              src={`/images/training/training${num}.jpeg`}
              alt={`리더십 훈련 ${num}`}
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
