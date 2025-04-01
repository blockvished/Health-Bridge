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
  disableImagePosting?: boolean; // Added for image posting toggle
}

// Reusable Section Component
const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
    <div className="space-y-6">{children}</div>
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
  description?: string;
  enabled: boolean | undefined;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <span className="text-sm font-medium text-gray-900">{label}</span>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
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
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
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

// Reusable Input
const Input = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);

const TwitterSettings: NextPage = () => {
  const [settings, setSettings] = useState<Settings>({
    authType: "app",
    users: [],
    selectedUsers: [],
    linkPosting: "link",
    urlShortener: "default",
    disableImagePosting: false, // Initialize disableImagePosting
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeysSets, setApiKeysSets] = useState([
    {
      apiKey: "",
      apiSecret: "",
      accessToken: "",
      accessTokenSecret: "",
    },
  ]);

  useEffect(() => {
    setLoading(true);
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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    key: keyof typeof apiKeysSets[0]
  ) => {
    const newApiKeysSets = [...apiKeysSets];
    newApiKeysSets[index][key] = e.target.value;
    setApiKeysSets(newApiKeysSets);
  };

  const handleAddApiKeySet = () => {
    setApiKeysSets([
      ...apiKeysSets,
      {
        apiKey: "",
        apiSecret: "",
        accessToken: "",
        accessTokenSecret: "",
      },
    ]);
  };

  const handleRemoveApiKeySet = (index: number) => {
    const newApiKeysSets = apiKeysSets.filter((_, i) => i !== index);
    setApiKeysSets(newApiKeysSets);
  };

  const handleUrlShortenerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({
      ...prev,
      urlShortener: e.target.value as "default" | "bitly",
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <SettingsSection title="General Settings">
        <ToggleSwitch
          label="Enable Autoposting"
          description="Enable this button, if you want to automatically post your new content to Twitter."
          enabled={settings.autoPosting}
          onToggle={() => handleToggle("autoPosting")}
        />
      </SettingsSection>

      <SettingsSection title="API Settings">
        {/* ... (API Settings section remains the same) ... */}
        {apiKeysSets.map((keys, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 mb-4">
            {/* ... (Input fields for API keys) ... */}
            {index > 0 && (
              <button
                onClick={() => handleRemoveApiKeySet(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                X
              </button>
            )}
            {index === 0 && <div />}
          </div>
        ))}
        <Button label="+ Add more" className="bg-white border border-blue-600 text-blue-600 mb-4" onClick={handleAddApiKeySet} />
        <Button label="Save" className="bg-blue-600 text-white" onClick={() => {}} />
      </SettingsSection>

      <SettingsSection title="Autopost Settings">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Autopost Posts to Twitter of this user(s)
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
              Select each of the users that you want to automatically post to Twitter when a new post is published.
            </p>
            <div className="mt-2 flex space-x-2">
              <Button label="Select All" className="bg-blue-600 text-white" onClick={() => {}} />
              <Button label="Select None" className="bg-gray-200 text-gray-700" onClick={() => {}} />
            </div>
          </div>
        </div>

        <ToggleSwitch
          label="Disable Image Posting"
          description="Enable this button, if you want to disable image posting for Twitter."
          enabled={settings.disableImagePosting}
          onToggle={() => handleToggle("disableImagePosting")}
        />

        <Button label="+ Browse ..." className="bg-blue-600 text-white" onClick={() => {}} />

        <Select
          label="URL Shortener"
          value={settings.urlShortener}
          onChange={handleUrlShortenerChange}
          options={[{ value: "default", label: "Default" }, { value: "bitly", label: "Bitly" }]}
        />

        <Button label="Save" className="bg-blue-600 text-white" onClick={() => {}} />
      </SettingsSection>
    </div>
  );
};

export default TwitterSettings;