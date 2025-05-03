"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiUser,
  FiEdit,
  FiLock,
  FiLogOut,
  FiMenu,
  FiChevronDown,
} from "react-icons/fi";
import MobileTitle from "./MobileTitleDoctor";
import { MdAddCircle } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { live_doctors_icon } from "./global_variables";
import Cookies from "js-cookie";
import Image from "next/image";

const Topbar: React.FC<{ onToggleSidebar: () => void }> = ({
  onToggleSidebar,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  interface Doctor {
    name: string;
    email: string;
  }

  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/doctor/profile/info/get/${userId}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          let metemeta;
          if (data.metaTags) {
            if (Array.isArray(data.metaTags)) {
              const tags = data.metaTags.map(
                (tagObj: { tag: string }) => tagObj.tag
              );
              metemeta = tags;
              
            }
          }
          if (data.doctor) {
            setDoctorData({
              name: data.doctor.name || "",
              email: data.doctor.email || "",
            });
          }
        } else {
          console.error("Failed to fetch doctor data");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
      }
    };

    fetchDoctorData();
  }, [userId]);

  // useEffect(() => {
  //   const fetchDoctor = async () => {
  //     try {
  //       const response = await fetch("/api/doctor");
  //       const data = await response.json();
  //       if (data.length > 0) {
  //         setDoctorData(data[0]);
  //         console.log(data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching doctor data:", error);
  //     }
  //   };

  //   fetchDoctor();
  // }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        // Optional: Clear client-side state
        setDoctorData(null);

        // Redirect to login or landing page
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <MobileTitle />
      <div className="flex justify-between items-center px-3 py-3 z-100">
        {/* Left: Sidebar Toggle Button */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          onClick={onToggleSidebar}
        >
          <FiMenu className="w-6 h-6" />
        </button>

        {/* Right Section: Create as New Button & Profile */}
        <div className="flex items-center gap-4 md:gap-4">
          {/* Create as New Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full hover:bg-blue-300 hover:text-white hover:bg-blue-700 transition cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <MdAddCircle className="w-6 h-6" />
              <span className="hidden sm:inline">Create as New</span>
              <FaCaretDown className="w-5 h-5" />
            </button>

            <div
              className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transform transition-all duration-200 cursor-pointer ${
                dropdownOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              <ul className="py-2">
                {["Prescription", "Staff", "Patients", "Appointment"].map(
                  (item, index) => (
                    <li key={index}>
                      <Link
                        href={`/admin/${item.toLowerCase()}`}
                        className="block px-4 py-3 text-gray-800 hover:bg-blue-50 transition cursor-pointer"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full shadow-sm bg-white hover:bg-gray-100 transition cursor-pointer"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <Image
                src={live_doctors_icon}
                alt="Profile"
                width={24} // w-6 = 24px
                height={24} // h-6 = 24px
                className="rounded-full"
              />
              <span className="text-gray-800 font-medium hidden sm:inline">
                {doctorData?.name?.slice(0, 7)}...
              </span>

              <FiChevronDown className="w-5 h-5 text-gray-600" />
            </button>

            <div
              className={`absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg transform transition-all duration-200 ${
                profileDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              {/* Profile Info Section */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <Image
                  src={live_doctors_icon}
                  alt="Profile"
                  width={48} // w-12 = 48px
                  height={48} // h-12 = 48px
                  className="rounded-full"
                />
                <div>
                  <h4 className="text-gray-800 font-semibold text-sm">
                    {doctorData?.name}
                  </h4>
                  <p className="text-xs text-gray-500">{doctorData?.email}</p>
                </div>
              </div>

              {/* Profile Actions */}
              <ul className="py-2">
                {[
                  {
                    name: "View Profile",
                    icon: <FiUser className="w-5 h-5 text-gray-600" />,
                    path: "#",
                  },
                  {
                    name: "Update Profile",
                    icon: <FiEdit className="w-5 h-5 text-gray-600" />,
                    path: "/admin/profile",
                  },
                  {
                    name: "Change Password",
                    icon: <FiLock className="w-5 h-5 text-gray-600" />,
                    path: "/admin/change_password",
                  },
                ].map(({ name, icon, path }) => (
                  <li key={name}>
                    <Link
                      href={path}
                      className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-blue-50 transition"
                    >
                      {icon}
                      <span className="text-sm">{name}</span>
                    </Link>
                  </li>
                ))}

                {/* Logout Button */}
                <li>
                  <button
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="w-5 h-5 text-red-500" />
                    <span className="text-sm">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
