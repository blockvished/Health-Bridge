"use client";

import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { Doctor } from "./page";
import Cookies from "js-cookie";

interface SeoSettingsTabProps {
  doctor: Doctor | null;
  setDoctorData: React.Dispatch<React.SetStateAction<Doctor | null>>;
}

const SEOSettingsTab: React.FC<SeoSettingsTabProps> = ({ doctor, setDoctorData }) => {
  const [doctorData, setDoctorState] = useState({
    metaTags: doctor?.metaTagss || [],
    seo_description: doctor?.seo_description || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();

      formData.append("seoDescription", doctorData.seo_description || "");
      formData.append("doctorMetaTags", doctorData.metaTags.join(","));

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
      console.log(data)
      // Update the parent component state as well
      if (doctor) {
        setDoctorData({
          ...doctor,
          seo_description: doctorData.seo_description,
          metaTagss: doctorData.metaTags
        });
      }
      // Optionally toast here
    } catch (err: unknown) {
      console.error("Error updating doctor info:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const seo = event.target.value;
    setDoctorState({ ...doctorData, seo_description: seo });
  };

  const updateMetaTags = (tags: string[]) => {
    setDoctorState({ ...doctorData, metaTags: tags });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta tags
        </label>
        <MetaTagsInput 
          metaTags={doctorData.metaTags} 
          setMetaTags={updateMetaTags} 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          value={doctorData.seo_description}
          onChange={handleDescriptionChange}
        />
      </div>
      <button
        className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm shadow-md hover:bg-blue-600 transition cursor-pointer"
        onClick={handleSaveChanges}
        disabled={isSaving}
      >
        <FaCheck className="mr-2" />
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default SEOSettingsTab;

const MetaTagsInput: React.FC<{
  metaTags: string[];
  setMetaTags: (tags: string[]) => void;
}> = ({ metaTags, setMetaTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.key === " " || event.key === "Enter") &&
      inputValue.trim() !== ""
    ) {
      event.preventDefault();
      setMetaTags([...metaTags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    setMetaTags(metaTags.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-gray-300 rounded p-2 flex flex-wrap gap-2">
      {metaTags.map((tag, index) => (
        <div
          key={index}
          className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center space-x-1 cursor-pointer"
        >
          <span>{tag}</span>
          <button
            onClick={() => removeTag(index)}
            className="text-blue-600 hover:text-blue-800"
          >
            ×
          </button>
        </div>
      ))}
      <input
        type="text"
        className="flex-grow outline-none p-1"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Space or Enter..."
      />
    </div>
  );
};