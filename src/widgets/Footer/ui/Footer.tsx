import { ApplyButton } from "./ApplyButton";
import { SocialLinks } from "./SocialLinks";

export const Footer = () => {
  return (
    <footer className="backdrop-blur-sm py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* 메인 콘텐츠 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-12">
          {/* 왼쪽 섹션 - 말씀 */}
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-gray-300 text-sm md:text-base leading-relaxed break-keep">
                주의 권능의 날에 주의 백성이 거룩한 옷을 입고 즐거이 헌신하니
                새벽 이슬 같은 주의 청년들이 주께 나오는도다
              </p>
              <p className="text-gray-400 text-sm italic">- 시편 110:3</p>
            </div>
          </div>

          {/* 오른쪽 섹션 - 신청 안내 */}
          <div className="flex flex-col items-center space-y-6">
            <ApplyButton />

            <div className="space-y-4 text-center">
              <p className="text-gray-400 text-sm break-keep">
                문의 : 신용선 간사 (010-5022-8934)
              </p>
            </div>
          </div>
        </div>

        {/* 저작권 */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <SocialLinks />
          <p className="text-gray-400 text-sm">
            © 2025 Cherry Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
