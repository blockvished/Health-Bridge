"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { live_doctors_icon } from "./global_variables"; // Assuming this path is correct
import Image from "next/image";

const MobileTitle = () => {
  const [showPopup, setShowPopup] = useState(false);
  const mobileTitleRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Toggle popup function
  // const togglePopup = () => {
  //   setShowPopup((prev) => !prev);
  // };

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

  const handleTitleClick = () => {
    router.push("/");
  };

  return (
    <>
      <div
        className="flex items-center justify-center px-4 py-2 bg-white shadow-md rounded-full w-full max-w-[90%] mx-auto mt-4 md:hidden cursor-pointer" // Added cursor-pointer
        ref={mobileTitleRef}
        onClick={handleTitleClick} // Added onClick handler
      >
        <div className="flex items-center gap-3 rounded-full px-3 py-1">
          <Image
            src={live_doctors_icon}
            alt="Live Doctors"
            width={32} // w-8 = 32px
            height={32} // h-8 = 32px
          />
        </div>
      </div>
    </>
  );
};

export default MobileTitle;
