import { FaClinicMedical, FaUser, FaSignOutAlt, FaTimes, FaHospital } from "react-icons/fa"; 
import { FaCheck } from "react-icons/fa6";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface LeftPopupProps {
  onClose: () => void;
  isMobile?: boolean;
}

const LeftPopup: React.FC<LeftPopupProps> = ({ onClose, isMobile = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  
  // Determine mobile breakpoint using window width
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);
  
  // Determine if we're on a mobile device (either via prop or window width)
  const isMobileDevice = isMobile || (windowWidth < 768);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50); // Small delay for smooth transition
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Delay unmounting to let animation play
  };

  // Get position classes based on device type
  const getPositionClasses = () => {
    if (isMobileDevice) {
      // The popup should be positioned on the left as shown in the image for mobile
      return "top-16 left-4";
    } else {
      // Keep the desktop position as is
      return "top-14 left-14"; 
    }
  };

  return (
    <div
      ref={popupRef}
      className={`absolute ${getPositionClasses()} bg-white  rounded-lg shadow-xl 
      ${isMobileDevice ? 'w-[75%] max-w-[320px] p-2 text-xs ' : 'w-96 p-4'}
      transform transition-all duration-300 ease-in-out z-[9999]
      ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2"}`}
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside the popup from closing it
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaHospital className="text-blue-600 w-5 h-5" />
          <h3 className="text-gray-800 font-semibold text-base">Your Live Doctors Accounts</h3>
        </div>
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 transition cursor-pointer">
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Active Account */}
      <div className="bg-blue-100 text-blue-600 p-3 rounded-md flex items-center justify-between">
        <span className="text-base font-medium cursor-pointer">Digambar Healthcare Center</span>
        <FaCheck className="text-blue-600 w-5 h-5" />
      </div>

      {/* Menu Options */}
      <div className="mt-3 space-y-1">
        <Link href="/admin/chamber" className="flex items-center text-blue-600 hover:bg-blue-50 transition p-2 rounded-md">
          <FaClinicMedical className="mr-2 w-5 h-5" /> <span className="text-base">Manage Clinics</span>
        </Link>
        <Link href="/admin/profile" className="flex items-center text-gray-700 hover:bg-gray-100 transition p-2 rounded-md">
          <FaUser className="mr-2 w-5 h-5" /> <span className="text-base">Manage Profile</span>
        </Link>
        <button
          className="flex items-center text-red-600 hover:bg-red-50 transition p-2 rounded-md w-full cursor-pointer"
          onClick={handleClose}
        >
          <FaSignOutAlt className="mr-2 w-5 h-5" /> <span className="text-base">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default LeftPopup;