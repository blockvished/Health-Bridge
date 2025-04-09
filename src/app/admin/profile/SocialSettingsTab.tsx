import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

interface DoctorSocial {
  id: number;
  doctorId: number;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

const SocialSettingsTab = ({ doctorId = 1 }) => {
  const [socialLinks, setSocialLinks] = useState<DoctorSocial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // useEffect(() => {
  //   const fetchSocialLinks = async () => {
  //     try {
  //       const response = await fetch(`/api/doctor/social/${doctorId}`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch social links");
  //       }
  //       const data: DoctorSocial[] = await response.json();
  //       setSocialLinks(data[0]); // Assuming the API returns an array with one object
  //     } catch (err) {
  //       setError("Error loading data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchSocialLinks();
  // }, [doctorId]);

  const handleInputChange = (field: keyof DoctorSocial, value: string) => {
    if (socialLinks) {
      setSocialLinks({
        ...socialLinks,
        [field]: value
      });
    }
  };

  const handleSave = async () => {
    if (!socialLinks) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await fetch(`/api/doctor/social/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialLinks),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update social links");
      }
      
      setSaveSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError("Error saving data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaFacebook className="text-blue-600 text-xl" />
              </span>
              <input
                type="text"
                value={socialLinks?.facebook || ""}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                className="w-full border border-gray-300 rounded p-2 pl-10"
                placeholder="Enter Facebook URL"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaTwitter className="text-blue-400 text-xl" />
              </span>
              <input
                type="text"
                value={socialLinks?.twitter || ""}
                onChange={(e) => handleInputChange("twitter", e.target.value)}
                className="w-full border border-gray-300 rounded p-2 pl-10"
                placeholder="Enter Twitter URL"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaLinkedin className="text-blue-700 text-xl" />
              </span>
              <input
                type="text"
                value={socialLinks?.linkedin || ""}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                className="w-full border border-gray-300 rounded p-2 pl-10"
                placeholder="Enter LinkedIn URL"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaInstagram className="text-pink-500 text-xl" />
              </span>
              <input
                type="text"
                value={socialLinks?.instagram || ""}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className="w-full border border-gray-300 rounded p-2 pl-10"
                placeholder="Enter Instagram URL"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialSettingsTab;