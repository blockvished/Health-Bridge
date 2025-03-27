// EmailSettings.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Send } from "lucide-react"; // Import Globe and Send icons

const EmailSettings: React.FC = () => {
  const [mailType, setMailType] = useState("smtp");
  const [mailTitle, setMailTitle] = useState("Live Doctor: Verify Your Account at Live Doctors");
  const [mailHost, setMailHost] = useState("smtp.gmail.com");
  const [mailPort, setMailPort] = useState("465");
  const [mailUsername, setMailUsername] = useState("");
  const [mailPassword, setMailPassword] = useState("");
  const [mailEncryption, setMailEncryption] = useState("SSL");

  const handleSaveSettings = () => {
    // Implement logic to save email settings
    console.log("Saving Email Settings:", {
      mailType,
      mailTitle,
      mailHost,
      mailPort,
      mailUsername,
      mailPassword,
      mailEncryption,
    });
  };

  const handleSendTestMail = () => {
    // Implement logic to send test mail
    console.log("Sending Test Mail...");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Email Settings</h2>

      <div className="border rounded-lg p-4 mb-4">
        <div className="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="font-semibold">Gmail Smtp</span>
        </div>
        <p>Gmail Host: smtp.gmail.com</p>
        <p>Gmail Port: 465</p>
        <div className="flex items-center mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 mr-2 text-green-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-green-500">
            If you are using gmail smtp please make sure you have set below settings before sending mail
          </p>
        </div>
        <p className="ml-7">→ Two factor authentication off</p>
        <p className="ml-7">→ Less secure app on</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mail Type</label>
        <select
          value={mailType}
          onChange={(e) => setMailType(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="smtp">smtp</option>
          {/* Add other mail type options if needed */}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mail Title</label>
        <input
          type="text"
          value={mailTitle}
          onChange={(e) => setMailTitle(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mail Host</label>
        <input
          type="text"
          value={mailHost}
          onChange={(e) => setMailHost(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mail Port</label>
        <input
          type="text"
          value={mailPort}
          onChange={(e) => setMailPort(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mail Username</label>
        <input
          type="text"
          value={mailUsername}
          onChange={(e) => setMailUsername(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mail Password</label>
        <input
          type="password"
          value={mailPassword}
          onChange={(e) => setMailPassword(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mail Encryption</label>
        <select
          value={mailEncryption}
          onChange={(e) => setMailEncryption(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="SSL">SSL</option>
          <option value="TLS">TLS</option>
          {/* Add other encryption options if needed */}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          <Globe className="inline-block w-4 h-4 mr-1" />
          SSL is used for port 465/25, TLS is used for port 587
        </p>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button onClick={handleSendTestMail} className="flex items-center">
          <Send className="w-4 h-4 mr-2" />
          Send Test Mail
        </Button>
        <Button onClick={handleSaveSettings}>Save My Changes</Button>
      </div>
    </div>
  );
};

export default EmailSettings;