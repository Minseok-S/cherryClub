"use client";
import { useState, useEffect } from "react";
import { Sections } from "@/src/shared/constants";

interface UseScrollSpyProps {
  onSectionChange?: (section: string) => void;
}

export const useScrollSpyHeader = ({ onSectionChange }: UseScrollSpyProps) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const currentSection = Sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          );
        }
        return false;
      });

      const newSection = currentSection || "";
      setActiveSection(newSection);
      onSectionChange?.(newSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener("scroll", handleScroll);
  }, [onSectionChange]);

  return { activeSection };
};
