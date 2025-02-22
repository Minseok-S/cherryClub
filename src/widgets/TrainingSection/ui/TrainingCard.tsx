interface TrainingCardProps {
  title: string;
  front: string;
  back: string;
}

export const TrainingCard = ({ title, front, back }: TrainingCardProps) => {
  return (
    <div className="group [perspective:1000px] h-[150px] md:h-[150px]">
      <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* 앞면 */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm p-6 rounded-xl [backface-visibility:hidden] flex flex-col justify-center">
          <h4 className="md:text-2xl font-black mb-3">{title}</h4>
          <p className="text-gray-600  md:text-base font-bold whitespace-normal break-keep">
            {front}
          </p>
        </div>

        {/* 뒷면 */}
        <div className="absolute inset-0 bg-red-500/90 backdrop-blur-sm p-6 rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center">
          <p
            className="text-white font-bold whitespace-normal break-keep text-center"
            style={{ whiteSpace: "pre-line" }}
          >
            {back}
          </p>
        </div>
      </div>
    </div>
  );
};
