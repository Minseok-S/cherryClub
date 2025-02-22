export const VideoSection = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[550px] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-[center_83%]"
      >
        <source src="/end.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center px-4">
        <p className="text-center text-white md:text-5xl font-bold max-w-3xl whitespace-pre-line leading-relaxed">
          오늘은 캠퍼스로! {"\n"} 내일은 열방으로! {"\n"} 체리동아리가
          함께합니다!
        </p>
      </div>
    </div>
  );
};
