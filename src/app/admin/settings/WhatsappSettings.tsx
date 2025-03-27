// WhatsappSettings.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const WhatsappSettings: React.FC = () => {
  const [enableGlobally, setEnableGlobally] = useState(true);
  const [instanceId, setInstanceId] = useState("");
  const [tokenId, setTokenId] = useState("");

  const handleSaveSettings = () => {
    // Implement logic to save WhatsApp settings
    console.log("Saving WhatsApp Settings:", {
      enableGlobally,
      instanceId,
      tokenId,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Whatsapp (Ultramsg API) Settings</h2>

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
        <span className="ml-2">Enable Globally</span>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Instance Id</label>
        <input
          type="text"
          value={instanceId}
          onChange={(e) => setInstanceId(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Token Id</label>
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <Button onClick={handleSaveSettings}>Save Changes</Button>
    </div>
  );
};

export default WhatsappSettings;