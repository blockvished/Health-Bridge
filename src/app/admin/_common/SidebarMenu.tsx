import Link from "next/link";
import { JSX } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";

interface MenuItem {
  name: string;
  link?: string;
  svg: JSX.Element;
  dropdown?: { name: string; link: string; svg?: JSX.Element }[];
}

interface SidebarMenuProps {
  menuItems: MenuItem[];
  openDropdown: number | null;
  toggleDropdown: (index: number) => void;
  isCollapsed: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  menuItems,
  openDropdown,
  toggleDropdown,
  isCollapsed,
}) => {
  return (
    <nav className="flex-1 py-2 overflow-y-auto scrollbar-hide">
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.dropdown ? (
            <div
              onClick={() => toggleDropdown(index)}
              className={`flex items-center px-2 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer rounded-md text-sm transition-all ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <span className="text-lg">{item.svg}</span>
              {!isCollapsed && <span className="ml-3 flex-1">{item.name}</span>}
              {!isCollapsed && (
                <span className="text-xs">
                  {openDropdown === index ? "▾" : "▸"}
                </span>
              )}
            </div>
          ) : (
            <Link
              href={item.link || "#"}
              className={`flex items-center px-2 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer rounded-md text-sm transition-all ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <span className="text-lg">{item.svg}</span>
              {!isCollapsed && <span className="ml-3 flex-1">{item.name}</span>}
            </Link>
          )}

          {!isCollapsed && item.dropdown && openDropdown === index && (
            <div className="ml-5 mt-1 border-l border-gray-600 pl-2">
              {item.dropdown.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  href={subItem.link}
                  className="flex items-center gap-2 px-2 py-1 text-gray-400 hover:bg-gray-700 text-sm rounded-md transition-all"
                >
                  {!subItem.svg && (
                    <FaAngleDoubleRight className="text-gray-500 text-xs" />
                  )}
                  {subItem.svg && (
                    <span className="text-gray-500 text-xs">{subItem.svg}</span>
                  )}
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default SidebarMenu;
