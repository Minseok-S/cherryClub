import { regionData } from "@/src/entities/campus";

interface RegionModalProps {
  onClose: () => void;
  onRegionSelect: (region: string) => void;
}

export const RegionModal = ({ onClose, onRegionSelect }: RegionModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-black border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-center">지역 선택</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(regionData).map((region) => (
            <button
              key={region}
              onClick={() => onRegionSelect(region)}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm 
                        py-3 px-4 rounded-xl transition-colors duration-200
                        text-sm md:text-base font-bold"
            >
              {regionData[region].name}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
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
      </div>
    </div>
  );
};
