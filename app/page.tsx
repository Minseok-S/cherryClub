"use client";
import { useEffect, useRef, useState } from "react";
import { useAnimation, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RegionInfo {
  name: string;
  description: string;
  population: string;
  attractions: string[];
}

const regionData: { [key: string]: RegionInfo } = {
  서울경기: {
    name: "서울/경기도 지부",
    description: "대한민국의 수도권 지역으로, 정치, 경제, 문화의 중심지입니다.",
    population: "19개",
    attractions: [
      "서울대학교",
      "연세대학교",
      "고려대학교",
      "한양대학교",
      "성균관대학교",
    ],
  },
  강원: {
    name: "강원 지부",
    description: "아름다운 자연 경관과 산악 지형이 특징인 동부 지역입니다.",
    population: "약 154만명",
    attractions: [
      "강원대학교",
      "한림대학교",
      "연세대학교 원주캠퍼스",
      "경동대학교",
      "강릉원주대학교",
    ],
  },
  충청: {
    name: "대전&충청",
    description: "역사와 자연이 어우러진 중부 지역입니다.",
    population: "약 320만명",
    attractions: [
      "충남대학교",
      "한남대학교",
      "충북대학교",
      "KAIST",
      "건국대학교 글로컬캠퍼스",
    ],
  },
  전라: {
    name: "전라도",
    description: "맛있는 음식과 아름다운 자연이 조화를 이루는 지역입니다.",
    population: "약 350만명",
    attractions: [
      "전남대학교",
      "전북대학교",
      "조선대학교",
      "순천대학교",
      "목포대학교",
    ],
  },
  경상: {
    name: "경상도",
    description: "유서 깊은 문화유산과 현대 산업이 공존하는 지역입니다.",
    population: "약 510만명",
    attractions: [
      "경북대학교",
      "부산대학교",
      "영남대학교",
      "동아대학교",
      "울산대학교",
    ],
  },
  제주: {
    name: "제주도",
    description:
      "대한민국의 대표적인 관광지로, 아름다운 자연과 독특한 문화가 있는 섬입니다.",
    population: "약 69만명",
    attractions: ["제주대학교"],
  },
};

export default function Home() {
  const mapRef = useRef(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const text =
    "체리 동아리는 '체인저 리더십(Changer Leadership) 동아리'의 준말로, 성경적 리더십 훈련을 통해 나를 변화시키고, 내가 속한 사회의 각 영역을 변화시키는 동아리입니다!";

  const lines = text.split("\n"); // 줄 단위로 나누기
  const lineControls = useAnimation(); // 줄 애니메이션 컨트롤
  const charControls = lines.map(() => useAnimation()); // 각 줄의 문자 애니메이션 컨트롤

  useEffect(() => {
    async function sequence() {
      for (let i = 0; i < lines.length; i++) {
        await lineControls.start((index) =>
          index === i ? { opacity: 1, transition: { duration: 0.3 } } : {}
        ); // 현재 줄을 나타나게 함

        await charControls[i].start((charIndex) => ({
          opacity: 1,
          transition: { delay: charIndex * 0.05 },
        })); // 해당 줄의 문자들이 하나씩 나타남
      }
    }
    sequence();
  }, [lineControls, charControls]);

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
          start: mediaQuery.matches ? "top center+=200" : "top center+=150",
          end: "bottom center",
          scrub: 1,
        },
        scale: mediaQuery.matches ? 0.7 : 0.9,
        opacity: 1,
        duration: 1,
      });

      // // 스크롤 유도 애니메이션 추가
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

  {
    /* 스크롤시 헤더 생성*/
  }
  useEffect(() => {
    const header = document.getElementById("main-header");
    const title = document.querySelector(".title-text-wrapper");

    ScrollTrigger.create({
      trigger: title,
      start: "top top",
      end: "bottom top",
      onLeaveBack: () => {
        if (!selectedRegion) {
          gsap.to(header, { opacity: 0, y: -20, duration: 0.3 });
        }
      },
      onEnter: () => {
        if (!selectedRegion) {
          gsap.to(header, { opacity: 1, y: 0, duration: 0.3 });
        }
      },
    });
  }, [selectedRegion]); // selectedRegion을 의존성 배열에 추가

  // 모달 상태 변경시 헤더 가림
  useEffect(() => {
    const header = document.getElementById("main-header");
    if (selectedRegion) {
      gsap.to(header, { opacity: 0, y: -20, duration: 0.3 });
    }
  }, [selectedRegion]);

  {
    /*스크롤 이동시 모달페이지 닫힘 */
  }
  useEffect(() => {
    ScrollTrigger.create({
      trigger: mapRef.current,
      start: "top center+=200",
      end: "bottom top",
      onUpdate: (self) => {
        if (self.direction === 1) {
          setSelectedRegion(null);
        }
      },
    });
  }, []);

  const handleRegionClick = (e: React.MouseEvent<SVGPathElement>) => {
    const region = e.currentTarget.getAttribute("data-region");
    setSelectedRegion(region === selectedRegion ? null : region);
  };

  return (
    <div className="min-h-[200vh] relative">
      {/* 스크롤 유도 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="scroll-indicator animate-bounce">
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

      <header className="fixed top-0 w-full z-50 opacity-0" id="main-header">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* 로고 및 메뉴 그룹 */}
          <div className="flex items-center space-x-8">
            <img
              src="/logo.png"
              alt="Cherry Club Logo"
              className="h-8 md:h-20 w-auto"
            />
            <nav className="hidden md:flex md:space-x-6">
              <a
                href="#campus"
                className="hover:text-gray-300 md:text-xl font-black"
              >
                현황
              </a>
              <a href="#" className="hover:text-gray-300 md:text-xl font-black">
                리더십 훈련
              </a>
              <a href="#" className="hover:text-gray-300 md:text-xl font-black">
                캠퍼스 사역
              </a>
              <a href="#" className="hover:text-gray-300 md:text-xl font-black">
                전체 / 지역모임
              </a>
              <a href="#" className="hover:text-gray-300 md:text-xl font-black">
                대외 사역
              </a>
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
      <div className="flex items-center justify-center">
        <div className="title-text-wrapper relative whitespace-nowrap">
          <h1 className="title-text text-[clamp(50px,10vw,100px)] md:text-[clamp(100px,12vw,250px)] font-black">
            CHERRY CLUB
          </h1>
        </div>
      </div>

      {/* 체리동아리 소개 */}
      <div className="flex justify-center">
        <p className="w-[90%] lg:w-[60%] relative mb-10 text-[14px] md:text-[30px] font-black text-center break-keep">
          {lines.map((line, lineIndex) => (
            <motion.span
              key={lineIndex}
              custom={lineIndex}
              animate={lineControls}
              initial={{ opacity: 0 }}
              className="block"
            >
              {line.split("").map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  custom={charIndex}
                  animate={charControls[lineIndex]}
                  initial={{ opacity: 0 }}
                >
                  {char}
                </motion.span>
              ))}
              <br />
            </motion.span>
          ))}
        </p>
      </div>

      {/* 체리동아리 신청 */}
      <div className="flex justify-center">
        <a
          href="https://forms.gle/hMReZhWNUYfeMYe78"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[50%] md:w-[10%]  relative mb-10 md:text-[20px] font-black text-center
                    bg-red-500 text-white py-4 px-8 rounded-full hover:bg-red-600 
                    transition-colors duration-300 transform hover:scale-105
                    shadow-lg"
        >
          신청하기
        </a>
      </div>

      {/* 현황 지도 */}
      <div id="campus" className="flex justify-center w-full h-96 md:h-96">
        <div className="w-[90%] md:w-[90%] lg:w-[60%] relative" ref={mapRef}>
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
                selectedRegion === "서울경기"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="143.52 67.21 140.95 67.85 135.79 73.65 134.5 75.58 128.71 74.94 124.92 75.58 117.76 82.67 120.98 86.53 129.35 88.47 129.35 93.62 124.36 93.62 124.2 98.13 124.84 105.22 121.42 105.22 115.82 98.13 113.89 111.66 101.01 116.17 102.94 134.2 106.16 139.36 104.87 145.8 110.67 152.24 117.25 152.24 112.6 157.39 113.89 160.62 122.26 163.27 122.26 165.3 116.47 167.06 117.11 175.43 120.33 189.6 131.93 199.27 150.03 199.27 162.2 202.49 182.82 186.38 194.41 178.65 201.5 140.65 181.53 127.12 178.31 114.23 184.75 109.08 183.46 100.06 169.93 93.62 168 85.89 143.52 67.21"
              onClick={handleRegionClick}
              data-region="서울경기"
            />
            <circle
              cx="170"
              cy="130"
              r="2"
              fill="red"
              className="cursor-pointer"
              onClick={(e) => handleRegionClick(e as any)}
              data-region="서울경기"
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
                selectedRegion === "충청"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="216.96 270.13 211.16 272.7 208.59 281.08 207.3 285.59 190.55 288.81 182.82 277.21 182.82 268.16 175.25 268.16 175.25 291.3 162.84 279.73 146.25 279.73 133.22 272.7 126.13 282.37 113.89 285.59 95.21 272.7 102.3 256.6 98.43 249.51 95.21 228.66 86.19 228.9 75.24 216.02 68.05 216.02 68.15 208.93 78.46 199.27 86.19 204.42 90.7 201.2 87.34 192.18 91.34 186.38 117.81 192.18 120.98 199.27 131.93 199.27 150.03 199.27 162.2 202.49 182.82 186.38 194.41 178.65 204.72 179.3 211.81 168.99 219.54 173.5 225.98 169.63 236.28 171.57 235 181.87 262.58 189.45 253.03 197.33 245.3 199.27 249.17 210.86 237.57 215.37 224.69 208.93 214.38 212.15 217.6 219.88 201.5 233.52 216.96 270.13"
              onClick={handleRegionClick}
              data-region="충청"
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
                selectedRegion === "전라"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="113.89 285.59 102.3 289.45 106.16 296.54 121.82 296.54 116.47 302.34 115.82 306.2 108.95 306.2 106.16 313.93 93.92 323.59 111.96 325.53 91.99 339.7 82.33 359.02 93.28 374.48 82.33 386.65 94.56 404.12 102.07 440.82 101.01 445.99 106.8 444.7 120.33 418.93 129.35 436.97 155.12 405.4 160.27 410.56 149.32 424.09 158.34 430.53 174.44 420.87 182.31 392.86 204.72 384.79 188.62 371.26 185.39 355.8 190.55 344.21 185.39 328.87 194.41 307.49 207.3 295.89 207.3 285.59 190.55 288.81 182.82 277.21 182.82 268.16 175.25 268.16 175.25 291.3 162.84 279.73 146.25 279.73 133.22 272.7 126.13 282.37 113.89 285.59"
              onClick={handleRegionClick}
              data-region="전라"
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
              className={`cls-1 stroke-[2px] ${
                selectedRegion === "경상"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              d="M422.45,145.16l-7.09,6.44s6.44,2.71,7.09,2.64,6.44-3.29,6.44-3.29l-5.15-5.15-1.29-.64Z"
            />
            <polygon
              className={`cls-1 stroke-[2px] ${
                selectedRegion === "경상"
                  ? "fill-red-200 stroke-gray-300"
                  : "fill-white hover:fill-red-200 stroke-gray-300"
              } cursor-pointer`}
              points="436.63 150.95 434.69 156.11 442.42 158.04 436.63 150.95"
            />
          </svg>
        </div>

        <div
          ref={modalRef}
          className="fixed top-0 right-0 w-[50%] md:w-[30%] h-full bg-black shadow-lg transform opacity-0 p-6"
        >
          {selectedRegion && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4">
                {regionData[selectedRegion].name}
              </h2>
              <p className="text-gray-600 mb-4">
                {regionData[selectedRegion].description}
              </p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">총 캠퍼스</h3>
                <p>{regionData[selectedRegion].population}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">캠퍼스 목록</h3>
                <ul className="list-disc pl-5">
                  {regionData[selectedRegion].attractions.map(
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
    </div>
  );
}
