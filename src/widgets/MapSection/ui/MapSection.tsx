"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RegionModal } from "./RegionModal";
import { KoreaMap } from "./KoreaMap";
import { useMapAnimation } from "../model/useMapAnimation";

gsap.registerPlugin(ScrollTrigger);

interface MapSectionProps {
  selectedRegion: string | null;
  setSelectedRegion: (region: string | null) => void;
}

export const MapSection = ({
  selectedRegion,
  setSelectedRegion,
}: MapSectionProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useMapAnimation(mapRef, modalRef, selectedRegion);

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
