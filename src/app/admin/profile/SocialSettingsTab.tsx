import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaCheck,
} from "react-icons/fa";
import { Doctor } from "./page";
import Cookies from "js-cookie";

interface SocialSettingsTabProps {
  doctor: Doctor | null;
  setDoctorData: React.Dispatch<React.SetStateAction<Doctor | null>>;
}

const SocialSettingsTab = ({
  doctor,
  setDoctorData,
}: SocialSettingsTabProps) => {
  const [doctorrData, setDoctorrData] = useState({
    facebook: doctor?.facebook || "",
    instagram: doctor?.instagram || "",
    twitter: doctor?.twitter || "",
    linkedin: doctor?.linkedin || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    if (doctor) {
      setDoctorrData({
        facebook: doctor?.facebook || "",
        instagram: doctor?.instagram || "",
        twitter: doctor?.twitter || "",
        linkedin: doctor?.linkedin || "",
      });
    }
  }, [doctor]);

  const handleSaveChanges = async () => {
    if (!doctorrData) return;

    try {
      setIsSaving(true);
      const formData = new FormData();

      // Append doctor text fields
      Object.entries(doctorrData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(
        `/api/doctor/profile/info/create_update/${userId}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to update doctor info");
      }

      const data = await response.json();
    } catch (err: any) {
      console.error("Error updating doctor info:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {doctorrData && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaFacebook className="text-blue-600 text-xl" />
              </span>
              <input
                type="text"
                value={doctorrData.facebook || ""}
                onChange={(e) => {
                  const fflink = e.target.value;
                  setDoctorrData((prev) => ({ ...prev, facebook: fflink }));
                  setDoctorData((prev) => ({ ...prev!, facebook: fflink }));
                }}
                className="w-full border border-gray-300 rounded p-2 pl-10"
                placeholder="Enter Facebook URL"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaTwitter className="text-blue-400 text-xl" />
              </span>
              <input
                type="text"
                value={doctorrData.twitter || ""}
                onChange={(e) => {
                  const twlink = e.target.value;
                  setDoctorrData((prev) => ({ ...prev, twitter: twlink }));
                  setDoctorData((prev) => ({ ...prev!, twitter: twlink }));
                }}
                className="w-full border border-gray-300 rounded p-2 pl-10"
                placeholder="Enter Twitter URL"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaLinkedin className="text-blue-700 text-xl" />
              </span>
              <input
                type="text"
                value={doctorrData.linkedin || ""}
                onChange={(e) => {
                  const lllink = e.target.value;
                  setDoctorrData((prev) => ({ ...prev, linkedin: lllink }));
                  setDoctorData((prev) => ({ ...prev!, linkedin: lllink }));
                }}
                className="w-full border border-gray-300 rounded p-2 pl-10"
                placeholder="Enter LinkedIn URL"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaInstagram className="text-pink-500 text-xl" />
              </span>
              <input
                type="text"
                value={doctorrData.instagram || ""}
                onChange={(e) => {
                  const iilink = e.target.value;
                  setDoctorrData((prev) => ({ ...prev, instagram: iilink }));
                  setDoctorData((prev) => ({ ...prev!, instagram: iilink }));
                }}
                className="w-full border border-gray-300 rounded p-2 pl-10"
                placeholder="Enter Instagram URL"
              />
            </div>
          </div>
          <button
            className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm shadow-md hover:bg-blue-600 transition cursor-pointer"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            <FaCheck className="mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </>
      )}
    </div>
  );
};

export default SocialSettingsTab;
