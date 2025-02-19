"use client";
import { useEffect, useState } from "react";

export const useShowScrollIndicator = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

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

  return showScrollIndicator;
};
