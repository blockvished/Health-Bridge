import Link from "next/link";
import { JSX } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";

interface MenuItem {
  name: string;
  link?: string;
  svg: JSX.Element;
  dropdown?: { name: string; link: string }[];
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
    <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.dropdown ? (
            <div
              onClick={() => toggleDropdown(index)}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm"
            >
              <span className="mr-2">{item.svg}</span>
              {!isCollapsed && <span>{item.name}</span>}
              {!isCollapsed && (
                <span className="ml-auto">
                  {openDropdown === index ? "▾" : "▸"}
                </span>
              )}
            </div>
          ) : (
            <Link
              href={item.link || "#"}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm"
            >
              <span className="mr-2">{item.svg}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )}

          {!isCollapsed && item.dropdown && openDropdown === index && (
            <div className="ml-6">
              {item.dropdown.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  href={subItem.link}
                  className="flex items-center gap-2 px-4 py-1 text-gray-400 hover:bg-gray-700 text-sm"
                >
                  <FaAngleDoubleRight className="text-gray-400" />
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
