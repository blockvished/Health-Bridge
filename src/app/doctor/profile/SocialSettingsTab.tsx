import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaCheck,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [errors, setErrors] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

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

  // URL validation function
  const validateURL = (url: string, platform: string) => {
    if (!url) return true; // Empty URLs are allowed
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    if (!urlPattern.test(url)) {
      return false;
    }

    // Platform-specific validation
    const platformPatterns = {
      facebook: /(?:facebook\.com|fb\.com)/i,
      twitter: /(?:twitter\.com|x\.com)/i,
      linkedin: /linkedin\.com/i,
      instagram: /instagram\.com/i,
    };

    const pattern = platformPatterns[platform as keyof typeof platformPatterns];
    if (pattern && !pattern.test(url)) {
      return false;
    }

    return true;
  };

  // Handle URL input changes with validation
  const handleURLChange = (platform: string, value: string) => {
    setDoctorrData((prev) => ({ ...prev, [platform]: value }));
    setDoctorData((prev) => ({ ...prev!, [platform]: value }));

    // Validate URL
    if (value && !validateURL(value, platform)) {
      setErrors((prev) => ({
        ...prev,
        [platform]: `Please enter a valid ${platform} URL`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [platform]: "" }));
    }
  };

  const handleSaveChanges = async () => {
    if (!doctorrData) return;

    // Validate all URLs before saving
    const newErrors = {
      facebook: doctorrData.facebook && !validateURL(doctorrData.facebook, "facebook") 
        ? "Please enter a valid Facebook URL" : "",
      twitter: doctorrData.twitter && !validateURL(doctorrData.twitter, "twitter") 
        ? "Please enter a valid Twitter URL" : "",
      linkedin: doctorrData.linkedin && !validateURL(doctorrData.linkedin, "linkedin") 
        ? "Please enter a valid LinkedIn URL" : "",
      instagram: doctorrData.instagram && !validateURL(doctorrData.instagram, "instagram") 
        ? "Please enter a valid Instagram URL" : "",
    };

    setErrors(newErrors);

    // Check if there are any validation errors
    if (Object.values(newErrors).some(error => error !== "")) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    try {
      setIsSaving(true);
      toast.info("Saving social media links...", { autoClose: 1000 });

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
        throw new Error(errorData?.message || "Failed to update social media links");
      }

      const data = await response.json();
      console.log(data);
      
      toast.success("Social media links updated successfully!");
      
    } catch (err: unknown) {
      console.error("Error updating doctor info:", err);
      toast.error(
        err instanceof Error 
          ? err.message 
          : "Failed to update social media links. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
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
                  onChange={(e) => handleURLChange("facebook", e.target.value)}
                  className={`w-full border ${
                    errors.facebook ? "border-red-500" : "border-gray-300"
                  } rounded p-2 pl-10`}
                  placeholder="https://facebook.com/yourprofile"
                />
              </div>
              {errors.facebook && (
                <p className="text-red-500 text-xs mt-1">{errors.facebook}</p>
              )}
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
                  onChange={(e) => handleURLChange("twitter", e.target.value)}
                  className={`w-full border ${
                    errors.twitter ? "border-red-500" : "border-gray-300"
                  } rounded p-2 pl-10`}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              {errors.twitter && (
                <p className="text-red-500 text-xs mt-1">{errors.twitter}</p>
              )}
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
                  onChange={(e) => handleURLChange("linkedin", e.target.value)}
                  className={`w-full border ${
                    errors.linkedin ? "border-red-500" : "border-gray-300"
                  } rounded p-2 pl-10`}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              {errors.linkedin && (
                <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>
              )}
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
                  onChange={(e) => handleURLChange("instagram", e.target.value)}
                  className={`w-full border ${
                    errors.instagram ? "border-red-500" : "border-gray-300"
                  } rounded p-2 pl-10`}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              {errors.instagram && (
                <p className="text-red-500 text-xs mt-1">{errors.instagram}</p>
              )}
            </div>

            <button
              className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm shadow-md hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              <FaCheck className="mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 999999 }}
        toastStyle={{ zIndex: 999999 }}
        limit={3}
      />
    </>
  );
};

export default SocialSettingsTab;