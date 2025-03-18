"use client";

import React, { useState } from "react";
import { FaUserEdit, FaGlobe, FaSearch, FaCode, FaCheck } from "react-icons/fa";
import UpdateInfoTab from "./UpdateInfoTab";
import SocialSettingsTab from "./SocialSettingsTab";
import SEOSettingsTab from "./SEOSettingsTab";
import CustomJSTab from "./CustomJSTab";
import ProfileCard from "./ProfileCard";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Update Info");

  const tabs = [
    { name: "Update Info", icon: <FaUserEdit /> },
    { name: "Social Settings", icon: <FaGlobe /> },
    { name: "SEO Settings", icon: <FaSearch /> },
    { name: "Custom JS", icon: <FaCode /> },
  ];

  const doctor = {
    name: "Dr. Dheeraj Singh",
    specialty: "Cardiology",
    degrees: "MBBS, MD",
    email: "drdheeraj@doctor.in",
    city: "Chandigarh",
    country: "India",
    experience: "8",
    aboutMe:
      "Hello and thank you for visiting my Doctor's profile. I want to let you know that here at my office my staff and I will do our best to make you comfortable. I believe in ethics, as a health provider being ethical is not just a remembered value, but a strongly observed one.",
    aboutMyClinic:
      "Dr. Dheeraj Singh has a distinguished 16-year career in cardiology. He has served at three prestigious hospitals, where he has made significant contributions and played pivotal roles in advancing cardiology care. His extensive experience encompasses a wide range of cardiology services, including diagnosis, treatment, and management of various heart conditions.",
    metaTags: ["cardiology", "cardiologist", "heart"],
    seoDescription: "Best Cardiologist in Chandigarh, Punjab",
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Update Info":
        return <UpdateInfoTab doctor={doctor} />;
      case "Social Settings":
        return <SocialSettingsTab />;
      case "SEO Settings":
        return <SEOSettingsTab doctor={doctor} />;
      case "Custom JS":
        return <CustomJSTab />;
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <div className="flex-1 min-h-screen p-6">
      <div className="flex gap-6">
        <ProfileCard />

        {/* Right Column */}
        <div className="w-3/4 bg-white rounded-lg shadow-lg">
          {/* Tabs Container */}
          <div className="flex border border-gray-200 rounded-t-lg">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.name
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab(tab.name)}
              >
                <span
                  className={`mr-2 ${
                    activeTab === tab.name ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {tab.icon}
                </span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 border-l border-r border-b border-gray-200 rounded-b-lg">
            {renderTabContent()}
          </div>

          <div className="px-6 pb-6 border-l border-r border-b border-gray-200 rounded-b-lg">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center text-sm shadow-md hover:bg-blue-600 transition">
              <FaCheck className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
