"use client";
import { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Header } from "@/src/widgets/MainPage/Header";
import { ScrollIndicator } from "@/src/features/scroll";
import { Title } from "@/src/widgets/MainPage/Title";
import { MapSection } from "@/src/widgets/MainPage/MapSection";
import { TrainingSection } from "@/src/widgets/MainPage/TrainingSection";
import { CampusSection } from "@/src/widgets/MainPage/CampusSection";
import { MeetingSection } from "@/src/widgets/MainPage/MeetingSection";
import { ExternalSection } from "@/src/widgets/MainPage/ExternalSection";
import { Footer } from "@/src/widgets/MainPage/Footer";
import { VideoSection } from "@/src/widgets/MainPage/VideoSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <div className="min-h-[200vh] relative">
      <ScrollIndicator />

      {/* 헤더*/}
      <Header setSelectedRegion={setSelectedRegion} />

      {/* 타이틀 */}
      <Title />

      {/* 현황 지도 */}
      <MapSection
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      {/*리더십 훈련 */}
      <TrainingSection />

      {/*캠퍼스 훈련 */}
      <CampusSection />

      {/*전체/지역 모임 */}
      <MeetingSection />

      {/*대외 사역 */}
      <ExternalSection />

      <VideoSection />

      <Footer />
    </div>
  );
}
