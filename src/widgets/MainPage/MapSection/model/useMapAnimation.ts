import { RefObject, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useMapAnimation = (
  mapRef: RefObject<HTMLDivElement | null>,
  modalRef: RefObject<HTMLDivElement | null>,
  selectedRegion: string | null
) => {
  // 초기 스케일 애니메이션
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
        scale: mediaQuery.matches ? 0.5 : 0.9,
        opacity: 1,
        duration: 1,
      });
    });

    return () => ctx.revert();
  }, [mapRef]);

  // 지도 이동 및 모달 애니메이션
  useEffect(() => {
    gsap.to(mapRef.current, {
      x: selectedRegion ? "-20%" : "0%",
      duration: 0.5,
      ease: "power2.out",
    });

    const map = mapRef.current;
    if (!map) return;

    // 선택되지 않은 지역들 흐리게 처리
    const allPaths = map.querySelectorAll("[data-region]");
    const selectedPath = map.querySelector(`[data-region="${selectedRegion}"]`);

    // 모든 지역을 원래 상태로 되돌리기
    allPaths.forEach((path) => {
      gsap.to(path, {
        opacity: selectedRegion ? 0.03 : 1,
        scale: 1,
        filter: "none",
        duration: 0.3,
      });
    });

    // 선택된 지역이 있을 경우에만 강조 효과 적용
    if (selectedPath && selectedRegion) {
      gsap.to(selectedPath, {
        opacity: 1,
        scale: 1.2,
        transformOrigin: "center center",
        filter: "drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.3))",
        duration: 0.5,
        ease: "power2.out",
      });
    }

    gsap.to(modalRef.current, {
      x: selectedRegion ? 0 : "100%",
      opacity: selectedRegion ? 1 : 0,
      duration: 0.5,
      ease: selectedRegion ? "power2.out" : "power2.in",
    });

    // 헤더 애니메이션
    const header = document.getElementById("main-header");
    gsap.to(header, {
      opacity: selectedRegion ? 0 : 1,
      y: selectedRegion ? -20 : 0,
      duration: 0.3,
    });
  }, [selectedRegion, mapRef, modalRef]);
};
