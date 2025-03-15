"use client";

import React, { useState } from "react";
import Link from "next/link";

const Topbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-6 relative px-4 py-2 ">
      {/* Sidebar Toggle Button */}
      <button className="p-2 rounded-full hover:bg-gray-100" onClick={onToggleSidebar}>
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Create as New Button */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create as New
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              {[
                { name: "Prescription", path: "/admin/prescription" },
                { name: "Staff", path: "/admin/staff" },
                { name: "Patient", path: "/admin/patients" },
                { name: "Appointment", path: "/admin/appointment" },
                { name: "Drug", path: "/admin/drugs" },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                  onClick={() => setDropdownOpen(false)} // Close dropdown after click
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-2">
          <img
            src="https://via.placeholder.com/32"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-gray-800 font-medium">Dr...</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
