import { useEffect, useState } from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
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
    </div>
  );
};
