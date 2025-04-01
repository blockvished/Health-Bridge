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
}

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

const Select = ({
  label,
  value,
  onChange,
  options,
  multiple = false,
  placeholder,
}: {
  label?: string; // Made label optional
  value: string | string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  multiple?: boolean;
  placeholder?: string;
}) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      multiple={multiple}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

const LinkedinSettings: NextPage = () => {
  const [settings, setSettings] = useState<Settings>({
    authType: "app",
    users: [],
    selectedUsers: [],
    linkPosting: "link",
    urlShortener: "default",
    disableImagePosting: false,
    enableCompanyPages: false,
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
    setSettings((prev) => ({
      ...prev,
      selectedUsers: [e.target.value],
    }));
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUrlShortenerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({
      ...prev,
      urlShortener: e.target.value as "default" | "bitly",
    }));
  };

  const handleAuthTypeChange = (value: "app" | "api") => {
    setSettings((prev) => ({ ...prev, authType: value }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <SettingsSection title="General Settings">
        <ToggleSwitch
          label="Enable Autoposting"
          description="Enable this button, if you want to automatically post your new content to LinkedIn."
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

        <div className="mb-4">
          <p>
            <strong>LinkedIn Application</strong>
          </p>
          <p>
            Before you start publishing your content to LinkedIn you need to create a
            LinkedIn Application. You can get a step by step tutorial on how to create
            a LinkedIn Application on our{" "}
            <a
              href="https://docs.yourwebsite.com/linkedin-application"
              className="text-blue-600"
            >
              Documentation
            </a>
            .
          </p>
        </div>

        <div className="mb-4">
          <p>
            <strong>Allowing permissions</strong>
          </p>
          <p>
            Posting content to your chosen LinkedIn personal account requires you to
            grant extended permissions. If you want to use this feature you should
            grant the extended permissions now.
          </p>
        </div>

        <ToggleSwitch
          label="Enable Company Pages"
          enabled={settings.enableCompanyPages}
          onToggle={() => handleToggle("enableCompanyPages")}
        />

        <div className="mb-4">
          <p>
            <strong>Select Authentication Type</strong>
          </p>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="app"
                checked={settings.authType === "app"}
                onChange={() => handleAuthTypeChange("app")}
                className="mr-2"
              />
              LinkedIn APP Method (Recommended)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="api"
                checked={settings.authType === "api"}
                onChange={() => handleAuthTypeChange("api")}
                className="mr-2"
              />
              LinkedIn API
            </label>
          </div>
        </div>

        <Button
          label="+ Add LinkedIn Account"
          className="bg-white border border-blue-600 text-blue-600 mb-4"
          onClick={() => {}}
        />

        <Button label="Save" className="bg-blue-600 text-white" onClick={() => {}} />
      </SettingsSection>

      <SettingsSection title="Autopost Settings">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Autopost Posts to LinkedIn of this user(s)
          </label>
          <div className="mt-1">
            <Select
              value={settings.selectedUsers[0] || ""}
              onChange={handleSelectChange}
              options={settings.users.map((user) => ({
                value: user.userId,
                label: user.accountName,
              }))}
              placeholder="Select User"
            />
            <p className="text-xs text-gray-500 mt-1">
              Select each of the users that you want to automatically post to LinkedIn when a new post is published.
            </p>
            <div className="mt-2 flex space-x-2">
              <Button label="Select All" className="bg-blue-600 text-white" onClick={() => {}} />
              <Button label="Select None" className="bg-gray-200 text-gray-700" onClick={() => {}} />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Post Image
          </label>
          <Button label="+ Browse ..." className="bg-blue-600 text-white" onClick={() => {}} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Shortener
          </label>
          <Select
            value={settings.urlShortener}
            onChange={handleUrlShortenerChange}
            options={[{ value: "default", label: "Default" }, { value: "bitly", label: "Bitly" }]}
            placeholder="Select Shortener Type"
          />
        </div>

        <Button label="Save" className="bg-blue-600 text-white" onClick={() => {}} />
      </SettingsSection>
    </div>
  );
};

export default LinkedinSettings;