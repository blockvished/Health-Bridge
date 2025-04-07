"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { menuItemsAdmin } from "./menuItems";
import LeftPopup from "./LeftPopup";
import { live_doctors_icon } from "./global_variables";

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
  const [showPopup, setShowPopup] = useState(false);
  const sidebarButtonRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => {
      // Create a new object with all dropdowns closed
      const newDropdowns: { [key: string]: boolean } = {};

      // If the clicked dropdown was not previously open, open it
      if (!prev[name]) {
        newDropdowns[name] = true;
      }

      return newDropdowns;
    });
  };

  // Toggle popup function
  const togglePopup = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowPopup(!showPopup);
  };

  // Close popup function
  const closePopup = () => {
    setShowPopup(false);
  };

  const isActiveRoute = (route: string) => {
    if (!route || route === "#") return false;
    return pathname === route;
  };

  // Determine sidebar width and visibility
  const getSidebarClasses = () => {
    if (isMobile) {
      return sidebarOpen ? "w-1/2 left-0" : "w-0 -left-64"; // Hide off-screen when closed on mobile
    } else {
      return isCollapsed ? "w-0 md:w-16" : "w-64";
    }
  };

  // Handle clicks outside the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking on the sidebar button
      if (
        sidebarButtonRef.current &&
        sidebarButtonRef.current.contains(event.target as Node)
      ) {
        return;
      }

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <>
      <div
        className={`fixed ${
          isMobile ? "top-32 h-[calc(100vh-128px)]" : "top-0 h-full"
        } bg-gray-800 text-white z-20 transition-all duration-300 overflow-y-auto scrollbar-hide ${getSidebarClasses()}`}
      >
        {/* Custom CSS for hiding scrollbar on all devices */}
        <style jsx global>{`
          .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }
        `}</style>

        {/* Sidebar header */}
        {!isMobile && (
          <Link href="/" className="block">
            <div
              className="flex items-center justify-center p-3 border-b border-gray-700 cursor-pointer"
              ref={sidebarButtonRef}
            >
              {isMounted && (!isCollapsed || (isMobile && sidebarOpen)) ? (
                <div className="flex items-center space-x-2">
                  <img src={live_doctors_icon} alt="Logo" className="h-6 w-6" />
                  <span
                    className={`font-bold truncate ${
                      isMobile ? "text-sm" : ""
                    }`}
                  >
                    Live Doctors
                  </span>
                </div>
              ) : (
                <div className="flex justify-center">
                  <img src={live_doctors_icon} alt="Logo" className="h-6 w-6" />
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Menu items */}
        <nav className="mt-1">
          <ul>
            {menuItemsAdmin.map((item, index) => (
              <li key={index} className="mb-0.5">
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`flex items-center w-full py-1.5 px-3 hover:bg-gray-700 transition-colors cursor-pointer${
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
                            <span
                              className={`ml-2 ${isMobile ? "text-sm" : ""}`}
                            >
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
                      isMounted && (
                        <div
                          className={`
                            overflow-hidden transition-all duration-900 ease-in-out
                            ${
                              openDropdowns[item.name]
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0"
                            }
                          `}
                        >
                          <ul className="space-y-1">
                            {item.dropdown.map((subItem, subIndex) => (
                              <li
                                key={subIndex}
                                className={`
                                  transform transition-all duration-300 ease-out
                                  ${
                                    openDropdowns[item.name]
                                      ? "translate-y-0 opacity-100 delay-75"
                                      : "-translate-y-1 opacity-0"
                                  }
                                `}
                              >
                                <Link
                                  href={subItem.link}
                                  className={`flex items-center py-1.5 px-6 hover:bg-gray-600 ${
                                    isActiveRoute(subItem.link)
                                      ? "text-blue-400"
                                      : "text-gray-300"
                                  } ${isMobile ? "text-xs" : "text-sm"}`}
                                >
                                  {subItem.svg && (
                                    <span className="mr-2">{subItem.svg}</span>
                                  )}
                                  {!subItem.svg && (
                                    <span className="mr-2">
                                      <FaAngleRight />
                                    </span>
                                  )}
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : (
                  <Link
                    href={item.link || "#"}
                    className={`flex items-center py-1.5 px-3 transition-colors ${
                      isActiveRoute(item.link || "")
                        ? "bg-blue-500"
                        : "text-gray-300"
                    } ${
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
      {showPopup && <LeftPopup onClose={closePopup} />}
    </>
  );
};

export default Sidebar;
