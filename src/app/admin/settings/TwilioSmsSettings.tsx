// TwilioSmsSettings.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const TwilioSmsSettings: React.FC = () => {
  const [enableGlobally, setEnableGlobally] = useState(true);
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [senderNumber, setSenderNumber] = useState("");

  const handleSaveSettings = () => {
    // Implement logic to save Twilio SMS settings
    console.log("Saving Twilio SMS Settings:", {
      enableGlobally,
      accountSid,
      authToken,
      senderNumber,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Twilio SMS Settings</h2>

      <div className="flex items-center mb-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enableGlobally}
            onChange={(e) => setEnableGlobally(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <div className="ml-2">
          <span>Enable Globally</span>
          <p className="text-xs text-gray-500">Enable twilio for globally</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Account SID</label>
        <input
          type="text"
          value={accountSid}
          onChange={(e) => setAccountSid(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Twilio Auth Token</label>
        <input
          type="text"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Sender Number (Twilio)</label>
        <input
          type="text"
          value={senderNumber}
          onChange={(e) => setSenderNumber(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <Button onClick={handleSaveSettings}>Save Changes</Button>
    </div>
  );
};

export default TwilioSmsSettings;