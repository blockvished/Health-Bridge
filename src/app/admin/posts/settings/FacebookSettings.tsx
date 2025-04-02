"use client";
import {
  SingleSelectDropdown,
  MultiSelectDropdown,
} from "./_common/SelectDropdown";
import SettingsSection from "./_common/SettingsSection";
import React, { useState, ChangeEvent } from "react";
import type { NextPage } from "next";
import AlertBanner from "./_common/AlertBanner";
import FacebookAppSettings from "./_common/FacebookAppSettings";
import FacebookGraphApiSettings from "./FacebookGraphApiSettings";

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

const FacebookSettings: NextPage = () => {
  const [settings, setSettings] = useState<Settings>({
    authType: "app",
    users: [
      { userId: "user1", accountName: "Alice" },
      { userId: "user2", accountName: "Bob" },
      { userId: "user3", accountName: "Charlie" },
      { userId: "user4", accountName: "David" },
    ],
    selectedUsers: [],
    linkPosting: "link",
    urlShortener: "default",
  });

  const handleAuthTypeChange = (type: "app" | "graph") => {
    setSettings((prev) => ({ ...prev, authType: type }));
  };

  const handleSelectChange = (values: string[]) => {
    setSettings((prev) => ({
      ...prev,
      selectedUsers: values,
    }));
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLinkPostingChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      linkPosting: value as "link" | "image",
    }));
  };

  const handleUrlShortenerChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      urlShortener: value as "default" | "bitly",
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <SettingsSection title="General Settings">
        <ToggleSwitch
          label="Enable Autoposting"
          description="Enable this if you want to automatically post new content to Facebook."
          enabled={settings.autoPosting}
          onToggle={() => handleToggle("autoPosting")}
        />
      </SettingsSection>

      <SettingsSection title="Proxy Settings">
        <ToggleSwitch
          label="Enable Proxy"
          description="Enable / Disable Proxy setting for Facebook."
          enabled={settings.proxyEnabled}
          onToggle={() => handleToggle("proxyEnabled")}
        />
      </SettingsSection>

      <SettingsSection title="API Settings">
        <AlertBanner
          type="note"
          message="You've reached the maximum of 1 account"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Authentication Type
          </label>
          <div className="mt-2 flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="app"
                checked={settings.authType === "app"}
                onChange={() => handleAuthTypeChange("app")}
                className="mr-2"
              />
              Facebook App Method
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="graph"
                checked={settings.authType === "graph"}
                onChange={() => handleAuthTypeChange("graph")}
                className="mr-2"
              />
              Facebook Graph API
            </label>
          </div>
        </div>
        <AlertBanner
          type="alert"
          message="Please review the changes before saving."
        />
        {settings.authType === "app" ? (
          <FacebookAppSettings />
        ) : (
          <FacebookGraphApiSettings />
        )}

        <button className="bg-blue-600 text-white py-2 px-4 rounded mt-4">
          Save
        </button>
      </SettingsSection>
      <SettingsSection title="Autopost Settings">
        <MultiSelectDropdown
          label="Autopost Posts to Facebook of this user(s)"
          selectedValue={settings.selectedUsers}
          setSelectedValue={handleSelectChange}
          options={settings.users.map((user) => user.userId)}
          description="Select each of the users that you want to automatically post to Facebook when a new post is published." // Pass description text
        />
        <SingleSelectDropdown
          label="Share posting type"
          selectedValue={settings.linkPosting}
          setSelectedValue={handleLinkPostingChange} // Pass handleLinkPostingChange directly
          options={["Link posting", "Image posting", "Reel posting"]}
        />
        <SingleSelectDropdown
          label="URL Shortener"
          selectedValue={settings.urlShortener}
          setSelectedValue={handleUrlShortenerChange} // Pass handleUrlShortenerChange directly
          options={["default", "bitly", "TinyURL", "shorte.st"]}
        />
      </SettingsSection>
    </div>
  );
};

export default FacebookSettings;
