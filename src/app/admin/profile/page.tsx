"use client";

import React, { useState } from "react";
import Image from "next/image";

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
    aboutMe: "Hello and thank you for visiting my Doctor's profile. I want to let you know that here at my office my staff and I will do our best to make you comfortable. I believe in ethics, as a health provider being ethical is not just a remembered value, but a strongly observed one.",
    metaTags: ["cardiology", "cardiologist", "heart"],
    seoDescription: "Best Cardiologist in Chandigarh, Punjab"
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Update Info":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                defaultValue={doctor.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded p-2"
                defaultValue={doctor.email}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded p-2 appearance-none">
                  <option>India</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                defaultValue={doctor.city}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialist</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                defaultValue={doctor.specialty}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 h-24"
                defaultValue={doctor.degrees}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Years</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded p-2"
                defaultValue={doctor.experience}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 h-24"
                defaultValue={doctor.aboutMe}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Signature</label>
              <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded flex items-center space-x-2 text-sm">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                <span>Upload Signature</span>
              </button>
            </div>
          </div>
        );
      case "Social Settings":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">#</span>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 pl-8"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">#</span>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 pl-8"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Linked in</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">#</span>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 pl-8"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">#</span>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 pl-8"
                />
              </div>
            </div>
          </div>
        );
      case "SEO Settings":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta tags</label>
              <div className="border border-gray-300 rounded p-2 flex flex-wrap gap-2">
                {doctor.metaTags.map((tag, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center space-x-1">
                    <span>{tag}</span>
                    <button className="text-blue-600 hover:text-blue-800">×</button>
                  </div>
                ))}
              </div>
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
      case "Custom JS":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom JS</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 h-48 font-mono"
              />
            </div>
          </div>
        );
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 min-h-screen">
        {/* Sidebar content */}
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <div className="flex space-x-4">
              <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>Create as New</span>
              </button>
              <button className="bg-white border border-gray-300 rounded px-4 py-2 flex items-center space-x-2">
                <span>Dr...</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex">
            {/* Left column */}
            <div className="w-1/4 bg-white p-6 rounded shadow-sm">
              <div className="flex flex-col items-center">
                <div className="mb-4 relative">
                  <div className="h-36 w-36 rounded-full overflow-hidden bg-gray-200 mb-2">
                    {/* Doctor's profile picture placeholder */}
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 bg-gray-100 rounded-full p-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-xl font-semibold">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialty}</p>
                <p className="text-gray-500 text-sm">{doctor.degrees}</p>
                <div className="flex mt-4 space-x-2">
                  <a href="#" className="bg-blue-600 text-white p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-blue-400 text-white p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-pink-500 text-white p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-blue-700 text-white p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Right column */}
            <div className="w-3/4 ml-6">
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      )}
                      {tab === "Social Settings" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      )}
                      {tab === "SEO Settings" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      )}
                      {tab === "Custom JS" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      {tab}
                    </button>
                  ))}
                </div>
                
                {/* Tab content */}
                <div className="p-6">
                  {renderTabContent()}
                </div>
                
                {/* Save button */}
                {(activeTab === "Social Settings" || activeTab === "SEO Settings" || activeTab === "Custom JS") && (
                  <div className="px-6 pb-6">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;