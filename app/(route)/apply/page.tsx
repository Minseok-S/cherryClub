"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

interface ApplicationForm {
  name: string;
  gender: "남" | "녀";
  phone: string;
  university: string;
  studentId: string;
  grade: string;
  semester: string;
  region: string;
  message: string;
  agree: boolean;
}

interface University {
  name: string;
  country: string;
}

// 국가 코드 번역 객체 추가
const countryCodeTranslator: { [key: string]: string } = {
  "United States": "미국",
  "United Kingdom": "영국",
  Italy: "이탈리아",
  Spain: "스페인",
  Russia: "러시아",
  Brazil: "브라질",
  India: "인도",
  Singapore: "싱가포르",
  Netherlands: "네덜란드",
  Switzerland: "스위스",
  "New Zealand": "뉴질랜드",
  "South Korea": "한국", // 한국 대학 검색시
};

export default function ApplyPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationForm>({
    shouldUnregister: true,
  });

  const [universityQuery, setUniversityQuery] = useState("");
  const [universities, setUniversities] = useState<
    { name: string; country?: string }[]
  >([]);

  // 대학교 검색 API 호출 (HipoLabs Universities API)
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (universityQuery.length > 1) {
        try {
          const response = await fetch(
            `http://universities.hipolabs.com/search?name=${encodeURIComponent(
              universityQuery
            )}&country=South+Korea`
          );
          const data = (await response.json()) as University[];

          const uniqueUniversities = Array.from(
            new Set(data.map((uni) => uni.name))
          )
            .slice(0, 20)
            .map((name) => {
              const rawCountry =
                data.find((uni) => uni.name === name)?.country || "";
              // 국가명 번역 처리
              const translatedCountry =
                countryCodeTranslator[rawCountry] || rawCountry;
              return { name, country: translatedCountry };
            });

          setUniversities(uniqueUniversities);
        } catch (error) {
          console.error("대학교 검색 오류:", error);
        }
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [universityQuery]);

  const onSubmit = async (data: ApplicationForm) => {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          studentId: data.studentId, // student_id로 매핑
        }),
      });

      if (!response.ok) {
        throw new Error("서버 응답 오류");
      }

      alert("성공적으로 제출되었습니다!");
      reset();
    } catch (error) {
      console.error("제출 실패:", error);
      alert("제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        동아리 가입 신청
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 이름 입력 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            성명 <span className="text-white">*</span>
          </label>
          <input
            {...register("name", { required: true })}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-black text-white placeholder-gray-400"
          />
          {errors.name && (
            <span className="text-red-500">필수 입력 항목입니다</span>
          )}
        </div>

        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            성별 <span className="text-white">*</span>
          </label>
          <select
            {...register("gender", { required: true })}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-white"
          >
            <option value="">선택하세요</option>
            <option value="남">남자</option>
            <option value="녀">여자</option>
          </select>
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            전화번호 <span className="text-white">*</span>
          </label>
          <input
            {...register("phone", {
              required: true,
              pattern: /^01[0-9]{1}-[0-9]{3,4}-[0-9]{4}$/,
              onChange: (e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length >= 3 && value.length <= 7) {
                  e.target.value = `${value.slice(0, 3)}-${value.slice(3)}`;
                } else if (value.length >= 8) {
                  e.target.value = `${value.slice(0, 3)}-${value.slice(
                    3,
                    7
                  )}-${value.slice(7, 11)}`;
                } else {
                  e.target.value = value;
                }
              },
            })}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white placeholder-gray-400"
            placeholder="010-1234-5678"
            maxLength={13}
          />
          {errors.phone && (
            <span className="text-red-500">유효한 전화번호를 입력해주세요</span>
          )}
        </div>

        {/* 대학교명 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            대학교명 <span className="text-white">*</span>
          </label>
          <input
            {...register("university", { required: true })}
            list="universityList"
            onChange={(e) => setUniversityQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white placeholder-gray-400"
            placeholder="대학교명을 영어로 검색하세요 (예: Harvard)"
          />
          <datalist id="universityList">
            {universities.map((uni, index) => (
              <option key={index} value={`${uni.name} (${uni.country})`} />
            ))}
          </datalist>
          {errors.university && (
            <span className="text-red-500">필수 입력 항목입니다</span>
          )}
        </div>

        {/* 학번 및 학년/학기 */}
        <div>
          {/* 학번 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              학번 <span className="text-white">*</span>
            </label>
            <input
              {...register("studentId", {
                required: true,
                pattern: /^[0-9]+$/,
              })}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white placeholder-gray-400"
              placeholder="예) 20231234"
            />
          </div>

          {/* 학년/학기 선택 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                학년 <span className="text-white">*</span>
              </label>
              <select
                {...register("grade", { required: true })}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-white"
              >
                <option value="">선택</option>
                {[1, 2, 3, 4, 5, 6].map((year) => (
                  <option key={year} value={`${year}학년`}>
                    {year}학년
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                학기 <span className="text-white">*</span>
              </label>
              <select
                {...register("semester", { required: true })}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-white"
              >
                <option value="">선택</option>
                {[1, 2].map((semester) => (
                  <option key={semester} value={`${semester}학기`}>
                    {semester}학기
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 지역 선택 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            지역 <span className="text-white">*</span>
          </label>
          <select
            {...register("region", { required: true })}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-white"
          >
            <option value="">선택하세요</option>
            {[
              "서울",
              "인천경기",
              "대전충청",
              "대구포항",
              "부산창원",
              "호남제주",
              "강원",
              "기타",
            ].map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* 하고싶은말 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            하고싶은말
          </label>
          <textarea
            {...register("message")}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 bg-black text-white placeholder-gray-400"
            placeholder="자유롭게 작성해주세요 (최대 500자)"
          />
        </div>

        {/* 개인정보 동의 */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register("agree", { required: true })}
            className="w-5 h-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-black"
          />
          <label className="text-sm text-white">
            개인정보 수집 및 이용에 동의합니다{" "}
            <span className="text-white">*</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-700"
          // disabled={!formState.isValid}
        >
          제출하기
        </button>
      </form>
    </div>
  );
}
