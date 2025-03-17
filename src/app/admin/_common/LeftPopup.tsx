import { FaClinicMedical, FaUser, FaSignOutAlt, FaTimes, FaHospital } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import Link from "next/link";
import { useState, useEffect } from "react";

interface LeftPopupProps {
  onClose: () => void;
}

const LeftPopup: React.FC<LeftPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger the slide-in effect when the popup is mounted
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50); // Small delay for smooth transition
  }, []);

  // Handle closing animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Delay unmounting to let animation play
  };

  return (
    <div
      className={`absolute top-14 left-14 bg-white p-4 rounded-lg shadow-xl w-96 border 
      transform transition-all duration-300 ease-in-out 
      ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2"}`}
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
