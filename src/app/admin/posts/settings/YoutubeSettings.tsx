"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import type { NextPage } from "next";

interface User {
  userId: string;
  accountName: string;
}

interface Settings {
  authType: "app" | "api";
  users: User[];
  selectedUsers: string[];
  linkPosting: "link" | "image";
  urlShortener: "default" | "bitly";
  autoPosting?: boolean;
  proxyEnabled?: boolean;
  apiEnabled?: boolean;
  disableImagePosting?: boolean;
  enableCompanyPages?: boolean;
  apiKey?: string;
  apiSecret?: string;
}

const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
    <div className="space-y-6">{children}</div>
  </div>
);

const ToggleSwitch = ({ label, description, enabled, onToggle }: { label: string; description?: string; enabled: boolean | undefined; onToggle: () => void }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
    <div>
      <span className="text-sm font-medium text-gray-900">{label}</span>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-gray-400"}`}
    >
      <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  </div>
);

const Button = ({ label, onClick, className }: { label: string; onClick: () => void; className: string }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded ${className}`}>
    {label}
  </button>
);

const Select = ({ label, value, onChange, options, multiple = false, placeholder }: { label?: string; value: string | string[]; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[]; multiple?: boolean; placeholder?: string }) => (
  <div className="bg-white rounded-lg shadow p-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
    <select
      multiple={multiple}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Input = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
    />
  </div>
);

const YoutubeSettings: NextPage = () => {
  const [settings, setSettings] = useState<Settings>({
    authType: "app",
    users: [],
    selectedUsers: [],
    linkPosting: "link",
    urlShortener: "default",
    disableImagePosting: false,
    enableCompanyPages: false,
    apiKey: "",
    apiSecret: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setSettings((prev) => ({ ...prev, selectedUsers: Array.isArray(e.target.value) ? e.target.value : [e.target.value] }));
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUrlShortenerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({ ...prev, urlShortener: e.target.value as "default" | "bitly" }));
  };

  const handleAuthTypeChange = (value: "app" | "api") => {
    setSettings((prev) => ({ ...prev, authType: value }));
  };

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, apiKey: e.target.value }));
  };

  const handleApiSecretChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, apiSecret: e.target.value }));
  };

  const handleSelectAll = () => {
    setSettings((prev) => ({ ...prev, selectedUsers: prev.users.map((user) => user.userId) }));
  };

  const handleSelectNone = () => {
    setSettings((prev) => ({ ...prev, selectedUsers: [] }));
  };

  const handleBrowseImage = () => {
    // Implement image upload logic here
  };

  const handleSave = () => {
    // Implement save logic here
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-100">
      <SettingsSection title="General Settings">
        <ToggleSwitch
          label="Enable Autoposting"
          description="Enable this button, if you want to automatically post your new content to Youtube."
          enabled={settings.autoPosting}
          onToggle={() => handleToggle("autoPosting")}
        />
      </SettingsSection>

      <SettingsSection title="API Settings">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">
              <strong>Note:</strong> You have only 1 account to add
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <p>
            <strong>YouTube Application</strong>
          </p>
          <p>
            Before you start publishing your content to YouTube you need to create a Google Application. You can get a step by step tutorial on how to create a Google Application on our{" "}
            <a href="https://docs.yourwebsite.com/youtube-application" className="text-blue-600">
              Documentation
            </a>
            .
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input label="API Key" value={settings.apiKey || ""} onChange={handleApiKeyChange} placeholder="Enter Youtube App ID / API Key" />
          <Input label="API Secret" value={settings.apiSecret || ""} onChange={handleApiSecretChange} placeholder="Enter Youtube App Secret" />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <p>
            <strong>Allowing permissions</strong>
          </p>
        </div>

        <div className="bg-red-100 border border-red-400 rounded p-4 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938-1a9 9 0 1118.876 0A9 9 0 015.062 11z" />
          </svg>
          <p className="text-sm">
            <strong>Alert:</strong> You've reached the maximum of 1 account
          </p>
        </div>

        <Button label="Save" className="bg-blue-600 text-white" onClick={handleSave} />
      </SettingsSection>

      <SettingsSection title="Autopost Settings">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Autopost Posts to YouTube of this user(s)</label>
          <Select
            value={settings.selectedUsers}
            onChange={handleSelectChange}
            options={settings.users.map((user) => ({ value: user.userId, label: user.accountName }))}
            placeholder="Select User"
            multiple={true}
          />
          <p className="text-xs text-gray-500 mt-1">Select each of the users that you want to automatically post to YouTube when a new post is published.</p>
          <div className="mt-2 flex space-x-2">
            <Button label="Select All" className="bg-blue-600 text-white" onClick={handleSelectAll} />
            <Button label="Select None" className="bg-gray-200 text-gray-700" onClick={handleSelectNone} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Post Image</label>
          <Button label="+ Browse ..." className="bg-blue-600 text-white" onClick={handleBrowseImage} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">URL Shortener</label>
          <Select
            value={settings.urlShortener}
            onChange={handleUrlShortenerChange}
            options={[{ value: "default", label: "Default" }, { value: "bitly", label: "Bitly" }]}
            placeholder="Select Shortener Type"
          />
        </div>

        <Button label="Save" className="bg-blue-600 text-white" onClick={handleSave} />
      </SettingsSection>
    </div>
  );
};

export default YoutubeSettings;