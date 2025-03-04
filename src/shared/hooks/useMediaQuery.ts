import { useState, useEffect } from "react";

export const useMediaQuery = (query: string): boolean => {
  // SSR을 위한 초기값 설정
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 미디어 쿼리 매처 생성
    const mediaQuery = window.matchMedia(query);

    // 초기값 설정
    setMatches(mediaQuery.matches);

    // 미디어 쿼리 변경 이벤트 리스너
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 이벤트 리스너 등록
    mediaQuery.addEventListener("change", handler);

    // 클린업 함수
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]); // query가 변경될 때마다 effect 재실행

  return matches;
};
