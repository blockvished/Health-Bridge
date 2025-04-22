import {
  FaClinicMedical,
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaHospital,
} from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

interface LeftPopupProps {
  onClose: () => void;
  isMobile?: boolean;
}
interface Clinic {
  id: number;
  name: string;
  location: string;
  appointmentLimit: number;
  active: boolean;
  // Assuming your API response includes these fields
  imageLink?: string;
  department?: string; // Add department here if it's in your API response
  title?: string; // Add title here if it's in your API response
  address?: string; // Add address here if it's in your API response
}
const LeftPopup: React.FC<LeftPopupProps> = ({ onClose, isMobile = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [clinicsData, setClinicsData] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeClinicId, setActiveClinicId] = useState<number | null>(null); // To track the active clinic

  useEffect(() => {
    const fetchClinics = async () => {
      if (userId) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/doctor/clinic/${userId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `Failed to fetch clinics: ${response.status}`
            );
          }
          const data = await response.json();
          console.log(data);
          setClinicsData(data);
          const storedClinicId = Cookies.get("currentClinicId");
          if (storedClinicId) {
            setActiveClinicId(parseInt(storedClinicId, 10));
          } else if (data.length > 0) {
            // If no cookie, default to the first clinic
            setActiveClinicId(data[0].id);
          }
        } catch (err: any) {
          console.error("Error fetching clinics:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClinics();
  }, [userId]);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  // Determine mobile breakpoint using window width
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Determine if we're on a mobile device (either via prop or window width)
  const isMobileDevice = isMobile || windowWidth < 768;

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

  const handleClinicClick = (clinicId: number) => {
    setActiveClinicId(clinicId);
    Cookies.set("currentClinicId", String(clinicId));
    console.log("Active clinic ID set to:", clinicId);
    // You might want to trigger a refresh or some other action here
    // to reflect the change in the rest of your application.
  };

  return (
    <div
      ref={popupRef}
      className={`absolute ${getPositionClasses()} bg-white  rounded-lg shadow-xl 
      ${isMobileDevice ? "w-[75%] max-w-[320px] p-2 text-xs " : "w-96 p-4"}
      transform transition-all duration-300 ease-in-out z-[9999]
      ${
        isVisible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2"
      }`}
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside the popup from closing it
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaHospital className="text-blue-600 w-5 h-5" />
          <h3 className="text-gray-800 font-semibold text-base">
            Your Live Doctors Accounts
          </h3>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-800 transition cursor-pointer"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="p-3 text-gray-600 text-sm italic">
          Loading clinics...
        </div>
      ) : error ? (
        <div className="p-3 text-red-500 text-sm">{error}</div>
      ) : (
        clinicsData.map((clinic) => (
          <div
            key={clinic.id}
            className={`p-3 rounded-md flex items-center justify-between mb-2 cursor-pointer
              ${activeClinicId === clinic.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 opacity-70"}
            `}
            onClick={() => handleClinicClick(clinic.id)}
          >
            <span className="text-base font-medium">{clinic.name}</span>
            {activeClinicId === clinic.id && <FaCheck className="text-blue-600 w-5 h-5" />}
          </div>
        ))
      )}

      {/* Menu Options */}
      <div className="mt-3 space-y-1">
        <Link
          href="/admin/chamber"
          className="flex items-center text-blue-600 hover:bg-blue-50 transition p-2 rounded-md"
        >
          <FaClinicMedical className="mr-2 w-5 h-5" />{" "}
          <span className="text-base">Manage Clinics</span>
        </Link>
      </div>
    </div>
  );
};

export default LeftPopup;
