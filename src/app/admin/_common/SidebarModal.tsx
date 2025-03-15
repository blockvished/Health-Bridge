import { FaClinicMedical, FaUser, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

interface ModalProps {
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <div className="absolute top-14 left-4 bg-white p-4 rounded-lg shadow-lg w-80 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 font-semibold">Your Live Doctors Accounts</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✖
        </button>
      </div>

      <div className="bg-blue-100 text-blue-600 p-3 rounded-md flex items-center justify-between">
        <span>Digambar Healthcare Center</span>
        <span>✔</span>
      </div>

      <div className="mt-4 space-y-2">
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

export default Modal;
