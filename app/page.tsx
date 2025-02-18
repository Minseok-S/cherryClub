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

// 지역별 폼 링크 상수 추가
const REGION_FORM_LINKS = {
  서울: "https://forms.gle/iL9r7QT3jQieUdjWA",
  경기인천: "",
  강원: "",
  대전충청: "",
  경상: "",
  호남제주: "",
};

// 전체모임 링크 상수 추가
const GENERAL_FORM_LINK = "";

export default function Home() {
  const mapRef = useRef(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const sections = ["map", "training", "campus", "class", "anthor"];
  const [activeSection, setActiveSection] = useState<string>("");
  const [showMovements, setShowMovements] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const text =
    "체리 동아리는 &lsquo;체인저 리더십(Changer Leadership) 동아리&rsquo;의 준말로, 성경적 리더십 훈련을 통해 나를 변화시키고, 내가 속한 사회의 각 영역을 변화시키는 동아리입니다!";

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

  useEffect(() => {
    const handleScroll = () => {
      // 문서의 전체 높이
      const documentHeight = document.documentElement.scrollHeight;
      // 현재 보이는 영역의 높이
      const windowHeight = window.innerHeight;
      // 현재 스크롤 위치
      const scrollTop = window.scrollY;

      // 푸터에서 약간 위쪽에 도달하면 인디케이터를 숨김
      // 전체 높이에서 현재 보이는 영역의 높이를 뺀 값의 90%에 도달하면 숨김
      const threshold = (documentHeight - windowHeight) * 0.9;
      setShowScrollIndicator(scrollTop < threshold);
    };

    window.addEventListener("scroll", handleScroll);
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

  // 지역 선택 핸들러 수정
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

  // 전체모임 핸들러 추가
  const handleGeneralMeeting = () => {
    if (!GENERAL_FORM_LINK) {
      alert("전체모임은 추후 공지 예정입니다.");
      return;
    }
    window.open(GENERAL_FORM_LINK, "_blank");
  };

  return (
    <div className="min-h-[200vh] relative">
      {/* 스크롤 유도 - 조건부 렌더링 추가 */}
      {showScrollIndicator && (
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
      )}

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

      <div className="relative">
        <div className="absolute inset-0 w-full h-[350px] md:h-[680px] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/title.mp4" type="video/mp4" />
          </video>
          {/* 비디오 위에 오버레이 추가 */}
          <div className="absolute inset-0 bg-black/80"></div>
        </div>

        {/* 기존 콘텐츠를 relative로 설정하여 비디오 위에 표시 */}
        <div className="relative">
          <div className="flex items-center justify-center pt-10 mt-40 md:mt-44">
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
        </div>

        {/* 체리동아리 신청 */}
        <div className="flex justify-center mb-32">
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
      </div>

      {/* 현황 지도 */}
      <div
        id="map"
        className="pb-10 md:pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
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
                selectedRegion === "호남제주"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="113.89 285.59 102.3 289.45 106.16 296.54 121.82 296.54 116.47 302.34 115.82 306.2 108.95 306.2 106.16 313.93 93.92 323.59 111.96 325.53 91.99 339.7 82.33 359.02 93.28 374.48 82.33 386.65 94.56 404.12 102.07 440.82 101.01 445.99 106.8 444.7 120.33 418.93 129.35 436.97 155.12 405.4 160.27 410.56 149.32 424.09 158.34 430.53 174.44 420.87 182.31 392.86 204.72 384.79 188.62 371.26 185.39 355.8 190.55 344.21 185.39 328.87 194.41 307.49 207.3 295.89 207.3 285.59 190.55 288.81 182.82 277.21 182.82 268.16 175.25 268.16 175.25 291.3 162.84 279.73 146.25 279.73 133.22 272.7 126.13 282.37 113.89 285.59"
              onClick={handleRegionClick}
              data-region="호남제주"
            />
            <polygon
              className={`cls-1 stroke-[2px] ${
                selectedRegion === "호남제주"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="82.33 524.27 124.2 514.27 134.5 522.65 128.71 540.68 77.82 549.7 63 539.39 82.33 524.27"
              onClick={handleRegionClick}
              data-region="호남제주"
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
        className=" pb-10 md:pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
        style={{ scrollSnapAlign: "center", scrollMarginTop: "50px" }}
      >
        <h2 className="text-4xl md:text-6xl font-black text-center mb-5 md:mb-7">
          리더십 훈련
        </h2>

        {/* 리더십 훈련 설명 추가 */}
        <div className="max-w-4xl mx-auto mb-5 md:mb-7 text-center w-full px-4">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              {
                title: "신분과 사명",
                front: "예수 그리스도의 지도력의 기반!",
                back: "신분과 사명에 관한 설명",
              },
              {
                title: "셀프 리더십",
                front: "자신을 이끄는 리더십!",
                back: "셀프 리더십에 대한 설명",
              },
              {
                title: "사자의 리더십",
                front: "일(사역)을 향한 예수님의 리더십!",
                back: "사자의 리더십에 대한 설명",
              },
              {
                title: "양의 리더십",
                front: "사람(관계)을 향한 예수님의 리더십!",
                back: "양의 리더십에 대한 설명",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="group [perspective:1000px] h-[150px] md:h-[150px]"
              >
                <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* 앞면 */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm p-6 rounded-xl [backface-visibility:hidden] flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl font-black mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 font-bold whitespace-normal break-keep">
                      {card.front}
                    </p>
                  </div>

                  {/* 뒷면 */}
                  <div className="absolute inset-0 bg-red-500/90 backdrop-blur-sm p-6 rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center">
                    <p className="text-white font-bold whitespace-normal break-keep text-center">
                      {card.back}
                    </p>
                  </div>
                </div>
              </div>
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
        <h2 className="text-4xl md:text-6xl font-black text-center mb-6">
          캠퍼스 사역
        </h2>

        {/* 기본 설명 텍스트 */}
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8 text-sm md:text-base font-medium break-keep whitespace-pre-wrap">
          NCMN 대학캠퍼스사역은 다음 세대의 부흥을 이끄는 사역입니다.
          {"\n"}대학캠퍼스 안에서부터 5K운동을 중심으로 NCMN
          5대운동(말씀배가운동, 체리배가운동, 10만중보기도운동, 주인바꾸기운동,
          5K운동)을 펼쳐서 기독교문명개혁운동을 주도하는 사역을 하고 있습니다.
        </p>

        {/* 5대운동 설명 */}
        <div className="w-full max-w-3xl mx-auto mb-4 md:mb-10">
          <button
            onClick={() => setShowMovements(!showMovements)}
            className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm p-4 rounded-lg transition-all duration-300"
          >
            <h3 className="text-xl md:text-2xl font-bold text-center">
              5대운동이란?
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
              showMovements
                ? "max-h-[1000px] mt-4 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {/* PC 버전 */}
            <div className="hidden md:grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg md:col-span-2">
                <h4 className="font-bold mb-2">5K운동</h4>
                <p className="text-sm text-gray-600">
                  5K운동은 나의 캠퍼스 반경 5㎞ 안의 절대 필요가 있는 이웃들에게
                  예수님의 4대 사역(구제 사역, 교육 사역, 보건ㆍ의료 사역,
                  복음전파 사역)을 펼치는 것으로, 한국 교회의 부흥과 통일 한국을
                  이루어 열방을 섬기는 코리아가 되게 하는 하나님의 약속이 있는
                  사역이다.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg">
                <h4 className="font-bold mb-2">말씀배가운동</h4>
                <p className="text-sm text-gray-600">
                  말씀배가운동은 자신이 속한 가정 교회, 직장 등 각 영역에서
                  소그룹을 형성하여 100일 동안 성경 통독을 하고, 통독이 끝나면
                  구성원들이 새로운 소그룹을 만들어 배가시키는 운동이다.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg">
                <h4 className="font-bold mb-2">체리배가운동</h4>
                <p className="text-sm text-gray-600">
                  {
                    "체인저 리더십 운동은 '성경적 리더십 훈련을 통해 나를변화시키고 내가 속한 사회의 각 영역을 변화시키는 리더(NCer) 배가운동'이다."
                  }
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg">
                <h4 className="font-bold mb-2">10만중보기도운동</h4>
                <p className="text-sm text-gray-600">
                  느헤미야처럼 무너진 성벽을 재건하기위해 영적 대각성과
                  부흥운동을 일으켜 나라와 민족을 살리고 세계 열방을 향한
                  하나님의 뜻을 이루시도록 지역교회와 함께 중보기도자를일으키는
                  운동입니다.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg">
                <h4 className="font-bold mb-2">주인바꾸기운동</h4>
                <p className="text-sm text-gray-600">
                  {
                    "주인바꾸기 운동'은 '온전한 십일조의 회복'과 믿음, 청지기,단순한 삶을 통해서 오직 하나님이 유일한 주인이시며 공급자되심을 믿습니다. '빚갚기'를 통해 채주의 종에서 벗어나는 운동입니다."
                  }
                </p>
              </div>
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
                {[
                  {
                    title: "5K운동",
                    content:
                      "5K운동은 나의 캠퍼스 반경 5㎞ 안의 절대 필요가 있는 이웃들에게 예수님의 4대 사역(구제 사역, 교육 사역, 보건ㆍ의료 사역, 복음전파 사역)을 펼치는 것으로, 한국 교회의 부흥과 통일 한국을 이루어 열방을 섬기는 코리아가 되게 하는 하나님의 약속이 있는 사역이다.",
                  },
                  {
                    title: "말씀배가운동",
                    content:
                      "말씀배가운동은 자신이 속한 가정 교회, 직장 등 각 영역에서 소그룹을 형성하여 100일 동안 성경 통독을 하고, 통독이 끝나면 구성원들이 새로운 소그룹을 만들어 배가시키는 운동이다.",
                  },
                  {
                    title: "체리배가운동",
                    content:
                      "체인저 리더십 운동은 &ldquo;성경적 리더십 훈련을 통해 나를 변화시키고 내가 속한 사회의 각 영역을 변화시키는 리더(NCer) 배가운동&rdquo;이다.",
                  },
                  {
                    title: "10만중보기도운동",
                    content:
                      "느헤미야처럼 무너진 성벽을 재건하기위해 영적 대각성과 부흥운동을 일으켜 나라와 민족을 살리고 세계 열방을 향한 하나님의 뜻을 이루시도록 지역교회와 함께 중보기도자를일으키는 운동입니다.",
                  },
                  {
                    title: "주인바꾸기운동",
                    content:
                      "&lsquo;주인바꾸기 운동&rsquo;은 &lsquo;온전한 십일조의 회복&rsquo;과 믿음, 청지기, 단순한 삶을 통해서 오직 하나님이 유일한 주인이시며 공급자 되심을 믿습니다. &lsquo;빚갚기&rsquo;를 통해 채주의 종에서 벗어나는 운동입니다.",
                  },
                ].map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg min-h-[180px] flex flex-col">
                      <h4 className="font-bold mb-2">{slide.title}</h4>
                      <p className="text-sm text-gray-600 flex-1">
                        {slide.content}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
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
        className=" md:pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
        style={{ scrollSnapAlign: "center", scrollMarginTop: "100px" }}
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
        <h2 className="text-4xl md:text-6xl font-black text-center mb-5 md:mb-7">
          대외사역
        </h2>

        {/* 기본 설명 텍스트 */}
        <div className="max-w-4xl mx-auto mb-5 md:mb-7 text-center w-full px-4">
          <p className="text-gray-600 text-sm md:text-base font-medium break-keep whitespace-pre-wrap">
            체리 동아리는 캠퍼스를 넘어 지역사회와 나라를 섬기는 다양한
            대외사역에 참여합니다.
            <br />
            레드하트 캠페인, My5K, 사랑나눔버스, DMZ 행진 등을 통해 하나님의
            사랑을 실천합니다.
          </p>
        </div>

        {/* 대외사역 설명 */}
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
              showMovements
                ? "max-h-[800px] mt-4 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {/* PC 버전 */}
            <div className="hidden md:grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "1221 레드하트",
                  description:
                    "12월 21일, 레드하트데이! 나눔으로 웃음과 기쁨이 두 배가 되는 축제의 날. 가족, 친구, 이웃과 함께 즐겨요! 1221 REDHEART DAY.에 참여합니다.",
                  icon: "❤️",
                  link: "",
                },
                {
                  title: "My5K",
                  description:
                    "내 주변 반경 5㎞ 내에 도움이 필요한 이웃에게 필요를 나누고 섬기며 문화를 선도하여 서로 사랑하는 세상을 함께 만들어 가기 위해 걷기 운동에 참여합니다.",
                  icon: "🚶",
                  link: "",
                },
                {
                  title: "5K 사랑나눔버스",
                  description:
                    "기독교 문명 개혁운동을 일으키는 NCer Nations-Changer 들이 내가 거주하는 지역, 교회의 반경 5㎞안에 있는 불신자 독거노인을 찾아가서 맞춤섬김에 참여합니다.",
                  icon: "🚌",
                  link: "",
                },
                {
                  title: "DMZ 155마일 행진",
                  description:
                    "NCMN 통일을 여는 DMZ 155마일 기도행진에 참여합니다.",
                  icon: "🚶",
                  link: "https://forms.gle/Kpos1VmM2hfM6LEr6",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm p-4 rounded-lg flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{service.icon}</span>
                    <h4 className="font-bold">{service.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="mt-auto flex justify-center w-full">
                    <button
                      onClick={() => {
                        if (service.link) {
                          window.open(service.link, "_blank");
                        } else {
                          alert("아직 신청기간이 아닙니다.");
                        }
                      }}
                      className="bg-red-500 text-white py-2 px-4 rounded-full 
                               hover:bg-red-600 transition-colors duration-300 
                               text-sm font-bold"
                    >
                      참가 신청
                    </button>
                  </div>
                </div>
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
                {[
                  {
                    title: "1221 레드하트",
                    description:
                      "12월 21일, 레드하트데이! 나눔으로 웃음과 기쁨이 두 배가 되는 축제의 날. 가족, 친구, 이웃과 함께 즐겨요! 1221 REDHEART DAY.에 참여합니다.",
                    icon: "❤️",
                    link: "",
                  },
                  {
                    title: "My5K",
                    description:
                      "내 주변 반경 5㎞ 내에 도움이 필요한 이웃에게 필요를 나누고 섬기며 문화를 선도하여 서로 사랑하는 세상을 함께 만들어 가기 위해 걷기 운동에 참여합니다.",
                    icon: "🚶",
                    link: "",
                  },
                  {
                    title: "5K 사랑나눔버스",
                    description:
                      "기독교 문명 개혁운동을 일으키는 NCer Nations-Changer 들이 내가 거주하는 지역, 교회의 반경 5㎞안에 있는 불신자 독거노인을 찾아가서 맞춤섬김에 참여합니다.",
                    icon: "🚌",
                    link: "",
                  },
                  {
                    title: "DMZ 155마일 행진",
                    description:
                      "NCMN 통일을 여는 DMZ 155마일 기도행진에 참여합니다.",
                    icon: "🚶",
                    link: "https://forms.gle/Kpos1VmM2hfM6LEr6",
                  },
                ].map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg min-h-[180px] flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{slide.icon}</span>
                        <h4 className="font-bold">{slide.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {slide.description}
                      </p>
                      <div className="mt-auto flex justify-center w-full">
                        <button
                          onClick={() => {
                            if (slide.link) {
                              window.open(slide.link, "_blank");
                            } else {
                              alert("아직 신청기간이 아닙니다.");
                            }
                          }}
                          className="bg-red-500 text-white py-2 px-4 rounded-full 
                                   hover:bg-red-600 transition-colors duration-300 
                                   text-sm font-bold"
                        >
                          참가 신청
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
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

      {/* 지역 선택 모달 추가 */}
      {showRegionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRegionModal(false)}
          />
          <div className="relative bg-black border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center">지역 선택</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(regionData).map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionSelect(region)}
                  className="bg-white/5 hover:bg-white/10 backdrop-blur-sm 
                            py-3 px-4 rounded-xl transition-colors duration-200
                            text-sm md:text-base font-bold"
                >
                  {regionData[region].name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRegionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
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
          </div>
        </div>
      )}

      {/* 비디오 섹션 추가 */}
      <div className="relative w-full h-[300px] md:h-[550px] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-[center_83%]" // object-position 추가
        >
          <source src="/end.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center px-4">
          <p className="text-center text-white md:text-4xl font-bold max-w-3xl break-keep leading-relaxed">
            가장 탁월한 지도력의 롤모델, 예수 그리스도의 모습을 통해 신분과
            사명을 알고, 자신의 장막터를 넓히기 원하시는 여러분을 환영합니다
          </p>
        </div>
      </div>

      {/* 새로운 푸터 */}
      <footer className="backdrop-blur-sm py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* 메인 콘텐츠 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-12">
            {/* 왼쪽 섹션 - 로고 및 말씀 */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-gray-300 text-sm md:text-base leading-relaxed break-keep">
                  주의 권능의 날에 주의 백성이 거룩한 옷을 입고 즐거이 헌신하니
                  새벽 이슬 같은 주의 청년들이 주께 나오는도다
                </p>
                <p className="text-gray-400 text-sm italic">- 시편 110:3</p>
              </div>
            </div>

            {/* 오른쪽 섹션 - 신청 안내 */}
            <div className="flex flex-col items-center space-y-6">
              <div className="space-y-4 text-center">
                <p className="text-gray-400 text-sm">
                  * 신청 확인 후 각 학교 담당자가 연락 드릴 예정입니다 :)
                </p>
              </div>

              <a
                href="https://forms.gle/hMReZhWNUYfeMYe78"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-[60%] py-4 px-8 
                          bg-red-500 hover:bg-red-600 
                          text-white text-center font-black
                          rounded-full shadow-lg
                          transition-all duration-300 transform hover:scale-105"
              >
                신청하기
              </a>
            </div>
          </div>

          {/* 저작권 */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            {/* 소셜 미디어 링크 추가 */}
            <div className="flex justify-center space-x-6 mb-4">
              <a
                href="https://www.instagram.com/kings_hero0214?igsh=MWxoZWU5NGZhd3g0bQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 0 1 1.772 1.153 4.902 4.902 0 0 1 1.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 0 1-1.153 1.772 4.902 4.902 0 0 1-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 0 1-1.772-1.153 4.902 4.902 0 0 1-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 0 1 1.153-1.772A4.902 4.902 0 0 1 5.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 1.802a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666zm5.338-3.205a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@kingsheroncmn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 0 1 1.768-1.768C5.746 5 12 5 12 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Cherry Club. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
