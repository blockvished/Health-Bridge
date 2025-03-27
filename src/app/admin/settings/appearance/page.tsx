"use client"
// AppearancePage.tsx
import React, { useState } from 'react';

const AppearancePage: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('Dove'); // Default theme
  const [isActive, setIsActive] = useState(true); // Default active state

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleActiveToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Set Theme</h2>

      <div className="flex items-center mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="Dove"
            checked={selectedTheme === 'Dove'}
            onChange={() => handleThemeChange('Dove')}
            className="mr-2"
          />
          Dove
        </label>
        {/* Add more theme options here */}
      </div>

      <div className="flex items-center mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={handleActiveToggle}
            className="mr-2"
          />
          {isActive ? (
            <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Active
            </span>
          ) : (
            'Inactive'
          )}
        </label>
      </div>

      {/* Preview Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-4">
            <span className="bg-gray-200 rounded-full w-8 h-8 mr-2"></span>
            <span className="font-semibold">Dove</span>
          </div>
          {/* Add preview content for the Dove theme */}
        </div>
        <div className="border-4 border-green-500 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <span className="bg-gray-200 rounded-full w-8 h-8 mr-2"></span>
            <span className="font-semibold">Active Theme Preview</span>
          </div>
          {/* Add preview content for the active theme */}
        </div>
      </div>
    </div>
  );
};

export default AppearancePage;