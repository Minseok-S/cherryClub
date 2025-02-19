"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RegionModal } from "./RegionModal";
import { KoreaMap } from "./KoreaMap";

gsap.registerPlugin(ScrollTrigger);

interface MapSectionProps {
  selectedRegion: string | null;
  setSelectedRegion: (region: string | null) => void;
}

export const MapSection = ({
  selectedRegion,
  setSelectedRegion,
}: MapSectionProps) => {
  const mapRef = useRef(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // GSAP 애니메이션 - 지도 스케일
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mediaQuery = window.matchMedia("(min-width: 768px)");

      gsap.set(mapRef.current, {
        scale: mediaQuery.matches ? 0.2 : 0.3,
        opacity: 0,
        x: "0%",
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
    });

    return () => ctx.revert();
  }, []);

  // GSAP 애니메이션 - 지도 이동 및 모달
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

  // 헤더 가시성 제어
  useEffect(() => {
    const header = document.getElementById("main-header");
    if (selectedRegion) {
      gsap.to(header, { opacity: 0, y: -20, duration: 0.3 });
    } else {
      gsap.to(header, { opacity: 1, y: 0, duration: 0.3 });
    }
  }, [selectedRegion]);

  const handleRegionClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const region = e.currentTarget.getAttribute("data-region");
    setSelectedRegion(region === selectedRegion ? null : region);
  };

  return (
    <div
      id="map"
      className="pb-10 md:pb-20 px-4 min-h-screen flex flex-col items-center justify-center"
    >
      <div className="w-[100%] md:w-[110%] lg:w-[60%] relative" ref={mapRef}>
        <p className="text-center md:text-[40px] font-black">
          전국 동아리 현황
        </p>
        <KoreaMap
          selectedRegion={selectedRegion}
          onRegionClick={handleRegionClick}
        />
      </div>

      <RegionModal
        ref={modalRef}
        selectedRegion={selectedRegion}
        onClose={() => setSelectedRegion(null)}
      />
    </div>
  );
};
