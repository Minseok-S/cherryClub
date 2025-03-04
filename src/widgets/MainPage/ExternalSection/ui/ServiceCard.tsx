interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg flex flex-col min-h-[170px] md:min-h-[130px]">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h4 className="font-bold whitespace-pre-line md:whitespace-nowrap">
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
