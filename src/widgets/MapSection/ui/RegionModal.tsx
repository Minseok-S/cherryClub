import { forwardRef } from "react";
import { regionData } from "@/src/entities/campus";

interface RegionModalProps {
  selectedRegion: string | null;
  onClose: () => void;
}

export const RegionModal = forwardRef<HTMLDivElement, RegionModalProps>(
  ({ selectedRegion, onClose }, ref) => {
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
          <p className="text-gray-600 mb-4">
            {regionData[selectedRegion].description}
          </p>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">
              총 캠퍼스: {regionData[selectedRegion].total}개
            </h2>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">캠퍼스 목록</h2>
            <ul className="list-disc pl-5">
              {regionData[selectedRegion].campus.map((campus, index) => (
                <li key={index}>{campus}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
);

RegionModal.displayName = "RegionModal";
