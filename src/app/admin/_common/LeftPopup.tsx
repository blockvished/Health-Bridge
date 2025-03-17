import { FaClinicMedical, FaUser, FaSignOutAlt } from "react-icons/fa";
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
      className={`absolute top-14 left-14 bg-white p-6 rounded-lg shadow-xl w-80 border 
      transition-all duration-300 ease-in-out 
      ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-gray-800 font-semibold">Your Live Doctors Accounts</h3>
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 transition">
          ✖
        </button>
      </div>

      {/* Active Account */}
      <div className="bg-blue-100 text-blue-600 p-3 rounded-md flex items-center justify-between">
        <span>Digambar Healthcare Center</span>
        <span>✔</span>
      </div>

      {/* Menu Options */}
      <div className="mt-4 space-y-3">
        <Link href="/admin/chamber" className="flex items-center text-blue-600 hover:underline">
          <FaClinicMedical className="mr-2" /> Manage Clinics
        </Link>
        <Link href="/admin/profile" className="flex items-center text-gray-700 hover:underline">
          <FaUser className="mr-2" /> Manage Profile
        </Link>
        <button className="flex items-center text-red-600 hover:underline">
          <FaSignOutAlt className="mr-2" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default LeftPopup;
