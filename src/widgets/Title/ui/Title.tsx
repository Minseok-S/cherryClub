import { ClubJoinButton } from "@/src/features/join";
import { useTextAnimation } from "../model/useTextAnimation";

export function Title() {
  const text =
    "체리 동아리는 '체인저 리더십(Changer Leadership) 동아리'의 준말로, 성경적 리더십 훈련을 통해 나를 변화시키고, 내가 속한 캠퍼스와 사회의 각 영역을 변화시키는 동아리입니다!";

  useTextAnimation(text);

  return (
    <div className="relative">
      <div className="absolute inset-0 w-full h-[350px] md:h-[680px] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/title.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* 기존 콘텐츠를 relative로 설정하여 비디오 위에 표시 */}
      <div className="relative">
        <div className="flex items-center justify-center pt-10 mt-40 md:mt-44 mb-10 md:mb-0">
          <div className="title-text-wrapper relative whitespace-nowrap">
            <h1 className="title-text text-[clamp(50px,10vw,100px)] md:text-[clamp(100px,12vw,250px)] font-black">
              CHERRY CLUB
            </h1>
          </div>
        </div>

        {/* 체리동아리 소개 */}
        <div className="flex justify-center">
          <div className="text-wrapper w-full flex justify-center">
            <p className="w-[80%] lg:w-[70%] relative mb-10 text-[14px] md:text-[30px] font-black text-center break-keep break-words">
              {text}
            </p>
          </div>
        </div>
      </div>

      {/* 체리동아리 신청 */}
      <ClubJoinButton />
    </div>
  );
}
