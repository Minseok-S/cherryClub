import { forwardRef, useState } from "react";
import { regionData } from "@/src/entities/campus";

interface RegionModalProps {
  selectedRegion: string | null;
  onClose: () => void;
}

export const RegionModal = forwardRef<HTMLDivElement, RegionModalProps>(
  ({ selectedRegion, onClose }, ref) => {
    const [showKakaoModal, setShowKakaoModal] = useState(false);
    const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

    if (!selectedRegion) return null;

    return (
      <div
        ref={ref}
        className="fixed top-0 right-0 w-[50%] md:w-[40%] h-full bg-black shadow-lg transform opacity-0 p-6 overflow-y-auto z-50"
      >
        <div className="animate-fadeIn relative">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white z-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
            style={{ zIndex: -1 }}
          />

          <h2 className="text-2xl font-bold mb-4 pr-8">
            {regionData[selectedRegion].name}
          </h2>

          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">
              총 캠퍼스: {regionData[selectedRegion].total}개
            </h2>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">캠퍼스 목록</h2>
            <ul className="list-disc pl-5">
              {regionData[selectedRegion].campus.map(
                (campus: any, index: any) => (
                  <li
                    key={index}
                    className="cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() => {
                      setSelectedCampus(campus);
                      setShowKakaoModal(true);
                    }}
                  >
                    {campus}
                  </li>
                )
              )}
            </ul>
          </div>

          {showKakaoModal && selectedCampus && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl text-black font-bold">간사: 000</h3>
                  <h3 className="text-xl text-black font-bold">
                    {selectedCampus} 카카오톡 ID
                  </h3>
                  <button
                    onClick={() => {
                      setShowKakaoModal(false);
                      setSelectedCampus(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                //TODO : 카카오톡 모달 해줘
                <p className="break-words text-black">
                  {regionData[selectedRegion].campusKakaoId?.[selectedCampus] ||
                    "임시 카카오톡 ID: 12345"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

RegionModal.displayName = "RegionModal";
