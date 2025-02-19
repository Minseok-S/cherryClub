export const getSectionName = (section: string) => {
  const names: { [key: string]: string } = {
    map: "현황",
    training: "리더십 훈련",
    campus: "캠퍼스 사역",
    class: "전체 / 지역모임",
    anthor: "대외 사역",
  };
  return names[section] || section;
};
