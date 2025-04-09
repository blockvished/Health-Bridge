import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";

// Define or import the Doctor type
interface Doctor {
  metaTags: string[];
  seoDescription: string;
}

interface SEOSettingsTabProps {
  doctor: Doctor;
}

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

const SEOSettingsTab: React.FC<SEOSettingsTabProps> = ({ doctor }) => {
  const [metaTags, setMetaTags] = useState<string[]>(doctor.metaTags);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {};
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta tags
        </label>
        <MetaTagsInput metaTags={metaTags} setMetaTags={setMetaTags} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          defaultValue={doctor.seoDescription}
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
