"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import type { NextPage } from "next";

interface User {
  userId: string;
  accountName: string;
}

interface Settings {
  authType: "app" | "graph";
  users: User[];
  selectedUsers: string[];
  linkPosting: "link" | "image";
  urlShortener: "default" | "bitly";
  autoPosting?: boolean;
  proxyEnabled?: boolean;
  apiEnabled?: boolean;
}

// Reusable Section Component
const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-t border-gray-200 pt-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

// Reusable Toggle Switch Component
const ToggleSwitch = ({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean | undefined;
  onToggle: () => void;
}) => (
  <div>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          enabled ? "bg-blue-600" : "bg-gray-400"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

// Reusable Button
const Button = ({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className: string;
}) => (
  <button onClick={onClick} className={`px-4 py-2 rounded ${className}`}>
    {label}
  </button>
);

// Reusable Select Component
const Select = ({
  label,
  value,
  onChange,
  options,
  multiple = false,
}: {
  label: string;
  value: string | string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  multiple?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      multiple={multiple}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const GoogleBusinessProfileSettings: NextPage = () => {
  const [settings, setSettings] = useState<Settings>({
    authType: "app",
    users: [],
    selectedUsers: [],
    linkPosting: "link",
    urlShortener: "default",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example of fetching users (replace with your actual API call)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSettings((prev) => ({
        ...prev,
        users: [
          { userId: "1", accountName: "Account 1" },
          { userId: "2", accountName: "Account 2" },
        ],
      }));
      setLoading(false);
    }, 1000);
  }, []);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSettings((prev) => ({
      ...prev,
      selectedUsers: selectedOptions,
    }));
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 space-y-8">
      <SettingsSection title="General Settings">
        <ToggleSwitch
          label="Enable Autoposting"
          description="Enable this button, if you want to automatically post your new content to Google Business Profile."
          enabled={settings.autoPosting}
          onToggle={() => handleToggle("autoPosting")}
        />
      </SettingsSection>

      <SettingsSection title="API Settings">
        <div className="bg-gray-100 border border-gray-300 rounded p-4 mb-4">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">
              <strong>Note:</strong> You have only 1 account to add
            </p>
          </div>
        </div>
        <button className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded mb-4 block">
          + Add GBP Account
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded block">
          Save
        </button>
      </SettingsSection>

      <SettingsSection title="Autopost Settings">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Autopost Posts to Google Business Profile of this user(s)
          </label>
          <div className="mt-1">
            <select
              multiple
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={settings.selectedUsers}
              onChange={handleSelectChange}
            >
              {settings.users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.accountName}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select each of the users that you want to automatically post to
              Google Business Profile when a new post is published.
            </p>
            <div className="mt-2 flex space-x-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded">
                Select All
              </button>
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded">
                Select None
              </button>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select GBP Button Type
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option>Learn more</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Google Business Profile Post Image
          </label>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            + Browse ...
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            URL Shortener
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option>Select Shortener Type</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </SettingsSection>
    </div>
  );
};

export default GoogleBusinessProfileSettings;
