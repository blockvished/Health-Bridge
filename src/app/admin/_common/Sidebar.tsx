"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { MenuItem, menuItems } from "./menuItems";

interface SidebarProps {
  isCollapsed: boolean;
  isMobile: boolean;
  sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  isMobile,
  sidebarOpen,
}) => {
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Check if the current route is active
  const isActiveRoute = (route: string) => {
    if (!route || route === "#") return false;
    return pathname === route || pathname.startsWith(route);
  };

  // Determine sidebar width and visibility
  const getSidebarClasses = () => {
    if (isMobile) {
      return sidebarOpen ? "w-1/2 left-0" : "w-0 -left-64"; // Hide off-screen when closed on mobile
    } else {
      return isCollapsed ? "w-0 md:w-16" : "w-64";
    }
  };

  return (
    <div
  className={`fixed ${
    isMobile ? "top-32 h-[calc(100vh-128px)]" : "top-0 h-full"
  } bg-gray-800 text-white z-20 transition-all duration-300 overflow-y-auto scrollbar-hide ${getSidebarClasses()}`}
>
  {/* Custom CSS for hiding scrollbar on all devices */}
  <style jsx global>{`
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;  /* Chrome, Safari and Opera */
    }
  `}</style>

      {/* Sidebar header */}
      {!isMobile && (
        <div className="flex items-center p-3 border-b border-gray-700">
          {isMounted && (!isCollapsed || (isMobile && sidebarOpen)) ? (
            <div className="flex items-center space-x-2">
              <img alt="Logo" className="h-6 w-6" />
              <span
                className={`font-bold truncate ${isMobile ? "text-sm" : ""}`}
              >
                Digambar Healthcare
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
            </div>
          )}
        </div>
      )}

      {/* Menu items */}
      <nav className="mt-1">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-0.5">
              {item.dropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`flex items-center w-full py-1.5 px-3 hover:bg-gray-700 transition-colors ${
                      !isCollapsed || (isMobile && sidebarOpen)
                        ? ""
                        : "justify-center"
                    } ${isMobile ? "text-sm" : ""}`}
                  >
                    <span className={isMobile ? "text-base" : "text-lg"}>
                      {item.svg}
                    </span>
                    {(!isCollapsed || (isMobile && sidebarOpen)) &&
                      isMounted && (
                        <>
                          <span className={`ml-2 ${isMobile ? "text-sm" : ""}`}>
                            {item.name}
                          </span>
                          <span className="ml-auto">
                            {openDropdowns[item.name] ? (
                              <FaAngleDown size={isMobile ? 12 : 16} />
                            ) : (
                              <FaAngleRight size={isMobile ? 12 : 16} />
                            )}
                          </span>
                        </>
                      )}
                  </button>
                  {(!isCollapsed || (isMobile && sidebarOpen)) &&
                    isMounted &&
                    openDropdowns[item.name] && (
                      <ul className="pl-6 bg-gray-700">
                        {item.dropdown.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.link}
                              className={`block py-1.5 px-3 hover:bg-gray-600 ${
                                isActiveRoute(subItem.link)
                                  ? "text-blue-400"
                                  : ""
                              } ${isMobile ? "text-sm" : ""}`}
                            >
                              {subItem.svg && (
                                <span className="mr-1.5">{subItem.svg}</span>
                              )}
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ) : (
                <Link
                  href={item.link || "#"}
                  className={`flex items-center py-1.5 px-3 hover:bg-gray-700 transition-colors ${
                    isActiveRoute(item.link || "") ? "bg-blue-500" : ""
                  } ${
                    !isCollapsed || (isMobile && sidebarOpen)
                      ? ""
                      : "justify-center"
                  } ${isMobile ? "text-sm" : ""}`}
                >
                  <span className={isMobile ? "text-base" : "text-lg"}>
                    {item.svg}
                  </span>
                  {(!isCollapsed || (isMobile && sidebarOpen)) && isMounted && (
                    <span className={`ml-2 ${isMobile ? "text-sm" : ""}`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
