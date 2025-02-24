import { useEffect, useState } from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export const ServiceCard = ({
  title,
  description,
  icon,
  link,
}: ServiceCardProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg flex flex-col min-h-[200px]">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h4
          className="font-bold"
          style={{
            whiteSpace: isClient ? "pre-line" : "normal",
          }}
        >
          {title}
        </h4>
      </div>
      <p
        className="text-sm text-gray-600 mb-4 text-center"
        style={{ whiteSpace: "pre-line" }}
      >
        {description}
      </p>
      {/* <div className="mt-auto flex justify-center w-full">
        <button
          onClick={() => {
            if (link) {
              window.open(link, "_blank");
            } else {
              alert("아직 신청기간이 아닙니다.");
            }
          }}
          className="bg-red-500 text-white py-2 px-4 rounded-full 
                     hover:bg-red-600 transition-colors duration-300 
                     text-sm font-bold"
        >
          참가 신청
        </button>
      </div> */}
    </div>
  );
};
