"use client";
import {
  SingleSelectDropdown,
  MultiSelectDropdown,
} from "./_common/SelectDropdown";
import SettingsSection from "./_common/SettingsSection";
import React, { useState } from "react";
import type { NextPage } from "next";
import AlertBanner from "./_common/AlertBanner";
import PinterestAppSettings from "./_common/PinterestAppSettings"; // Replace with your Pinterest-specific app settings
import PinterestCookieSettings from "./_common/PinterestCookieSettings"; // Replace with your Pinterest-specific cookie settings

interface User {
  userId: string;
  accountName: string;
}

interface Settings {
  authType: "app" | "cookie"; // Changed from "graph" to "cookie"
  users: User[];
  selectedUsers: string[];
  linkPosting: "link" | "image";
  urlShortener: "default" | "bitly";
  autoPosting?: boolean;
  proxyEnabled?: boolean;
  apiEnabled?: boolean;
  disableImagePosting?: boolean; // Added disableImagePosting
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

const PinterestSettings: NextPage = () => {
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
    disableImagePosting: false,
  });

  const handleAuthTypeChange = (type: "app" | "cookie") => {
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

  const handleDisableImagePostingToggle = () => {
    setSettings((prev) => ({
      ...prev,
      disableImagePosting: !prev.disableImagePosting,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <SettingsSection title="General Settings">
        <ToggleSwitch
          label="Enable Autoposting"
          description="Enable this if you want to automatically post new Pins to Pinterest."
          enabled={settings.autoPosting}
          onToggle={() => handleToggle("autoPosting")}
        />
      </SettingsSection>

      <SettingsSection title="Proxy Settings">
        <ToggleSwitch
          label="Enable Proxy"
          description="Enable / Disable Proxy setting for Pinterest."
          enabled={settings.proxyEnabled}
          onToggle={() => handleToggle("proxyEnabled")}
        />
      </SettingsSection>

      <SettingsSection title="Pinterest API Settings">
  <AlertBanner
    type="note"
    message="You've reached the maximum of 1 account"
  />
  <div className="mt-6 mb-6"> {/* Increased margin bottom */}
    <label className="block text-sm font-medium text-gray-700">
      Select Authentication Type
    </label>
    <div className="mt-3 flex items-center space-x-4"> {/* Increased margin top */}
      <label className="flex items-center">
        <input
          type="radio"
          value="app"
          checked={settings.authType === "app"}
          onChange={() => handleAuthTypeChange("app")}
          className="mr-2"
        />
        Pinterest App Method
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          value="cookie"
          checked={settings.authType === "cookie"}
          onChange={() => handleAuthTypeChange("cookie")}
          className="mr-2"
        />
        Pinterest Cookie Method
      </label>
    </div>
  </div>
  <div className="mb-4"> {/* Added margin bottom for spacing */}
    {settings.authType === "app" ? (
      <PinterestAppSettings />
    ) : (
      <PinterestCookieSettings />
    )}
  </div>

  <div className="mt-6"> {/* Increased margin top */}
    <button className="bg-blue-600 text-white py-2 px-4 rounded">
      Save
    </button>
  </div>
</SettingsSection>
      <SettingsSection title="Autopost Settings">
        <MultiSelectDropdown
          label="Autopost Pins to Pinterest of this user(s)"
          selectedValue={settings.selectedUsers}
          setSelectedValue={handleSelectChange}
          options={settings.users.map((user) => user.userId)}
          description="Select each of the users that you want to automatically post to Pinterest when a new Pin is published."
        />

          <AlertBanner
            type="note"
            message="Here you can upload a default image which will be used for the Pinterest board."
          />
        <div className="mb-4 flex flex-col md:flex-row items-start">
          <label
            htmlFor="single-select-dropdown"
            className="block text-sm font-medium text-gray-700 mb-2 md:mb-0 md:w-3/10 flex items-center"
            style={{ lineHeight: "2.5rem" }}
          >
            Pinterest Image/Video
          </label>
          <input
            type="file"
            id="image-upload"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log("File uploaded:", file);
              }
            }}
          />
          <button
            onClick={() => document.getElementById("image-upload")?.click()}
            className="hover:bg-transparent hover:text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded bg-blue-500 text-white cursor-pointer"
          >
            + Browse
          </button>
        </div>
        <SingleSelectDropdown
          label="URL Shortener"
          selectedValue={settings.urlShortener}
          setSelectedValue={handleUrlShortenerChange}
          options={["default", "bitly"]} // Removed TinyURL
        />
      </SettingsSection>
    </div>
  );
};

export default PinterestSettings;
