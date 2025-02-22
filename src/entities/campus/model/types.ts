export interface RegionData {
  name: string;
  description: string;
  total: number;
  campus: string[];
  campusKakaoId: Record<string, string>; // 추가된 필드
}
