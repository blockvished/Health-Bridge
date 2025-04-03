"use client";
import {
  SingleSelectDropdown,
  MultiSelectDropdown,
} from "./_common/SelectDropdown";
import SettingsSection from "./_common/SettingsSection";
import React, { useState } from "react";
import type { NextPage } from "next";
import AlertBanner from "./_common/AlertBanner";

interface User {
  userId: string;
  accountName: string;
}

interface Settings {
  authType: "app" | "graph";
  users: User[];
  selectedUsers: string[];
  linkPosting: "link" | "image";
  urlShortener: "default" | "bitly" | "TinyURL" | "shorte.st";
  autoPosting?: boolean;
  disableImagePosting?: boolean;
}

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

const YoutubeSettings: NextPage = () => {
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

  const handleSelectChange = (values: string[]) => {
    setSettings((prev) => ({
      ...prev,
      selectedUsers: values,
    }));
  };

  const handleUrlShortenerChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      urlShortener: value as "default" | "bitly" | "TinyURL" | "shorte.st",
    }));
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
          description="Enable this button, if you want to automatically post your new content to Youtube."
          enabled={settings.autoPosting}
          onToggle={() => handleToggle("autoPosting")}
        />
      </SettingsSection>

      <SettingsSection title="API Settings">
        <AlertBanner type="note" message="You have only 1 account to add" />
        <div className="mb-4 flex items-center">
          <div className="w-full">
            <p className="text-sm text-gray-600">
              Before you start publishing your content to Youtube you need to
              create a Google Application. You can get a step by step tutorial
              on how to create a Google Application on our
              <a href="#" className="text-blue-600 hover:underline">
                Documentation
              </a>
            </p>
          </div>
        </div>
        <div className="w-full">
          {/* Youtube API Settings specific fields */}
          <div className="flex flex-col md:flex-row mb-4">
            <div className="w-full md:w-1/4 mb-2 md:mb-0">
              <h3 className="text-base font-medium text-gray-700">API Key</h3>
            </div>
            <div className="w-full md:w-3/4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter Youtube API Key"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row mb-4">
            <div className="w-full md:w-1/4 mb-2 md:mb-0">
              <h3 className="text-base font-medium text-gray-700">Client ID</h3>
            </div>
            <div className="w-full md:w-3/4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter Youtube Client ID"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row mb-4">
            <div className="w-full md:w-1/4 mb-2 md:mb-0">
              <h3 className="text-base font-medium text-gray-700">
                Client Secret
              </h3>
            </div>
            <div className="w-full md:w-3/4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter Youtube Client Secret"
              />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-600 hover:text-white focus:outline-none border border-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Youtube Account
          </button>
        </div>
        <button className="bg-blue-600 text-white py-2 px-4 rounded mt-4">
          Save
        </button>
      </SettingsSection>

      <SettingsSection title="Autopost Settings">
        <MultiSelectDropdown
          label="Autopost Posts to Youtube of this user(s)"
          selectedValue={settings.selectedUsers}
          setSelectedValue={handleSelectChange}
          options={settings.users.map((user) => user.userId)}
          description="Select each of the users that you want to automatically post to Youtube when a new post is published."
        />

        {/* Place the Disable Image posting toggle OUTSIDE MultiSelectDropdown */}
        <div className="mb-4 flex flex-col md:flex-row items-start">
          <div className="w-full">
            <label
              htmlFor="multi-select-dropdown"
              className="block text-sm font-medium text-gray-700 mb-2 md:mb-0 md:w-3/10 flex items-center"
              style={{ lineHeight: "2.5rem" }} // Match input height
            >
              Disable Image posting
            </label>
          </div>
          <div className="">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.disableImagePosting}
                onChange={handleDisableImagePostingToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        {/* ... (rest of the component) ... */}
        <div className="mb-4 flex flex-col md:flex-row items-start">
          <label
            htmlFor="single-select-dropdown"
            className="block text-sm font-medium text-gray-700 mb-2 md:mb-0 md:w-3/10 flex items-center"
            style={{ lineHeight: "2.5rem" }}
          >
            Youtube Video Thumbnail
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
          options={["default", "bitly", "TinyURL", "shorte.st"]}
        />
      </SettingsSection>
    </div>
  );
};

export default YoutubeSettings;
