"use client";

import React, { useEffect, useState } from "react";
import { FaUserEdit, FaGlobe, FaSearch, FaCode, FaCheck } from "react-icons/fa";
import UpdateInfoTab from "./UpdateInfoTab";
import SocialSettingsTab from "./SocialSettingsTab";
import SEOSettingsTab from "./SEOSettingsTab";
import ProfileCard from "./ProfileCard";

interface Doctor {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  specialization: string;
  degree: string;
  experience: string;
  aboutSelf: string;
  aboutClinic?: string;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Update Info");
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch("/api/doctor");
        const data = await response.json();
        if (data.length > 0) {
          setDoctorData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctor();
  }, []);

  const tabs = [
    { name: "Update Info", icon: <FaUserEdit /> },
    { name: "Social Settings", icon: <FaGlobe /> },
    { name: "SEO Settings", icon: <FaSearch /> },
  ];

  const metaTags = ["cardiology", "cardiologist", "heart"];
  const seoDescription = "Best Cardiologist in Chandigarh, Punjab";

  const renderTabContent = () => {
    switch (activeTab) {
      case "Update Info":
        return <UpdateInfoTab doctor={doctorData} />;
      case "Social Settings":
        return <SocialSettingsTab />;
      case "SEO Settings":
        return <SEOSettingsTab doctor={{ metaTags, seoDescription }} />;
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 md:p-6 gap-4 md:gap-6">
      {/* Left Column - Profile Card */}
      <div className="w-full md:w-1/4">
        <ProfileCard />
      </div>

      {/* Right Column */}
      <div className="w-full md:w-3/4 bg-white rounded-lg shadow-lg md:ml-6">
        {/* Tabs Container */}
        <div className="flex flex-col md:flex-row border border-gray-200 rounded-t-lg">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all 
                ${
                  activeTab === tab.name
                    ? "text-blue-600 md:border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-500"
                }
                border-b md:border-b-0 ${
                  activeTab !== tab.name ? "border-gray-200" : ""
                }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <span
                className={`text-sm ${
                  activeTab === tab.name ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {tab.icon}
              </span>
              <span className="whitespace-nowrap">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6 border-l border-r border-b border-gray-200 rounded-b-lg">
          {renderTabContent()}
        </div>

        <div className="px-4 md:px-6 pb-4 md:pb-6 border-l border-r border-b border-gray-200 rounded-b-lg">
          <button className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm shadow-md hover:bg-blue-600 transition">
            <FaCheck className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;