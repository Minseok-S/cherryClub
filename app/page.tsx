"use client";
import { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Header } from "@/src/widgets/Header";
import { ScrollIndicator } from "@/src/features/scroll";
import { Title } from "@/src/widgets/Title";
import { MapSection } from "@/src/widgets/MapSection";
import { TrainingSection } from "@/src/widgets/TrainingSection";
import { CampusSection } from "@/src/widgets/CampusSection";
import { MeetingSection } from "@/src/widgets/MeetingSection";
import { ExternalSection } from "@/src/widgets/ExternalSection";
import { Footer } from "@/src/widgets/Footer";
import { VideoSection } from "@/src/widgets/VideoSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <div className="min-h-[200vh] relative">
      {/* 스크롤 유도 - 조건부 렌더링 추가 */}
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
