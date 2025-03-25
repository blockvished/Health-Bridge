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
        ref={mobileTitleRef}
      >
        <div className="flex items-center gap-3 rounded-full px-3 py-1">
          live doctors icon
        </div>
      </div>
    </>
  );
};

export default MobileTitle;
