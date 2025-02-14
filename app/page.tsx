"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const mapRef = useRef(null);

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

  return (
    <div className="min-h-[200vh]">
      <div className="flex items-center justify-center overflow-hidden">
        <div className="title-text-wrapper relative whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <h1
              key={i}
              className="title-text text-[250px] font-black mt-10 inline-block"
            >
              CHERRY_CLUB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </h1>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center -mt-20">
        <div ref={mapRef} className="w-[80vw] max-w-3xl">
          <svg viewBox="0 0 800 1200" className="w-full">
            {/* 여기에 한국 지도 SVG 패스들이 들어갑니다 */}
            <path
              className="region cursor-pointer transition-colors"
              d="M400 300 L450 350 L400 400 L350 350 Z"
              fill="#e5e5e5"
              stroke="#333"
              strokeWidth="2"
              data-region="서울"
            />
            {/* 다른 지역들의 패스도 추가해주세요 */}
          </svg>
        </div>
      </div>
    </div>
  );
}
