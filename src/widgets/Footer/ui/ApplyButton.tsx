import { clubJoinLink } from "@/src/entities/link";

export const ApplyButton = () => {
  return (
    <a
      href={clubJoinLink}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full md:w-[60%] py-4 px-8
                bg-red-500 hover:bg-red-600 
                text-white text-center font-black
                rounded-full shadow-lg
                transition-all duration-300 transform hover:scale-105"
    >
      동아리 가입 신청하기
    </a>
  );
};
