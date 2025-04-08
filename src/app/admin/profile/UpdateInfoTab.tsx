import { Upload } from "lucide-react";
import React, { useRef, useState } from "react";
interface Doctor {
  name: string;
  email: string;
  phone: string;
  city: string;
  specialization: string;
  degree: string;
  experience: string;
  aboutSelf: string;
  aboutClinic?: string;
}
interface UpdateInfoTabProps {
  doctor: Doctor | null;
}

const UpdateInfoTab: React.FC<UpdateInfoTabProps> = ({ doctor }) => {
  const [doctorData, setDoctorData] = useState({
    name: doctor?.name || "",
    email: doctor?.email || "",
    phone: doctor?.phone || "",
    city: doctor?.city || "",
    specialization: doctor?.specialization || "",
    degree: doctor?.degree || "",
    experience: doctor?.experience || "",
    aboutSelf: doctor?.aboutSelf || "",
    aboutClinic: doctor?.aboutClinic || "",
  });

  const profileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const handleProfileClick = () => profileInputRef.current?.click();
  const handleSignatureClick = () => signatureInputRef.current?.click();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSignaturePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Initialize textarea heights on component mount
  React.useEffect(() => {
    const textareas = document.querySelectorAll("textarea.auto-resize");
    textareas.forEach((textarea) => {
      const element = textarea as HTMLTextAreaElement;
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    });
  }, []);

  return (
    <div className="space-y-3">
      {/* Profile Image and Signature Upload Section */}
      <div className="flex flex-wrap gap-8 mb-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2 overflow-hidden">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400">No image</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            onChange={handleProfileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleProfileClick}
            className="mt-2 bg-gray-100 text-gray-600 px-3 py-2 rounded flex items-center space-x-2 text-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Signature */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2">
            {signaturePreview ? (
              <img
                src={signaturePreview}
                alt="Signature Preview"
                className="w-3/4 h-auto object-contain"
              />
            ) : (
              <span className="text-sm text-gray-400">No signature</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={signatureInputRef}
            onChange={handleSignatureChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleSignatureClick}
            className="mt-2 bg-gray-100 text-gray-600 px-3 py-2 rounded flex items-center space-x-2 text-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Signature</span>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          value={doctorData.name}
          onChange={(e) =>
            setDoctorData({ ...doctorData, name: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded p-2"
          value={doctorData.email}
          onChange={(e) =>
            setDoctorData({ ...doctorData, email: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <div>
          <style jsx>{`
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
          `}</style>
          <input
            type="number"
            className="w-full border border-gray-300 rounded p-2"
            value={doctorData.phone}
            onChange={(e) =>
              setDoctorData({ ...doctorData, phone: e.target.value })
            }
          />
        </div>
      </div>
      <div></div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          value={doctorData.city}
          onChange={(e) =>
            setDoctorData({ ...doctorData, city: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specialist
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          value={doctorData.specialization}
          onChange={(e) =>
            setDoctorData({ ...doctorData, specialization: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Degree
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          value={doctorData.degree}
          onChange={(e) =>
            setDoctorData({ ...doctorData, degree: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Experience Years
        </label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded p-2"
          value={doctorData.experience}
          onChange={(e) =>
            setDoctorData({ ...doctorData, experience: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About Me
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          value={doctorData.aboutSelf}
          onChange={(e) =>
            setDoctorData({ ...doctorData, aboutSelf: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About My Clinic
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          value={doctorData.aboutClinic}
          onChange={(e) =>
            setDoctorData({ ...doctorData, aboutClinic: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default UpdateInfoTab;
