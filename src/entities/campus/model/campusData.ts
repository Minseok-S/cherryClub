import { RegionInfo } from "./types";

export const regionData: { [key: string]: RegionInfo } = {
  서울: {
    name: "서울 캠퍼스",
    description: "대한민국의 수도권 지역으로, 정치, 경제, 문화의 중심지입니다.",
    get total() {
      return String(this.campus.length);
    },
    campus: [
      "감리교신학대학교",
      "고려대학교",
      "국민대학교",
      "동양미래대학교",
      "디지털서울문화예술대학교",
      "명지대학교",
      "명지전문대학교",
      "배화여자대학교",
      "백석예술대학교",
      "상명대학교",
      "서울대학교",
      "서울여자대학교",
      "성균관대학교",
      "성신여자대학교",
      "숭실대학교",
      "연세대학교",
      "이화여자대학교",
      "장로회신학대학교",
      "총신대학교",
      "한국예술종합학교",
      "한국외국어대학교",
      "한양대학교",
    ],
  },
  경기인천: {
    name: "경기/인천 캠퍼스",
    description: "대한민국의 수도권 지역으로, 정치, 경제, 문화의 중심지입니다.",
    get total() {
      return String(this.campus.length);
    },
    campus: [
      "가천대학교",
      "단국대학교",
      "서울신학대학교",
      "서울장신대학교",
      "성결대학교",
      "수원대학교",
      "수원여자대학교",
      "신구대학교",
      "한호전",
    ],
  },
  강원: {
    name: "강원 캠퍼스",
    description: "아름다운 자연 경관과 산악 지형이 특징인 동부 지역입니다.",
    get total() {
      return String(this.campus.length);
    },
    campus: ["한림대학교"],
  },
  대전충청: {
    name: "대전/충청 캠퍼스",
    description: "역사와 자연이 어우러진 중부 지역입니다.",
    get total() {
      return String(this.campus.length);
    },
    campus: [
      "고려대학교 세종캠퍼스",
      "공주대학교",
      "나사렛대학교",
      "대전대학교",
      "목원대학교",
      "배재대학교",
      "백석대학교",
      "세명대학교",
      "유원대학교",
      "중원대학교",
      "충북대학교",
      "한국교통대학교",
      "한남대학교",
      "한밭대학교",
      "혜전대학교",
      "호서대학교 아산캠퍼스",
      "홍익대학교 세종캠퍼스",
    ],
  },
  경상: {
    name: "경상 캠퍼스",
    description: "유서 깊은 문화유산과 현대 산업이 공존하는 지역입니다.",
    get total() {
      return String(this.campus.length);
    },
    campus: [
      "동서대학교",
      "부경대학교",
      "부산대학교",
      "영산대학교",
      "창원대학교",
      "계명대학교",
      "한동대학교",
    ],
  },
  호남제주: {
    name: "호남/제주 캠퍼스",
    description:
      "대한민국의 대표적인 관광지로, 아름다운 자연과 독특한 문화가 있는 섬입니다.",
    get total() {
      return String(this.campus.length);
    },
    campus: ["순천대학교", "전북과학대학교", "제주대학교", "호원대학교"],
  },
};
