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
      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center px-4">
        <p className="text-center text-white md:text-4xl font-bold max-w-3xl break-keep leading-relaxed">
          가장 탁월한 지도력의 롤모델, 예수 그리스도의 모습을 통해 신분과 사명을
          알고, 자신의 장막터를 넓히기 원하시는 여러분을 환영합니다
        </p>
      </div>
    </div>
  );
};
