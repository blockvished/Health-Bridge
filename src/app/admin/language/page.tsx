"use client";

import React, { useState } from "react";

const LanguageComponent: React.FC = () => {
  const [defaultLanguage, setDefaultLanguage] = useState("English");
  const [newLanguageName, setNewLanguageName] = useState("");
  const [newLanguageShortForm, setNewLanguageShortForm] = useState("");
  const [textDirection, setTextDirection] = useState("LTR");

  const handleUpdate = () => {
    console.log("Update language:", defaultLanguage);
  };

  const handleSave = () => {
    console.log("Save new language:", {
      name: newLanguageName,
      shortForm: newLanguageShortForm,
      direction: textDirection,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Set Default Language */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <label className="flex items-center mb-2">
          <input type="checkbox" checked className="mr-2 accent-blue-500" />
          Set default language
        </label>
        <select
          value={defaultLanguage}
          onChange={(e) => setDefaultLanguage(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="English">English</option>
        </select>
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white rounded-lg p-2 mt-2 w-full"
        >
          Update
        </button>
      </div>

      {/* Manage Language Table */}
      <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-md overflow-x-auto">
        <h3 className="font-semibold mb-4">Manage Language</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Short Form</th>
              <th className="py-2 px-4">Direction</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">1</td>
              <td className="py-2 px-4">English</td>
              <td className="py-2 px-4">
                <span className="bg-gray-900 text-white rounded-md px-2 py-1">en</span>
              </td>
              <td className="py-2 px-4">
                <span className="bg-blue-500 text-white rounded-md px-2 py-1">LTR</span>
              </td>
              <td className="py-2 px-4">
                <span className="bg-green-500 text-white rounded-md px-2 py-1">Active</span>
              </td>
              <td className="py-2 px-4 flex flex-wrap gap-2">
                <button className="bg-gray-200 rounded-md px-2 py-1 text-xs">User values</button>
                <button className="bg-gray-200 rounded-md px-2 py-1 text-xs">Admin values</button>
                <button className="bg-gray-200 rounded-md px-2 py-1 text-xs">Frontend values</button>
                <button className="bg-gray-200 rounded-md px-2 py-1 text-xs">✏️</button>
                <button className="bg-pink-500 text-white rounded-md px-2 py-1 text-xs">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add New Language */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h3 className="font-semibold mb-2">+ Add New Language</h3>
        <input
          type="text"
          value={newLanguageName}
          onChange={(e) => setNewLanguageName(e.target.value)}
          placeholder="Example: English, Dutch"
          className="w-full border rounded-lg p-2 mb-2"
        />
        <input
          type="text"
          value={newLanguageShortForm}
          onChange={(e) => setNewLanguageShortForm(e.target.value)}
          placeholder="Example: en, du"
          className="w-full border rounded-lg p-2 mb-2"
        />
        <div className="mb-2">
          <label className="block text-sm">Text direction</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="LTR"
                checked={textDirection === "LTR"}
                onChange={() => setTextDirection("LTR")}
                className="mr-2"
              />
              LTR (Left to Right)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="RTL"
                checked={textDirection === "RTL"}
                onChange={() => setTextDirection("RTL")}
                className="mr-2"
              />
              RTL (Right to Left)
            </label>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white rounded-lg p-2 w-full"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default LanguageComponent;