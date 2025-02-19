import { useEffect } from "react";
import { gsap } from "gsap";

export const useTextAnimation = (text: string) => {
  useEffect(() => {
    const createAnimatedText = () => {
      const chars = text.split("");
      const container = document.createElement("div");
      container.className =
        "w-[80%] lg:w-[70%] relative mb-10 text-[14px] md:text-[30px] font-black text-center break-keep mx-auto";

      chars.forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.opacity = "0";
        if (char === " ") {
          span.style.marginRight = "0.25em";
        }
        span.style.wordBreak = "keep-all";
        container.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          duration: 0.1,
          delay: index * 0.05,
          ease: "none",
        });
      });

      return container;
    };

    const textWrapper = document.querySelector(".text-wrapper");
    if (textWrapper) {
      textWrapper.innerHTML = "";
      textWrapper.appendChild(createAnimatedText());
    }
  }, [text]);
};
