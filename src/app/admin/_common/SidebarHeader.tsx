import { FaHospital } from "react-icons/fa";

interface SidebarHeaderProps {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClick }) => {
  return (
    <div
      className="flex items-center gap-3 px-4 py-4 border-b border-gray-700 text-sm cursor-pointer hover:bg-gray-700"
      onClick={onClick}
    >
      <FaHospital className="text-lg" />
      <span className="font-semibold">Digambar Healthcare</span>
    </div>
  );
};

export default SidebarHeader;
