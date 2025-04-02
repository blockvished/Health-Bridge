"use client";
import {
  SingleSelectDropdown,
  MultiSelectDropdown,
} from "./_common/SelectDropdown";
import SettingsSection from "./_common/SettingsSection";
import React, { useState } from "react";
import type { NextPage } from "next";
import LinkedinApi from "./_common/LinkedinApi";
import TumblrApi from "./_common/TumblrApi";

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
  proxyEnabled?: boolean;
  apiEnabled?: boolean;
  snippets?: boolean; // Add snippets to settings
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

const TumblrSettings: NextPage = () => {
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
    snippets: true, // Initialize snippets to true
  });

  const handleSelectChange = (values: string[]) => {
    setSettings((prev) => ({
      ...prev,
      selectedUsers: values,
    }));
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
      urlShortener: value as "default" | "bitly" | "TinyURL" | "shorte.st",
    }));
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSnippetsChange = () => {
    setSettings((prev) => ({ ...prev, snippets: true }));
  };

  const handleFullChange = () => {
    setSettings((prev) => ({ ...prev, snippets: false }));
  };

  return (
    <div className="p-6 space-y-6">
      <SettingsSection title="General Settings">
        <ToggleSwitch
          label="Enable Autoposting"
          description="Enable this button, if you want to automatically post your new content to Tumblr."
          enabled={settings.autoPosting}
          onToggle={() => handleToggle("autoPosting")}
        />
        <PostContent
          snippets={settings.snippets || false}
          onSnippetsChange={handleSnippetsChange}
          onFullChange={handleFullChange}
        />
        <button className="bg-blue-600 text-white py-2 px-4 rounded mt-4">
          Save
        </button>
      </SettingsSection>

      <SettingsSection title="API Settings">
        <TumblrApi />
        <button className="bg-blue-600 text-white py-2 px-4 rounded mt-4">
          Save
        </button>
      </SettingsSection>
      <SettingsSection title="Autopost Settings">
        <MultiSelectDropdown
          label="Autopost Posts to Tumblr of this user(s)"
          selectedValue={settings.selectedUsers}
          setSelectedValue={handleSelectChange}
          options={settings.users.map((user) => user.userId)}
          description="Select each of the users that you want to automatically post to Tumblr when a new post is published."
        />
        <SingleSelectDropdown
          label="Posting type"
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

export default TumblrSettings;

interface PostContentProps {
  snippets: boolean;
  onSnippetsChange: () => void;
  onFullChange: () => void;
}

const PostContent: React.FC<PostContentProps> = ({
  snippets,
  onSnippetsChange,
  onFullChange,
}) => {
  return (
    <div className="mb-4 flex items-start mt-4">
      <div className="w-1/4">
        <label className="text-sm font-medium text-gray-700">
          Post Content
        </label>
      </div>
      <div className="w-3/4">
        <div className="flex items-center mb-2">
          <label className="flex items-center mr-4">
            <input
              type="radio"
              name="postContent"
              value="snippets"
              checked={snippets}
              onChange={onSnippetsChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Snippets</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="postContent"
              value="full"
              checked={!snippets}
              onChange={onFullChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Full</span>
          </label>
        </div>
        <p className="text-sm text-gray-600">
          Choose whether you want to post the full content or just a snippet to
          your Tumblr page. If you choose snippets, it will post the first 200
          characters from your post.
        </p>
      </div>
    </div>
  );
};
