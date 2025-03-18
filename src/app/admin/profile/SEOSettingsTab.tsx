import React, { useState } from "react";

interface Doctor {
  name: string;
  specialty: string;
  degrees: string;
  email: string;
  city: string;
  country: string;
  experience: string;
  aboutMe: string;
  metaTags: string[];
  seoDescription: string;
}

interface SEOSettingsTabProps {
  doctor: Doctor;
}

const MetaTagsInput: React.FC<{ metaTags: string[]; setMetaTags: (tags: string[]) => void }> = ({ metaTags, setMetaTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === " " || event.key === "Enter") && inputValue.trim() !== "") {
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
        <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center space-x-1">
          <span>{tag}</span>
          <button onClick={() => removeTag(index)} className="text-blue-600 hover:text-blue-800">×</button>
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

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta tags</label>
        <MetaTagsInput metaTags={metaTags} setMetaTags={setMetaTags} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          defaultValue={doctor.seoDescription}
        />
      </div>
    </div>
  );
};

export default SEOSettingsTab;
