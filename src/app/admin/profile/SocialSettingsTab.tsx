import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaCheck,
} from "react-icons/fa";

interface DoctorSocial {
  userId?: string | null;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

const SocialSettingsTab = ({
  userId,
  facebook,
  twitter,
  instagram,
  linkedin,
}: DoctorSocial) => {
  const [socialLinks, setSocialLinks] = useState<DoctorSocial | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSocialLinks({ userId, facebook, twitter, instagram, linkedin });
  }, [userId, facebook, twitter, instagram, linkedin]);

  const handleInputChange = (
    field: keyof Omit<DoctorSocial, "userId">,
    value: string
  ) => {
    if (socialLinks) {
      setSocialLinks({
        ...socialLinks,
        [field]: value,
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!socialLinks) return;

    try {
      setIsSaving(true);
      const formData = new FormData();

      // Append doctor text fields
      Object.entries(socialLinks).forEach(([key, value]) => {
        if (key !== "userId") {
          formData.append(key, value);
        }
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
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      {socialLinks && (
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
                value={socialLinks.facebook || ""}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
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
                value={socialLinks.twitter || ""}
                onChange={(e) => handleInputChange("twitter", e.target.value)}
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
                value={socialLinks.linkedin || ""}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
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
                value={socialLinks.instagram || ""}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
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
