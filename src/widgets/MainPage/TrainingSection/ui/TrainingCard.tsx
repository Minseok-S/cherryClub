import { useState } from "react";

interface TrainingCardProps {
  title: string;
  front: string;
  back: string;
  isFlipped: boolean;
  onClick: () => void;
}

export const TrainingCard = ({
  title,
  front,
  back,
  isFlipped,
  onClick,
}: TrainingCardProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    onClick();
    setIsFocused(!isFocused);
  };

  return (
    <div
      className={`relative h-[150px] perspective-1000 transition-all duration-500 z-50`}
      onClick={handleClick}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* 앞면 */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm p-4 md:p-6 rounded-xl [backface-visibility:hidden] flex flex-col justify-center z-10">
          <h4 className="text-lg md:text-2xl font-black mb-2 md:mb-3">
            {title}
          </h4>
          <p className="text-gray-600 text-xs md:text-base font-bold whitespace-normal break-keep">
            {front}
          </p>
          <span className="absolute bottom-2 right-2 text-xs text-gray-400">
            click
          </span>
        </div>

        {/* 뒷면 */}
        <div
          className="absolute inset-0 bg-red-500/90 backdrop-blur-sm p-1 md:p-6 rounded-xl 
  [backface-visibility:hidden] flex items-center justify-center  w-[110%] [transform:rotateY(180deg)_translateZ(50px)]"
        >
          <p className="text-xs md:text-lg text-white font-bold whitespace-pre-line break-keep text-center">
            {back}
          </p>
        </div>
      </div>
    </div>
  );
};
