"use client"

// LanguageComponent.tsx
import React, { useState } from 'react';

const LanguageComponent: React.FC = () => {
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [newLanguageName, setNewLanguageName] = useState('');
  const [newLanguageShortForm, setNewLanguageShortForm] = useState('');
  const [textDirection, setTextDirection] = useState('LTR');

  const handleUpdate = () => {
    console.log('Update language:', defaultLanguage);
  };

  const handleSave = () => {
    console.log('Save new language:', {
      name: newLanguageName,
      shortForm: newLanguageShortForm,
      direction: textDirection,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Left Column: Set Default Language */}
      <div className="col-span-1 bg-white rounded-lg p-4 shadow-md">
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={true}
              className="mr-2 accent-blue-500"
            />
            Set default language
          </label>
          <select
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value)}
            className="w-full border rounded-lg p-2 mt-2"
          >
            <option value="English">English</option>
            {/* Add more language options here */}
          </select>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white rounded-lg p-2 mt-2"
          >
            Update
          </button>
        </div>
      </div>

      {/* Right Column: Manage Language Table (Spanning 2 Columns) */}
      <div className="col-span-2 bg-white rounded-lg p-4 shadow-md">
        <h3 className="font-semibold mb-2">Manage Language</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2">#</th>
              <th className="py-2">Name</th>
              <th className="py-2">Short Form</th>
              <th className="py-2">Direction</th>
              <th className="py-2">Status</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">1</td>
              <td className="py-2">English</td>
              <td className="py-2">
                <span className="bg-gray-200 rounded-lg p-1">en</span>
              </td>
              <td className="py-2">
                <span className="bg-blue-200 rounded-lg p-1">LTR</span>
              </td>
              <td className="py-2">
                <span className="bg-green-200 text-green-700 rounded-lg p-1">Active</span>
              </td>
              <td className="py-2">
                <button className="bg-gray-200 rounded-lg p-1 mr-1 text-xs">
                  User values
                </button>
                <button className="bg-gray-200 rounded-lg p-1 mr-1 text-xs">
                  Admin values
                </button>
                <button className="bg-gray-200 rounded-lg p-1 mr-1 text-xs">
                  Frontend values
                </button>
                <button className="bg-gray-200 rounded-lg p-1 mr-1 text-xs">
                  @
                </button>
                <button className="bg-pink-200 rounded-lg p-1 mr-1 text-xs">
                  x
                </button>
              </td>
            </tr>
            {/* Add more language rows here */}
          </tbody>
        </table>
      </div>

      {/* Left Column: Add New Language */}
      <div className="col-span-1 bg-white rounded-lg p-4 shadow-md">
        <div>
          <h3 className="font-semibold mb-2">+ Add New Language</h3>
          <div className="mb-2">
            <label className="block text-sm">Name</label>
            <input
              type="text"
              value={newLanguageName}
              onChange={(e) => setNewLanguageName(e.target.value)}
              placeholder="Example: English, Dutch"
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Short Form</label>
            <input
              type="text"
              value={newLanguageShortForm}
              onChange={(e) => setNewLanguageShortForm(e.target.value)}
              placeholder="Example: en, du"
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Text direction</label>
            <div className="flex items-center">
              <label className="flex items-center mr-4">
                <input
                  type="radio"
                  value="LTR"
                  checked={textDirection === 'LTR'}
                  onChange={() => setTextDirection('LTR')}
                  className="mr-1 accent-blue-500"
                />
                LTR (Left to Right)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="RTL"
                  checked={textDirection === 'RTL'}
                  onChange={() => setTextDirection('RTL')}
                  className="mr-1 accent-blue-500"
                />
                RTL (Right to Left)
              </label>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white rounded-lg p-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageComponent;