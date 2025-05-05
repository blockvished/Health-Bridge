"use client";
import {
  SingleSelectDropdown,
  MultiSelectDropdown,
} from "./_common/SelectDropdown";
import SettingsSection from "./_common/SettingsSection";
import React, { useState } from "react";
import type { NextPage } from "next";
import AlertBanner from "./_common/AlertBanner";
import TwitterApi from "./_common/TwitterApi";

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

const TwitterSettings: NextPage = () => {
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

  const handleSelectChange = (values: string[]) => {
    setSettings((prev) => ({
      ...prev,
      selectedUsers: values,
    }));
  };

  const handleUrlShortenerChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      urlShortener: value as "default" | "bitly",
    }));
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  
  // const handleAuthTypeChange = (type: "app" | "graph") => {
  //   setSettings((prev) => ({ ...prev, authType: type }));
  // };


  return (
    <div className="p-6 space-y-6">
      <SettingsSection title="General Settings">
        <ToggleSwitch
          label="Enable Autoposting"
          description="Enable this button, if you want to automatically post your new content to Twitter."
          enabled={settings.autoPosting}
          onToggle={() => handleToggle("autoPosting")}
        />
      </SettingsSection>

      <SettingsSection title="API Settings">
        <AlertBanner
          type="note"
          message="You've reached the maximum of 1 account"
        />
        <TwitterApi />
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
          description="Select each of the users that you want to automatically post to Twitter when a new post is published."
        />
        <ToggleSwitch
          label="Disable Image posting"
          description="Enable this button, if you want to disable image posting for Twitter."
          enabled={settings.autoPosting}
          onToggle={() => handleToggle("autoPosting")}
        />
        <div className="mb-4 flex flex-col md:flex-row mt-6 items-start">
          <label
            htmlFor="single-select-dropdown"
            className="block text-sm font-medium text-gray-700 mb-2 md:mb-0 md:w-3/10 flex items-center"
            style={{ lineHeight: "2.5rem" }} // Match input height
          >
            Twitter Post Image
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
          setSelectedValue={handleUrlShortenerChange} // Pass handleUrlShortenerChange directly
          options={["default", "bitly", "TinyURL", "shorte.st"]}
        />
      </SettingsSection>
    </div>
  );
};

export default TwitterSettings;
