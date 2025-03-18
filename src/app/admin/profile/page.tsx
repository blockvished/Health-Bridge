"use client";

import React, { useState } from "react";
import UpdateInfoTab from "./UpdateInfoTab";
import SocialSettingsTab from "./SocialSettingsTab";
import SEOSettingsTab from "./SEOSettingsTab";
import CustomJSTab from "./CustomJSTab";
import ProfileCard from "./ProfileCard";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Update Info");
  const tabs = ["Update Info", "Social Settings", "SEO Settings", "Custom JS"];

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
    <div className="flex-1 min-h-screen">
      <div className="flex">
        {/* Left column */}
        <ProfileCard />

        {/* Right column */}
        <div className="w-3/4 ml-6 bg-white text-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center ">
          <div className="bg-white rounded shadow-sm">
            {/* Tabs */}
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 flex items-center ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "Update Info" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  )}
                  {tab === "Social Settings" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  )}
                  {tab === "SEO Settings" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {tab === "Custom JS" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6">{renderTabContent()}</div>

            {/* Save button */}
            {(activeTab === "Social Settings" ||
              activeTab === "SEO Settings" ||
              activeTab === "Custom JS") && (
              <div className="px-6 pb-6">
                <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
