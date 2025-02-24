import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

export const ExternalSlider = () => {
  return (
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
            src={`/images/anthor/anthor${num}.jpg`}
            alt={`대외사역 ${num}`}
            width={1200}
            height={600}
            className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
