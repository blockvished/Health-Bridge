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
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [isMouseOverSidebar, setIsMouseOverSidebar] = useState(false);

  const handleItemClick = (index: number | null) => {
    toggleDropdown(openDropdown === index ? null : index);
  };

  const handleMouseEnter = (index: number, event: React.MouseEvent) => {
    if (isCollapsed) {
      setHoveredItem(index);
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setDropdownPosition({ top: rect.top, left: rect.right + 10 });
    }
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isCollapsed || !isMouseOverSidebar) return;
    
    // Find which menu item the mouse is over
    const menuItems = sidebarRef.current?.querySelectorAll('.menu-item');
    if (!menuItems) return;
    
    for (let i = 0; i < menuItems.length; i++) {
      const rect = menuItems[i].getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom && 
          e.clientX >= rect.left && e.clientX <= rect.right) {
        setHoveredItem(i);
        setDropdownPosition({ top: rect.top, left: rect.right + 10 });
        return;
      }
    }
  };

  useEffect(() => {
    if (isCollapsed) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isCollapsed, isMouseOverSidebar]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        const dropdownElement = document.querySelector('.sidebar-dropdown');
        if (!dropdownElement || !dropdownElement.contains(event.target as Node)) {
          toggleDropdown(null);
          setHoveredItem(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleDropdown]);

  return (
    <nav 
      className="flex-1 py-2 overflow-y-auto scrollbar-hide" 
      ref={sidebarRef}
      onMouseEnter={() => setIsMouseOverSidebar(true)}
      onMouseLeave={() => {
        setIsMouseOverSidebar(false);
        // Only hide tooltip if not over dropdown
        const dropdownElement = document.querySelector('.sidebar-dropdown');
        if (!dropdownElement || !dropdownElement.matches(':hover')) {
          setHoveredItem(null);
        }
      }}
    >
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.dropdown ? (
            <div
              onClick={() => {
                handleItemClick(index);
                setActiveItem(item.name);
              }}
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              className={`menu-item flex items-center px-2 py-2 hover:bg-gray-700 cursor-pointer rounded-md text-sm transition-all duration-300 ${
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
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && hoveredItem === index && (
                <div className="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded z-50 whitespace-nowrap flex items-center shadow-lg">
                  <span>{item.name}</span>
                  <span className="ml-2 text-xs">▸</span>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={item.link || "#"}
              onClick={() => {
                toggleDropdown(null);
                setActiveItem(item.name);
              }}
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              className={`menu-item flex items-center px-2 py-2 hover:bg-gray-700 cursor-pointer rounded-md text-sm transition-all duration-300 ${
                isCollapsed ? "justify-center" : ""
              } ${activeItem === item.name ? "text-white font-bold bg-gray-600" : "text-gray-300"}`}
            >
              <span className="text-lg">{item.svg}</span>
              {!isCollapsed && (
                <span className="ml-3 flex-1 transition-all duration-200">
                  {item.name}
                </span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && hoveredItem === index && (
                <div className="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded z-50 whitespace-nowrap shadow-lg">
                  {item.name}
                </div>
              )}
            </Link>
          )}

          {/* Regular dropdown for non-collapsed state */}
          {!isCollapsed && (
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
          )}
          
          {/* Dropdown for collapsed state - absolute positioned with smooth corners */}
          {isCollapsed && item.dropdown && (hoveredItem === index || openDropdown === index) && dropdownPosition && (
            <div
              className="absolute bg-gray-800 text-white shadow-lg rounded-md overflow-hidden p-0 w-48 z-50 sidebar-dropdown"
              style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
              onMouseEnter={() => {
                setHoveredItem(index);
                setIsMouseOverSidebar(true);
              }}
              onMouseLeave={() => {
                setTimeout(() => {
                  if (!isMouseOverSidebar) {
                    setHoveredItem(null);
                  }
                }, 50);
              }}
            >
              <div className="font-medium px-3 py-2 border-b border-gray-700 bg-gray-800">{item.name}</div>
              <div className="py-1">
                {item.dropdown.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.link}
                    className={`flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700 text-sm transition-all duration-300 ${
                      activeItem === subItem.name ? "text-white font-bold bg-gray-700" : "text-gray-300"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveItem(subItem.name);
                      toggleDropdown(null);
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
          )}
        </div>
      ))}
    </nav>
  );
};

export default SidebarMenu;