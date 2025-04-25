"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { menuItemsDoctor } from "./menuItems";
import LeftPopup from "./LeftPopup";
import { live_doctors_icon, temp } from "./global_variables";
import Cookies from "js-cookie";

interface Clinic {
  id: number;
  name: string;
  location: string;
  appointmentLimit: number;
  active: boolean;
  // Assuming your API response includes these fields
  imageLink?: string;
  department?: string; // Add department here if it's in your API response
  title?: string; // Add title here if it's in your API response
  address?: string; // Add address here if it's in your API response
}

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

  const [userId, setUserId] = useState<string | null>(null);
  const [clinicsData, setClinicsData] = useState<Clinic[]>([]);
  const [activeClinicName, setActiveClinicName] = useState<string | null>();
  const [activeClinicThumb, setActiveClinicThumb] = useState<string>();
  const [clinicChange, setClinicChange] = useState<boolean>();

    useEffect(() => {
      const idFromCookie = Cookies.get("currentClinicName");
      const thumbFromCookie = Cookies.get("currentClinicThumb");
      setActiveClinicName(idFromCookie || null);
      setActiveClinicThumb(thumbFromCookie || "")
    }, []);

  useEffect(() => {
    const fetchClinics = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/doctor/clinic/${userId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `Failed to fetch clinics: ${response.status}`
            );
          }
          const data = await response.json();
          console.log("Fetched clinics:", data);
          setClinicsData(data);

          // If clinics exist, check and potentially update the stored clinic ID
          if (data && data.length > 0) {
            const currentClinicId = Cookies.get("currentClinicId");
            const firstClinicId = String(data[0].id);
            console.log("currentClinicId exists", currentClinicId);

            // If no clinic ID is stored or it's not a valid ID from the fetched data, store the first clinic's ID
            if (
              !currentClinicId ||
              !data.some(
                (clinic: Clinic) => String(clinic.id) === currentClinicId
              )
            ) {
              Cookies.set("currentClinicId", firstClinicId);
              console.log("Clinic ID stored in cookie:", firstClinicId);
            } else {
              console.log("Current clinic ID is valid:", currentClinicId);
            }
          }
        } catch (err: any) {
          console.error("Error fetching clinics:", err);
        } finally {
        }
      }
    };

    fetchClinics();
  }, [userId]);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

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
          <div
            className="flex items-center p-3 border-b border-gray-700 cursor-pointer"
            onClick={togglePopup}
            ref={sidebarButtonRef}
          >
            {isMounted && (!isCollapsed || (isMobile && sidebarOpen)) ? (
              <div className="flex items-center space-x-2">
                {activeClinicName ? (
                  <img src={activeClinicThumb} alt="Logo" className="h-6 w-6" />
                ) : (
                  <img src={temp} alt="Logo" className="h-6 w-6" />
                )}
                <span
                  className={`font-bold truncate ${isMobile ? "text-sm" : ""}`}
                >
                  {activeClinicName}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <img src={temp} alt="Logo" className="h-6 w-6" />
                <span
                  className={`font-bold truncate ${isMobile ? "text-sm" : ""}`}
                >
                  Live Doctors
                </span>
              </div>
            )}
          </div>
        )}

        {/* Menu items */}
        <nav className="mt-1">
          <ul>
            {menuItemsDoctor.map((item, index) => (
              <li key={index} className="mb-0.5">
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`flex items-center w-full py-1.5 px-3 hover:bg-gray-700 transition-colors cursor-pointer ${
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
