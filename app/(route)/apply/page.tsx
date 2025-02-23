"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";

interface ApplicationForm {
  name: string;
  gender: "남" | "녀";
  phone: string;
  birthdate: string;
  region: string;
  university: string;
  major: string;
  studentId: string;
  grade: string;
  message: string;
  agree: boolean;
}

export default function ApplyPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ApplicationForm>({
    shouldUnregister: true,
  });

  const [universityQuery, setUniversityQuery] = useState("");
  const [universities, setUniversities] = useState<
    { name: string; country?: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      if (universityQuery.length < 2) return;

      try {
        const controller = new AbortController();
        const signal = controller.signal;

        const response = await fetch(
          `/api/universities?query=${encodeURIComponent(universityQuery)}`,
          {
            signal,
          }
        );

        if (!response.ok) throw new Error("Failed to fetch universities");
        const data = await response.json();
        setUniversities(data);
      } catch (error) {
        console.error("대학교 검색 오류:", error);
      }
    };

    const debounceTimer = setTimeout(fetchUniversities, 300);
    return () => clearTimeout(debounceTimer);
  }, [universityQuery]);

  // 모달 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          birthdate: data.birthdate, // birth_date로 매핑
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

  // 대학교 선택 핸들러
  const handleSelectUniversity = (name: string) => {
    setSelectedUniversity(name);
    setIsModalOpen(false);
    setValue("university", name); // react-hook-form 값 업데이트
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
              pattern: /^010-\d{4}-\d{4}$/,
              onChange: (e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                let formatted = value;
                if (value.length > 3 && value.length <= 7) {
                  formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
                } else if (value.length > 7) {
                  formatted = `${value.slice(0, 3)}-${value.slice(
                    3,
                    7
                  )}-${value.slice(7, 11)}`;
                }
                e.target.value = formatted;
              },
            })}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white placeholder-gray-400"
            placeholder="010-1234-5678"
            maxLength={13}
          />
          {errors.phone && (
            <span className="text-red-500">
              010으로 시작하는 11자리 숫자를 입력해주세요
            </span>
          )}
        </div>

        {/* 생년월일 입력 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            생년월일 <span className="text-white">*</span>
          </label>
          <input
            type="text"
            {...register("birthdate", {
              required: true,
              pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
              onChange: (e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                let formatted = value;
                if (value.length > 4 && value.length <= 6) {
                  formatted = `${value.slice(0, 4)}-${value.slice(4, 6)}`;
                } else if (value.length > 6) {
                  formatted = `${value.slice(0, 4)}-${value.slice(
                    4,
                    6
                  )}-${value.slice(6, 8)}`;
                }
                e.target.value = formatted.slice(0, 10);
              },
            })}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white placeholder-gray-400"
            placeholder="YYYY-MM-DD"
            maxLength={10}
          />
          {errors.birthdate && (
            <span className="text-red-500">
              유효한 생년월일을 입력해주세요 (YYYY-MM-DD)
            </span>
          )}
        </div>

        {/* 대학교명 입력 (모달 트리거) */}
        <div className="relative">
          <label className="block text-sm font-medium text-white mb-2">
            대학교명 <span className="text-white">*</span>
          </label>
          <input
            {...register("university", { required: true })}
            value={selectedUniversity}
            onClick={() => setIsModalOpen(true)}
            onChange={(e) => {
              setUniversityQuery(e.target.value);
              setSelectedUniversity(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white placeholder-gray-400 cursor-pointer"
            placeholder="대학교 검색 (클릭하여 검색)"
            readOnly // 직접 입력 방지
          />

          {/* 검색 모달 */}
          {isModalOpen && (
            <div
              ref={modalRef}
              className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <div className="p-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="대학교명 검색..."
                  className="w-full px-3 py-2 mb-2 bg-gray-900 text-white rounded-md"
                  value={universityQuery}
                  onChange={(e) => setUniversityQuery(e.target.value)}
                />
                {universities.length === 0 ? (
                  <div className="p-3 text-gray-400">검색 결과가 없습니다</div>
                ) : (
                  universities.map((uni) => (
                    <div
                      key={uni.name}
                      onClick={() => handleSelectUniversity(uni.name)}
                      className="p-3 hover:bg-gray-700 cursor-pointer rounded-md text-white"
                    >
                      {uni.name} {uni.country && `(${uni.country})`}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {errors.university && (
            <span className="text-red-500">필수 입력 항목입니다</span>
          )}
        </div>

        {/* 전공 입력 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            전공 <span className="text-white">*</span>
          </label>
          <input
            {...register("major", { required: true })}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white placeholder-gray-400"
            placeholder="전공을 입력해주세요"
          />
          {errors.major && (
            <span className="text-red-500">필수 입력 항목입니다</span>
          )}
        </div>

        {/* 학번 입력 추가 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            학번 <span className="text-white">*</span>
          </label>
          <input
            {...register("studentId", {
              required: true,
              pattern: /^\d{8,10}$/,
            })}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white placeholder-gray-400"
            placeholder="학번을 입력해주세요 (숫자만)"
          />
          {errors.studentId && (
            <span className="text-red-500">8~10자리 숫자로 입력해주세요</span>
          )}
        </div>

        {/* 학년 선택 수정 (학기 제거) */}
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

        {/* 지역 선택 옵션 수정 */}
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
              "경기인천",
              "대전충청",
              "대구경북",
              "부산경남",
              "광주전라",
              "강원",
              "제주",
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
