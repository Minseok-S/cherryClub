import { clubJoinLink } from "@/src/entities/link";

export const ClubJoinButton = () => {
  return (
    <div className="flex justify-center mb-32">
      <a
        href={clubJoinLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[50%] md:w-[30%] relative md:text-[20px] font-black text-center
              bg-red-500 text-white py-4 px-8 rounded-full hover:bg-red-600 
              transition-colors duration-300 transform hover:scale-105
              shadow-lg"
      >
        동아리 가입 신청하기
      </a>
    </div>
  );
};
