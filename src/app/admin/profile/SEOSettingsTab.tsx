import React from "react";

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

const SEOSettingsTab: React.FC<SEOSettingsTabProps> = ({ doctor }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Meta tags
      </label>
      <div className="border border-gray-300 rounded p-2 flex flex-wrap gap-2">
        {doctor.metaTags.map((tag, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center space-x-1"
          >
            <span>{tag}</span>
            <button className="text-blue-600 hover:text-blue-800">×</button>
          </div>
        ))}
      </div>
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
  </div>
);

export default SEOSettingsTab;
