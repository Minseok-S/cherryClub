import { RegionInfo } from "./types";

export const regionData: { [key: string]: RegionInfo } = {
  서울: {
    name: "서울 캠퍼스",
    description: "대한민국의 수도권 지역으로, 정치, 경제, 문화의 중심지입니다.",
    total: "19개",
    campus: [
      "서울대학교",
      "연세대학교",
      "고려대학교",
      "한양대학교",
      "성균관대학교",
    ],
  },
  경기인천: {
    name: "경기/인천 캠퍼스",
    description: "대한민국의 수도권 지역으로, 정치, 경제, 문화의 중심지입니다.",
    total: "19개",
    campus: [
      "서울대학교",
      "연세대학교",
      "고려대학교",
      "한양대학교",
      "성균관대학교",
    ],
  },
  강원: {
    name: "강원 캠퍼스",
    description: "아름다운 자연 경관과 산악 지형이 특징인 동부 지역입니다.",
    total: "약 154만명",
    campus: [
      "강원대학교",
      "한림대학교",
      "연세대학교 원주캠퍼스",
      "경동대학교",
      "강릉원주대학교",
    ],
  },
  대전충청: {
    name: "대전/충청 캠퍼스",
    description: "역사와 자연이 어우러진 중부 지역입니다.",
    total: "약 320만명",
    campus: [
      "충남대학교",
      "한남대학교",
      "충북대학교",
      "KAIST",
      "건국대학교 글로컬캠퍼스",
    ],
  },
  경상: {
    name: "경상 캠퍼스",
    description: "유서 깊은 문화유산과 현대 산업이 공존하는 지역입니다.",
    total: "약 510만명",
    campus: [
      "경북대학교",
      "부산대학교",
      "영남대학교",
      "동아대학교",
      "울산대학교",
    ],
  },
  호남제주: {
    name: "호남/제주 캠퍼스",
    description:
      "대한민국의 대표적인 관광지로, 아름다운 자연과 독특한 문화가 있는 섬입니다.",
    total: "약 69만명",
    campus: ["제주대학교"],
  },
};
