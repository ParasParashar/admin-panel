import { ReactNode } from "react";

interface DashboardDetailsCardProps {
  title: string;
  value: string | number | ReactNode;
  style?: boolean;
}

const DashboardDetailsCard = ({
  title,
  value,
  style = false,
}: DashboardDetailsCardProps) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md ${
        style
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
          : "bg-white"
      }`}
    >
      <h3
        className={`text-lg font-semibold ${
          style ? "text-white" : "text-gray-700"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-2xl font-bold mt-2 ${
          style ? "text-white" : "text-gray-900"
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
  );
};

export default DashboardDetailsCard;
