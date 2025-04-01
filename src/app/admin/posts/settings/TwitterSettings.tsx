"use client";

// Reusable User Table
const UserTable = ({
  users,
  deleteUser,
}: {
  users: User[];
  deleteUser: (userId: string) => void;
}) => (
  <table className="mt-4 w-full">
    <thead>
      <tr>
        <th className="text-left">User ID</th>
        <th className="text-left">Account Name</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.userId}>
          <td className="border px-4 py-2">{user.userId}</td>
          <td className="border px-4 py-2">{user.accountName}</td>
          <td className="border px-4 py-2">
            <button
              onClick={() => deleteUser(user.userId)}
              className="text-red-600"
            >
              Delete Account
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

import React, { useState, ChangeEvent } from "react";
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

// Reusable Select Input for Multiple Selection
const SelectMultiple = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: User[];
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      multiple
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    >
      {options.map((user) => (
        <option key={user.userId} value={user.userId}>
          {user.accountName}
        </option>
      ))}
    </select>
  </div>
);

const TwitterSettings: NextPage = () => {
  const [settings, setSettings] = useState<Settings>({
    authType: "app",
    users: [],
    selectedUsers: [],
    linkPosting: "link",
    urlShortener: "default",
  });

  const [newUser, setNewUser] = useState<User>({
    userId: "",
    accountName: "",
  });

  const [error, setError] = useState<string>("");

  const handleAuthTypeChange = (type: "app" | "graph") => {
    setSettings((prev) => ({ ...prev, authType: type }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof User
  ) => {
    setNewUser((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const addUser = () => {
    if (!newUser.userId || !newUser.accountName) {
      setError("Please fill in all fields.");
      return;
    }

    if (settings.users.length >= 1) {
      setError("You have reached the maximum allowed accounts.");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }));
    setNewUser({ userId: "", accountName: "" });
    setError("");
  };

  const deleteUser = (userId: string) => {
    setSettings((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.userId !== userId),
      selectedUsers: prev.selectedUsers.filter((id) => id !== userId),
    }));
  };

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

  return (
    <div className="p-6 space-y-8">
      <SettingsSection title="General Settings">
        <ToggleSwitch
          label="Enable Autoposting"
          description="Enable this button, if you want to automatically post your new content to Twitter."
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
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Alert:
            </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="text"
              value={newUser.userId}
              onChange={(e) => handleInputChange(e, "userId")}
              placeholder="Enter User ID"
              className="mt-1 block w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Name
            </label>
            <input
              type="text"
              value={newUser.accountName}
              onChange={(e) => handleInputChange(e, "accountName")}
              placeholder="Enter Account Name"
              className="mt-1 block w-full border p-2 rounded"
            />
          </div>
          <div>
            <button
              onClick={addUser}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-6"
            >
              Add Account
            </button>
          </div>
        </div>
        <UserTable users={settings.users} deleteUser={deleteUser} />
      </SettingsSection>
      <SettingsSection title="Autopost Settings">
        <SelectMultiple
          label="Select Users"
          value={settings.selectedUsers}
          onChange={handleSelectChange}
          options={settings.users}
        />
        <div className="mt-4">
          <label
            htmlFor="linkPostingType"
            className="block text-sm font-medium text-gray-700"
          >
            Choose posting type
          </label>
          <select
            id="linkPostingType"
            value={settings.linkPosting}
            onChange={(e) =>
              setSettings({
                ...settings,
                linkPosting: e.target.value as "link" | "image",
              })
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="link">Link posting</option>
            <option value="image">Image posting</option>
          </select>
        </div>
        <div className="mt-4">
          <label
            htmlFor="urlShortenerType"
            className="block text-sm font-medium text-gray-700"
          >
            URL Shortener
          </label>
          <select
            id="urlShortenerType"
            value={settings.urlShortener}
            onChange={(e) =>
              setSettings({
                ...settings,
                urlShortener: e.target.value as "default" | "bitly",
              })
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="default">Default</option>
            <option value="bitly">Bitly</option>
          </select>
        </div>
      </SettingsSection>

      <Button
        label="Save"
        onClick={() => console.log("Settings saved!")}
        className="bg-blue-600 text-white mt-6"
      />
    </div>
  );
};

export default TwitterSettings;
