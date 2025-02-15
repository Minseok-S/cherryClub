"use client";
import { useEffect, useRef, useState } from "react";

interface RegionInfo {
  name: string;
  description: string;
  population: string;
  attractions: string[];
}

const regionData: { [key: string]: RegionInfo } = {
  서울경기: {
    name: "서울/경기도",
    description: "대한민국의 수도권 지역으로, 정치, 경제, 문화의 중심지입니다.",
    population: "약 2,600만명",
    attractions: ["경복궁", "남산타워", "에버랜드", "한강공원"],
  },
  강원: {
    name: "강원도",
    description: "아름다운 자연 경관과 산악 지형이 특징인 동부 지역입니다.",
    population: "약 154만명",
    attractions: ["설악산", "강릉 경포대", "춘천 남이섬", "정선 레일바이크"],
  },
  // ... 다른 지역 데이터도 비슷한 형식으로 추가 ...
};

export default function Home() {
  const mapRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    let ctx: any;
    // 클라이언트 사이드에서만 GSAP와 ScrollTrigger를 임포트
    const initGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // 제목 텍스트 애니메이션
        gsap.to(".title-text-wrapper", {
          x: "-50%",
          repeat: -1,
          duration: 30,
          ease: "none",
          yoyo: false,
        });

        // 초기 지도 스케일 설정
        gsap.set(mapRef.current, {
          scale: 0.5,
          opacity: 0,
        });

        // 스크롤 트리거 애니메이션
        gsap.to(mapRef.current, {
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
          scale: 1,
          opacity: 1,
          duration: 2,
        });

        // 각 지역별 호버 효과
        document.querySelectorAll(".region").forEach((region) => {
          region.addEventListener("mouseenter", () => {
            gsap.to(region, {
              fill: "#4CAF50",
              duration: 0.3,
            });
          });

          region.addEventListener("mouseleave", () => {
            gsap.to(region, {
              fill: "#e5e5e5",
              duration: 0.3,
            });
          });
        });
      });

      return () => ctx.revert();
    };

    initGSAP();
  }, []);

  const handleRegionClick = (e: React.MouseEvent<SVGPathElement>) => {
    const region = e.currentTarget.getAttribute("data-region");
    // 같은 지역을 다시 클릭하면 선택 취소
    if (region === selectedRegion) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(region);
    }
  };

  // 지도 외 영역 클릭 시 선택 취소
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedRegion(null);
    }
  };

  return (
    <div className="min-h-[200vh]">
      <div className="flex items-center justify-center overflow-hidden">
        <div className="title-text-wrapper relative whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <h1
              key={i}
              className="title-text text-[250px] font-black mt-10 inline-block"
            >
              CHERRY CLUB &nbsp;&nbsp;
            </h1>
          ))}
        </div>
      </div>

      <div className="flex gap-8 w-full">
        <div className="w-[60%]">
          <svg viewBox="0 0 800 1200" className="w-full">
            <path
              className={`region cursor-pointer transition-colors ${
                selectedRegion === "서울경기"
                  ? "fill-blue-200"
                  : "fill-[#e5e5e5] hover:fill-blue-100"
              }`}
              d="M380 280 L420 260 L460 280 L450 320 L400 340 L360 320 Z"
              stroke="#333"
              strokeWidth="2"
              data-region="서울경기"
              onClick={handleRegionClick}
            />
            {/* 강원도 */}
            <path
              className={`region cursor-pointer transition-colors ${
                selectedRegion === "강원"
                  ? "fill-blue-200"
                  : "fill-[#e5e5e5] hover:fill-blue-100"
              }`}
              d="M420 260 L500 240 L540 280 L520 340 L450 320 L460 280"
              stroke="#333"
              strokeWidth="2"
              data-region="강원"
              onClick={handleRegionClick}
            />
            {/* 충청도 */}
            <path
              className={`region cursor-pointer transition-colors ${
                selectedRegion === "충청"
                  ? "fill-blue-200"
                  : "fill-[#e5e5e5] hover:fill-blue-100"
              }`}
              d="M360 320 L450 320 L520 340 L500 400 L400 420 L340 380 Z"
              stroke="#333"
              strokeWidth="2"
              data-region="충청"
              onClick={handleRegionClick}
            />
            {/* 전라도 */}
            <path
              className={`region cursor-pointer transition-colors ${
                selectedRegion === "전라"
                  ? "fill-blue-200"
                  : "fill-[#e5e5e5] hover:fill-blue-100"
              }`}
              d="M340 380 L400 420 L380 500 L320 520 L300 460 L320 400 Z"
              stroke="#333"
              strokeWidth="2"
              data-region="전라"
              onClick={handleRegionClick}
            />
            {/* 경상도 */}
            <path
              className={`region cursor-pointer transition-colors ${
                selectedRegion === "경상"
                  ? "fill-blue-200"
                  : "fill-[#e5e5e5] hover:fill-blue-100"
              }`}
              d="M400 420 L500 400 L540 440 L520 500 L440 520 L380 500 Z"
              stroke="#333"
              strokeWidth="2"
              data-region="경상"
              onClick={handleRegionClick}
            />
            {/* 제주도 */}
            <path
              className={`region cursor-pointer transition-colors ${
                selectedRegion === "제주"
                  ? "fill-blue-200"
                  : "fill-[#e5e5e5] hover:fill-blue-100"
              }`}
              d="M320 580 L360 560 L380 580 L360 600 Z"
              stroke="#333"
              strokeWidth="2"
              data-region="제주"
              onClick={handleRegionClick}
            />
          </svg>
        </div>

        {selectedRegion && (
          <div className="w-[40%] p-4 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                {regionData[selectedRegion].name}
              </h2>
              <p className="text-gray-600 mb-4">
                {regionData[selectedRegion].description}
              </p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">인구</h3>
                <p>{regionData[selectedRegion].population}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">주요 관광지</h3>
                <ul className="list-disc pl-5">
                  {regionData[selectedRegion].attractions.map(
                    (attraction, index) => (
                      <li key={index}>{attraction}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
