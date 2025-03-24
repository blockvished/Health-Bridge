"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import LeftPopup from "./LeftPopup";

const MobileTitle = () => {
  const [showPopup, setShowPopup] = useState(false);
  const mobileTitleRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Toggle popup function
  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  // Close popup function
  const closePopup = () => {
    setShowPopup(false);
  };

  // Handle clicks outside the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileTitleRef.current &&
        mobileTitleRef.current.contains(event.target as Node)
      ) {
        return; // Don't close when clicking the title
      }

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <>
      <div
        className="flex items-center justify-between px-4 py-2 bg-white shadow-md rounded-full w-full max-w-[90%] mx-auto mt-4 md:hidden"
        onClick={togglePopup}
        ref={mobileTitleRef}
      >
        <div className="flex items-center gap-3 rounded-full px-3 py-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="text-cyan-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.9 13.5H4.1C2.6 13.5 2 14.6 2 16V21.5H22V16C22 14.6 21.4 13.5 19.9 13.5Z"
              fill="currentColor"
            />
            <path
              d="M12 2C8.1 2 5 5.1 5 9C5 11.4 6.2 13.5 8 14.7V14.9C8 15.5 8.4 16 9 16H15C15.6 16 16 15.6 16 15V14.7C17.8 13.6 19 11.4 19 9C19 5.1 15.9 2 12 2ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z"
              fill="currentColor"
            />
          </svg>

          {/* Text */}
          <span className="text-sm font-medium text-gray-700">
            Digambar Healthcare...
          </span>
        </div>

        {/* Right Section - Chevron */}
        <FiChevronRight className="text-gray-400 text-lg" />
      </div>
      {showPopup && (
        <div ref={popupRef}>
          <LeftPopup onClose={closePopup} isMobile={true} />
        </div>
      )}
    </>
  );
};

export default MobileTitle;