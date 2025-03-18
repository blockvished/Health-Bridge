import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function ProfileCard() {
  return (
    <div className="w-full max-w-xs bg-white text-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center max-h-[380px]">
      
      {/* Rounded Image with Shadow */}
      <div className="w-40 h-40 rounded-full shadow-lg mb-6 overflow-hidden"> 
        <img
          src="/path-to-image.jpg" // Replace with actual image URL
          alt="Dr. Dheeraj Singh"
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-2xl font-semibold leading-tight mb-2">Dr. Dheeraj Singh</h2>
      <p className="text-gray-600 text-lg mb-1">Cardiology</p>
      <p className="text-gray-500 text-lg mb-4">MBBS, MD</p>
      
      {/* Social Icons with Extra Spacing */}
      <div className="flex gap-5 mt-3">
        <FaFacebook className="text-blue-600 text-3xl" /> {/* Increased Size */}
        <FaTwitter className="text-blue-400 text-3xl" />
        <FaInstagram className="text-pink-500 text-3xl" />
        <FaLinkedin className="text-blue-700 text-3xl" />
      </div>

    </div>
  );
}
