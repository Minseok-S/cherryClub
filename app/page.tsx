"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { regionData } from "@/src/entities/campus";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mapRef = useRef(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const sections = ["map", "training", "campus", "class", "anthor"];
  const [activeSection, setActiveSection] = useState<string>("");

  const text =
    "체리 동아리는 '체인저 리더십(Changer Leadership) 동아리'의 준말로, 성경적 리더십 훈련을 통해 나를 변화시키고, 내가 속한 사회의 각 영역을 변화시키는 동아리입니다!";

  useEffect(() => {
    const chars = text.split("");
    const container = document.createElement("div");
    container.className =
      "w-[80%] lg:w-[70%] relative mb-10 text-[14px] md:text-[30px] font-black text-center break-keep mx-auto";

    chars.forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = "0";
      if (char === " ") {
        span.style.marginRight = "0.25em";
      }
      span.style.wordBreak = "keep-all";
      container.appendChild(span);

      gsap.to(span, {
        opacity: 1,
        duration: 0.1,
        delay: index * 0.05,
        ease: "none",
      });
    });

    const textWrapper = document.querySelector(".text-wrapper");
    if (textWrapper) {
      textWrapper.innerHTML = "";
      textWrapper.appendChild(container);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mediaQuery = window.matchMedia("(min-width: 768px)");

      gsap.set(mapRef.current, {
        scale: mediaQuery.matches ? 0.2 : 0.3,
        opacity: 0,
        x: "-20%",
      });
      gsap.to(mapRef.current, {
        scrollTrigger: {
          trigger: mapRef.current,
          start: mediaQuery.matches ? "top center+=400" : "top center+=200",
          end: "bottom center",
          scrub: 1,
        },
        scale: mediaQuery.matches ? 0.7 : 0.9,
        opacity: 1,
        duration: 1,
      });

      // 스크롤 유도 애니메이션 추가
      gsap.fromTo(
        ".scroll-indicator",
        { opacity: 1, y: 0 },
        {
          opacity: 0.3,
          y: 20,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.to(mapRef.current, {
      x: selectedRegion ? "-20%" : "0%",
      duration: 0.5,
      ease: "power2.out",
    });

    if (selectedRegion) {
      gsap.to(modalRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(modalRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [selectedRegion]);

  // 모달 상태 변경시 헤더 가림
  useEffect(() => {
    const header = document.getElementById("main-header");
    if (selectedRegion) {
      gsap.to(header, { opacity: 0, y: -20, duration: 0.3 });
    } else {
      // 모달 닫힐 때 헤더 다시 나타나게 설정
      gsap.to(header, { opacity: 1, y: 0, duration: 0.3 });
    }
  }, [selectedRegion]);

  const handleModalClose = () => {
    setSelectedRegion(null);
  };

  const handleRegionClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const region = e.currentTarget.getAttribute("data-region");
    setSelectedRegion(region === selectedRegion ? null : region);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["map", "training", "campus", "class", "anthor"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          );
        }
        return false;
      });

      // 현재 섹션이 'map'이 아니면 모달 닫기
      if (currentSection && currentSection !== "map") {
        setSelectedRegion(null);
      }

      setActiveSection(currentSection || "");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 로드시 실행

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getSectionName = (section: string) => {
    const names: { [key: string]: string } = {
      map: "현황",
      training: "리더십 훈련",
      campus: "캠퍼스 사역",
      class: "전체 / 지역모임",
      anthor: "대외 사역",
    };
    return names[section] || section;
  };

  return (
    <div className="min-h-[200vh] relative">
      {/* 스크롤 유도 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="scroll-indicator animate-bounce cursor-pointer">
          <svg
            className="h-8 md:h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

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
              {sections.map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(section)
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
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
              href="https://forms.gle/hMReZhWNUYfeMYe78"
              target="_blank"
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 
                          transition-colors duration-300 text-xs md:text-base font-black"
            >
              신청하기
            </a>
          </div>
        </div>
      </header>

      {/*타이틀 */}
      <div className="flex items-center justify-center mt-56 md:mt-44">
        <div className="title-text-wrapper relative whitespace-nowrap">
          <h1 className="title-text text-[clamp(50px,10vw,100px)] md:text-[clamp(100px,12vw,250px)] font-black">
            CHERRY CLUB
          </h1>
        </div>
      </div>

      {/* 체리동아리 소개 */}
      <div className="flex justify-center">
        <div className="text-wrapper w-full flex justify-center">
          <p className="w-[80%] lg:w-[70%] relative mb-10 text-[14px] md:text-[30px] font-black text-center break-keep break-words">
            {text}
          </p>
        </div>
      </div>

      {/* 체리동아리 신청 */}
      <div className="flex justify-center">
        <a
          href="https://forms.gle/hMReZhWNUYfeMYe78"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[50%] md:w-[30%] relative md:text-[20px] font-black text-center
                    bg-red-500 text-white py-4 px-8 rounded-full hover:bg-red-600 
                    transition-colors duration-300 transform hover:scale-105
                    shadow-lg"
          style={{ scrollMarginTop: "100px" }}
        >
          신청하기
        </a>
      </div>

      {/* 현황 지도 */}
      <div
        id="map"
        className="pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
        style={{ scrollSnapAlign: "center", scrollMarginTop: "100px" }}
      >
        <div className="w-[100%] md:w-[110%] lg:w-[60%] relative" ref={mapRef}>
          <p className="text-center md:text-[40px] font-black">
            전국 동아리 현황
          </p>
          <svg
            id="지도"
            data-name="한국지도"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 508 585"
            className="w-full h-auto"
          >
            {/* 서울/경기 지부에 점 추가 */}
            <polygon
              className={`cls-1 stroke-[2px] ${
                selectedRegion === "경기인천"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="143.52 67.21 140.95 67.85 135.79 73.65 134.5 75.58 128.71 74.94 124.92 75.58 117.76 82.67 120.98 86.53 129.35 88.47 129.35 93.62 124.36 93.62 124.2 98.13 124.84 105.22 121.42 105.22 115.82 98.13 113.89 111.66 101.01 116.17 102.94 134.2 106.16 139.36 104.87 145.8 110.67 152.24 117.25 152.24 112.6 157.39 113.89 160.62 122.26 163.27 122.26 165.3 116.47 167.06 117.11 175.43 120.33 189.6 131.93 199.27 150.03 199.27 162.2 202.49 182.82 186.38 194.41 178.65 201.5 140.65 181.53 127.12 178.31 114.23 184.75 109.08 183.46 100.06 169.93 93.62 168 85.89 143.52 67.21"
              onClick={handleRegionClick}
              data-region="경기인천"
            />

            <path
              className={`cls-1 stroke-[2px] ${
                selectedRegion === "서울"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              d="M129.1,133.4l5.6,4,4.13-2,1.47-4.4h5.82l1.38-5.6,4-3.2,7.2.8,1.6,9.6-1.6,5.6,7.2-1.6s0,8.8-.8,8.8-7.2,7.2-7.2,7.2l-6.4-1.6-12,3.2-2.4-5.6-4.8.8-7.2-7.2,4-8.8Z"
              onClick={handleRegionClick}
              data-region="서울"
            />
            <circle
              cx="150"
              cy="130"
              r="2"
              fill="red"
              className="cursor-pointer"
              onClick={handleRegionClick}
              data-region="서울"
            />

            <polygon
              className={`cls-1 stroke-[2px] ${
                selectedRegion === "강원"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="242.08 35 259.8 77.5 269.78 91.69 294.26 124.54 296.84 132.92 316.81 167.7 319.38 178.01 311.01 183.81 303.92 192.18 287.18 187.03 267.85 190.89 262.58 189.45 235 181.87 236.28 171.57 225.98 169.63 219.54 173.5 211.81 168.99 204.72 179.3 194.41 178.65 201.5 140.65 181.53 127.12 178.31 114.23 184.75 109.08 183.46 100.06 169.93 93.62 168 85.89 143.52 67.21 154.47 58.83 193.77 63.34 213.74 59.48 242.08 35"
              onClick={handleRegionClick}
              data-region="강원"
            />
            <polygon
              className={`cls-1 stroke-[2px] ${
                selectedRegion === "대전충청"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="216.96 270.13 211.16 272.7 208.59 281.08 207.3 285.59 190.55 288.81 182.82 277.21 182.82 268.16 175.25 268.16 175.25 291.3 162.84 279.73 146.25 279.73 133.22 272.7 126.13 282.37 113.89 285.59 95.21 272.7 102.3 256.6 98.43 249.51 95.21 228.66 86.19 228.9 75.24 216.02 68.05 216.02 68.15 208.93 78.46 199.27 86.19 204.42 90.7 201.2 87.34 192.18 91.34 186.38 117.81 192.18 120.98 199.27 131.93 199.27 150.03 199.27 162.2 202.49 182.82 186.38 194.41 178.65 204.72 179.3 211.81 168.99 219.54 173.5 225.98 169.63 236.28 171.57 235 181.87 262.58 189.45 253.03 197.33 245.3 199.27 249.17 210.86 237.57 215.37 224.69 208.93 214.38 212.15 217.6 219.88 201.5 233.52 216.96 270.13"
              onClick={handleRegionClick}
              data-region="대전충청"
            />
            <path
              className={`cls-1 stroke-[2px] ${
                selectedRegion === "경상"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              d="M319.38,178.01l5.8,7.73v26.67l4.51,6.82-6.49,10.91,1.34,16.13-7.09,9.69,1.93,10.29v7.45l4.19,14.22,10.63-10.05,4.91,10.05-13.93,35.04,3.1,4.91-5.68,11.2-9.02,12.24-5.8,12.24-15.46,11.6h-12.13l-17.62-10.71-5.68-4.11s.64,7.36,2.9,8.51,2.79,6.31,2.79,6.31h-18.61v17.73l-24.44-2.92-3.87-10.31-10.95,5.15-16.1-13.53-3.22-15.46,5.15-11.6-5.15-15.33,9.02-21.38,12.88-11.6v-10.31s3.87-12.88,3.87-12.88l5.8-2.58-15.46-36.61,16.1-13.64-3.22-7.73,10.31-3.22,12.88,6.44,11.6-4.51-3.87-11.6,7.73-1.93,9.55-7.89,5.27,1.45,51.53-12.88Z"
              onClick={handleRegionClick}
              data-region="경상"
            />

            <polygon
              className={`cls-1 stroke-[2px] ${
                selectedRegion === "호남"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="113.89 285.59 102.3 289.45 106.16 296.54 121.82 296.54 116.47 302.34 115.82 306.2 108.95 306.2 106.16 313.93 93.92 323.59 111.96 325.53 91.99 339.7 82.33 359.02 93.28 374.48 82.33 386.65 94.56 404.12 102.07 440.82 101.01 445.99 106.8 444.7 120.33 418.93 129.35 436.97 155.12 405.4 160.27 410.56 149.32 424.09 158.34 430.53 174.44 420.87 182.31 392.86 204.72 384.79 188.62 371.26 185.39 355.8 190.55 344.21 185.39 328.87 194.41 307.49 207.3 295.89 207.3 285.59 190.55 288.81 182.82 277.21 182.82 268.16 175.25 268.16 175.25 291.3 162.84 279.73 146.25 279.73 133.22 272.7 126.13 282.37 113.89 285.59"
              onClick={handleRegionClick}
              data-region="호남"
            />
            <polygon
              className={`cls-1 stroke-[2px] ${
                selectedRegion === "제주"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="82.33 524.27 124.2 514.27 134.5 522.65 128.71 540.68 77.82 549.7 63 539.39 82.33 524.27"
              onClick={handleRegionClick}
              data-region="제주"
            />

            <path
              className={`cls-1 stroke-[2px] ${"fill-white hover:fill-red-200 stroke-gray-300"} cursor-pointer`}
              d="M422.45,145.16l-7.09,6.44s6.44,2.71,7.09,2.64,6.44-3.29,6.44-3.29l-5.15-5.15-1.29-.64Z"
            />
            <polygon
              className={`cls-1 stroke-[2px] ${"fill-white hover:fill-red-200 stroke-gray-300"} cursor-pointer`}
              points="436.63 150.95 434.69 156.11 442.42 158.04 436.63 150.95"
            />
            <polygon
              className={`cls-1 stroke-[2px] ${"fill-white hover:fill-red-200 stroke-gray-300"} cursor-pointer`}
              points="440.74 151.66 445 153.53 442.87 150.95 440.74 151.66"
              onClick={handleRegionClick}
            />
          </svg>
        </div>

        <div
          ref={modalRef}
          className="fixed top-0 right-0 w-[50%] md:w-[40%] h-full bg-black shadow-lg transform opacity-0 p-6 overflow-y-auto z-50"
        >
          {selectedRegion && (
            <div className="animate-fadeIn relative">
              <button
                onClick={handleModalClose}
                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white z-50"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={handleModalClose}
                style={{ zIndex: -1 }}
              />

              <h2 className="text-2xl font-bold mb-4 pr-8">
                {regionData[selectedRegion].name}
              </h2>
              <p className="text-gray-600 mb-4">
                {regionData[selectedRegion].description}
              </p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">총 캠퍼스</h3>
                <p>{regionData[selectedRegion].total}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">캠퍼스 목록</h3>
                <ul className="list-disc pl-5">
                  {regionData[selectedRegion].campus.map(
                    (attraction, index) => (
                      <li key={index}>{attraction}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/*리더십 훈련 */}
      <div
        id="training"
        className="pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
        style={{ scrollSnapAlign: "center", scrollMarginTop: "100px" }}
      >
        <h2 className="text-4xl md:text-6xl font-black text-center mb-12">
          리더십 훈련
        </h2>
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
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-[90%] md:w-[800px] mx-auto"
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
          }}
        >
          <SwiperSlide>
            <Image
              src="/training1.jpeg"
              alt="리더십 훈련 1"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/training2.jpeg"
              alt="리더십 훈련 2"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/training3.jpeg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/training4.jpeg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/training5.jpeg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/*캠퍼스 훈련 */}
      <div
        id="campus"
        className="pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
        style={{ scrollSnapAlign: "center", scrollMarginTop: "100px" }}
      >
        <h2 className="text-4xl md:text-6xl font-black text-center mb-12">
          캠퍼스 사역
        </h2>
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
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-[90%] md:w-[1000px] mx-auto"
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
          }}
        >
          <SwiperSlide>
            <Image
              src="/campus1.jpg"
              alt="리더십 훈련 1"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/campus2.jpg"
              alt="리더십 훈련 2"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/campus3.jpg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/campus4.jpg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/campus5.jpg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/*전체/지역모임 */}
      <div
        id="class"
        className="pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
        style={{ scrollSnapAlign: "center", scrollMarginTop: "100px" }}
      >
        <h2 className="text-4xl md:text-6xl font-black text-center mb-12">
          전체/지역모임
        </h2>
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
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-[90%] md:w-[800px] mx-auto"
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
          }}
        >
          <SwiperSlide>
            <Image
              src="/class1.jpg"
              alt="리더십 훈련 1"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/class2.jpeg"
              alt="리더십 훈련 2"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/class3.jpg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/class4.jpg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/class5.jpeg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/*대외사역 */}
      <div
        id="anthor"
        className="pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
        style={{ scrollSnapAlign: "center", scrollMarginTop: "100px" }}
      >
        <h2 className="text-4xl md:text-6xl font-black text-center mb-12">
          대외사역
        </h2>
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
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-[90%] md:w-[800px] mx-auto"
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
          }}
        >
          <SwiperSlide>
            <Image
              src="/anthor1.jpg"
              alt="리더십 훈련 1"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/anthor2.jpg"
              alt="리더십 훈련 2"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/anthor3.jpg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/anthor4.jpg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/anthor5.jpg"
              alt="리더십 훈련 3"
              width={1200}
              height={600}
              className="rounded-2xl object-cover h-[200px] md:h-[400px] w-full"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* 체리동아리 신청 */}
      <div id="last" className="flex justify-center pb-20 ">
        <a
          href="https://forms.gle/hMReZhWNUYfeMYe78"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[50%] md:w-[30%] relative md:text-[20px] font-black text-center
                    bg-red-500 text-white py-4 px-8 rounded-full hover:bg-red-600 
                    transition-colors duration-300 transform hover:scale-105
                    shadow-lg"
          style={{ scrollSnapAlign: "center", scrollMarginTop: "100px" }}
        >
          신청하기
        </a>
      </div>
    </div>
  );
}
