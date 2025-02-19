import { useShowScrollIndicator } from "../model/useShowScrollIndicator";

export const ScrollIndicator = () => {
  const showScrollIndicator = useShowScrollIndicator();

  return (
    showScrollIndicator && (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="scroll-indicator animate-bounce cursor-pointer">
          <svg
            className="h-8 md:h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    )
  );
};
