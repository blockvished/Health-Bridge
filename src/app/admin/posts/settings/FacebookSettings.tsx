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

// Reusable User Input Form
const UserForm = ({
  newUser,
  handleInputChange,
  addUser,
  error,
}: {
  newUser: User;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof User
  ) => void;
  addUser: () => void;
  error: string;
}) => (
  <div className="mt-4">
    <input
      type="text"
      placeholder="User ID"
      value={newUser.userId}
      onChange={(e) => handleInputChange(e, "userId")}
      className="border p-2 rounded mr-2"
    />
    <input
      type="text"
      placeholder="Account Name"
      value={newUser.accountName}
      onChange={(e) => handleInputChange(e, "accountName")}
      className="border p-2 rounded mr-2"
    />
    <button
      onClick={addUser}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Add Account
    </button>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </div>
);

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

// Reusable Select Users component
const SelectUsers = ({
  users,
  selectedUsers,
  handleSelectChange,
  handleSelectAll,
}: {
  users: User[];
  selectedUsers: string[];
  handleSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleSelectAll: () => void;
}) => (
  <div>
    <label
      htmlFor="autopostUsers"
      className="block text-sm font-medium text-gray-700"
    >
      Autopost Posts to Facebook of the user(s)
    </label>
    <select
      id="autopostUsers"
      multiple
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      value={selectedUsers}
      onChange={handleSelectChange}
    >
      {users.map((user) => (
        <option key={user.userId} value={user.userId}>
          {user.accountName}
        </option>
      ))}
    </select>
    <div className="mt-2">
      <button
        onClick={handleSelectAll}
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded mr-2"
      >
        {users.length === selectedUsers.length ? "Select None" : "Select All"}
      </button>
    </div>
  </div>
);

const FacebookSettings: NextPage = () => {
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

  const handleSelectUser = (userId: string) => {
    setSettings((prev) => {
      if (prev.selectedUsers.includes(userId)) {
        return {
          ...prev,
          selectedUsers: prev.selectedUsers.filter((id) => id !== userId),
        };
      } else {
        return {
          ...prev,
          selectedUsers: [...prev.selectedUsers, userId],
        };
      }
    });
  };

  const handleToggle = (key: keyof Settings) => {
    if (
      key === "autoPosting" ||
      key === "proxyEnabled" ||
      key === "apiEnabled"
    ) {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSelectAllUsers = () => {
    if (settings.users.length === settings.selectedUsers.length) {
      setSettings((prev) => ({ ...prev, selectedUsers: [] }));
    } else {
      setSettings((prev) => ({
        ...prev,
        selectedUsers: prev.users.map((user) => user.userId),
      }));
    }
  };

  const handleLinkPostingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({
      ...prev,
      linkPosting: e.target.value as "link" | "image",
    }));
  };

  const handleUrlShortenerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({
      ...prev,
      urlShortener: e.target.value as "default" | "bitly",
    }));
  };

  return (
    <div className="p-6 space-y-8">
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
        <p className="text-sm text-gray-500">
          Enable API access for third-party integrations.
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
        <UserForm
          newUser={newUser}
          handleInputChange={handleInputChange}
          addUser={addUser}
          error={error}
        />
        <UserTable users={settings.users} deleteUser={deleteUser} />
      </SettingsSection>

      <SettingsSection title="Autopost Settings">
        <SelectUsers
          users={settings.users}
          selectedUsers={settings.selectedUsers}
          handleSelectChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setSettings((prev) => ({
              ...prev,
              selectedUsers: selectedOptions,
            }));
          }}
          handleSelectAll={handleSelectAllUsers}
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
            onChange={handleLinkPostingChange}
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
            onChange={handleUrlShortenerChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="default">Default</option>
            <option value="bitly">Bitly</option>
          </select>
        </div>
      </SettingsSection>

      <button className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Save
      </button>
    </div>
  );
};

export default FacebookSettings;
