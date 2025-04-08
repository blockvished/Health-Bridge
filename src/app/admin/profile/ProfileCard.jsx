import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function ProfileCard() {
  const [doctorData, setDoctorData] = useState(null);

  

  // useEffect(() => {
  //   const fetchDoctor = async () => {
  //     try {
  //       const response = await fetch("/api/doctor");
  //       const data = await response.json();
  //       if (data.length > 0) {
  //         setDoctorData(data[0]);
  //         console.log(data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching doctor data:", error);
  //     }
  //   };

  //   fetchDoctor();
  // }, []);

  return (
    <div className="w-full max-w-xs bg-white text-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center max-h-[380px]">
      
      {/* Rounded Image with Shadow */}
      <div className="w-40 h-40 rounded-full shadow-lg mb-6 overflow-hidden"> 
        <img
          src={doctorData?.image} // Replace with actual image URL
          alt={doctorData?.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-2xl font-semibold leading-tight mb-2">{doctorData?.name}</h2>
      <p className="text-gray-600 text-lg mb-1">{doctorData?.specialization}</p>
      <p className="text-gray-500 text-lg mb-4">{doctorData?.degree}</p>
      
      {/* Social Icons with Extra Spacing */}
      <div className="flex gap-5 mt-3">
        <FaFacebook className="text-blue-600 text-3xl" />
        <FaTwitter className="text-blue-400 text-3xl" />
        <FaInstagram className="text-pink-500 text-3xl" />
        <FaLinkedin className="text-blue-700 text-3xl" />
      </div>

    </div>
  );
}
