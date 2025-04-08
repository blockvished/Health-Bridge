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
  const [metaTags, setMetaTags] = React.useState<string[]>([]);
  const [seoDescription, setSeoDescription] = React.useState<string>("");
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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
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
          defaultValue={doctor?.name}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded p-2"
          defaultValue={doctor?.email}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      <div></div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          defaultValue={doctor?.city}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specialist
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          defaultValue={doctor?.specialization}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Degree
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          defaultValue={doctor?.degree}
          onChange={handleTextareaChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Experience Years
        </label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded p-2"
          defaultValue={doctor?.experience}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About Me
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          defaultValue={doctor?.aboutSelf}
          onChange={handleTextareaChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About My Clinic
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          defaultValue={doctor?.aboutClinic || ""}
          onChange={handleTextareaChange}
        />
      </div>
    </div>
  );
};

export default UpdateInfoTab;
