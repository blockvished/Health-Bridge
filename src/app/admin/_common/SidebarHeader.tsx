import { FaHospital } from "react-icons/fa";

interface SidebarHeaderProps {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  isCollapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClick, isCollapsed }) => {
  return (
    <div
      className={`flex items-center px-4 py-4 border-b border-gray-700 text-sm cursor-pointer hover:bg-gray-700 transition-all duration-300 ${
        isCollapsed ? "justify-center" : "gap-3"
      }`}
      onClick={onClick}
    >
      {/* Hospital Icon Button with Hover Effect */}
      <div
        className={`bg-gray-600 p-3 rounded-full flex items-center justify-center hover:bg-gray-500 transition-transform duration-300 ${
          isCollapsed ? "scale-105" : "scale-100"
        }`}
      >
        <FaHospital className="text-white text-lg" />
      </div>

      {/* Animated Text with Smooth Fade-In */}
      {!isCollapsed && (
        <span
          className="font-semibold text-white transition-opacity duration-300 ease-out"
          style={{ transitionDelay: "0.2s" }}
        >
          Digambar Healthcare
        </span>
      )}
    </div>
  );
};

export default SidebarHeader;
