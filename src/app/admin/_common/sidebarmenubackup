import React, { useEffect, useRef, useState } from "react";
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
  toggleDropdown: (index: number | null) => void; // Allow null to close dropdown
  isCollapsed: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  menuItems,
  openDropdown,
  toggleDropdown,
  isCollapsed,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleItemClick = (index: number | null) => {
    toggleDropdown(openDropdown === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleDropdown]);

  return (
    <nav className="flex-1 py-2 overflow-y-auto scrollbar-hide" ref={sidebarRef}>
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.dropdown ? (
            <div
              onClick={() => {
                handleItemClick(index);
                setActiveItem(item.name);
              }}
              className={`flex items-center px-2 py-2 hover:bg-gray-700 cursor-pointer rounded-md text-sm transition-all duration-300 ${
                isCollapsed ? "justify-center" : ""
              } ${openDropdown === index ? "bg-gray-600" : ""} ${
                activeItem === item.name ? "text-white font-bold" : "text-gray-300"
              }`}
            >
              <span className="text-lg">{item.svg}</span>
              {!isCollapsed && (
                <span className="ml-3 flex-1 transition-all duration-200">
                  {item.name}
                </span>
              )}
              {!isCollapsed && (
                <span
                  className={`text-xs transition-all duration-300 ${
                    openDropdown === index ? "rotate-90" : "rotate-0"
                  }`}
                >
                  {openDropdown === index ? "▾" : "▸"}
                </span>
              )}
            </div>
          ) : (
            <Link
              href={item.link || "#"}
              onClick={() => {
                toggleDropdown(null);
                setActiveItem(item.name);
              }}
              className={`flex items-center px-2 py-2 hover:bg-gray-700 cursor-pointer rounded-md text-sm transition-all duration-300 ${
                isCollapsed ? "justify-center" : ""
              } ${activeItem === item.name ? "text-white font-bold bg-gray-600" : "text-gray-300"}`}
            >
              <span className="text-lg">{item.svg}</span>
              {!isCollapsed && (
                <span className="ml-3 flex-1 transition-all duration-200">
                  {item.name}
                </span>
              )}
            </Link>
          )}

          {/* Dropdown Animation - Now with 1-second duration */}
          <div
            className={`ml-5 mt-1 border-l border-gray-600 pl-2 transition-all duration-[1000ms] ease-in-out 
            ${openDropdown === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"} 
            overflow-hidden`}
          >
            {item.dropdown?.map((subItem, subIndex) => (
              <Link
                key={subIndex}
                href={subItem.link}
                className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-700 text-sm rounded-md transition-all duration-300 ${
                  activeItem === subItem.name ? "text-white font-bold bg-gray-600" : "text-gray-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveItem(subItem.name);
                }}
              >
                {!subItem.svg && (
                  <FaAngleDoubleRight className={`text-xs ${
                    activeItem === subItem.name ? "text-white" : "text-gray-500"
                  }`} />
                )}
                {subItem.svg && (
                  <span className={`text-xs ${
                    activeItem === subItem.name ? "text-white" : "text-gray-500"
                  }`}>
                    {subItem.svg}
                  </span>
                )}
                {subItem.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default SidebarMenu;
