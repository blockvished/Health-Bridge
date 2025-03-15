"use client";

import React, { useState } from "react";

const Topbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  return (
    <div className="flex justify-between items-center mb-6 relative">
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

      {/* Other elements (Profile, Create as New) */}
    </div>
  );
};

export default Topbar;
