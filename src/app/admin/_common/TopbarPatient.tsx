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
import MobileTitle from "./MobileTitlePatientNAdmin";
import { MdAddCircle } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { live_doctors_icon, temp } from "./global_variables";

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

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch("/api/doctor");
        const data = await response.json();
        if (data.length > 0) {
          setDoctorData(data[0]);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctor();
  }, []);

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
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={onToggleSidebar}
        >
          <FiMenu className="w-6 h-6" />
        </button>

        {/* Right Section: Create as New Button & Profile */}
        <div className="flex items-center gap-4 md:gap-4">
          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full shadow-sm bg-white hover:bg-gray-100 transition"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <img
                src={temp}
                alt="Profile"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-gray-800 font-medium hidden sm:inline">
                Patient name
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
                <img
                  src={temp}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="text-gray-800 font-semibold text-sm">
                    Patient name
                  </h4>
                  <p className="text-xs text-gray-500">patient email</p>
                </div>
              </div>

              {/* Profile Actions */}
              <ul className="py-2">
                {[
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
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
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
