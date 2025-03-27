// ZoomSettings.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password";
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "text" }) => {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-2 mt-1"
      />
    </div>
  );
};

const ZoomSettings: React.FC = () => {
  const [accountId, setAccountId] = useState("Prgenix");
  const [clientId, setClientId] = useState("ea38KLdgRyC9h8W5Vsj56g");
  const [clientSecret, setClientSecret] = useState("****************"); // Masked for security

  const handleCreateZoomApp = () => {
    // Implement logic to create Zoom app
    console.log("Creating Zoom App...");
  };

  const handleZoomIntegrationDoc = () => {
    // Implement logic to open Zoom integration documentation
    console.log("Opening Zoom Integration Doc...");
  };

  const handleCheckApiConnection = () => {
    // Implement logic to check API connection
    console.log("Checking API Connection...");
  };

  const handleSubmit = () => {
    // Implement logic to save Zoom settings
    console.log("Saving Zoom Settings...");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Zoom Settings</h2>

      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handleCreateZoomApp}>
          Create Zoom App
        </Button>
        <Button variant="outline" onClick={handleZoomIntegrationDoc}>
          Zoom Integration doc
        </Button>
      </div>

      <div className="space-y-4">
        <InputField label="Zoom Account Id" value={accountId} onChange={(e) => setAccountId(e.target.value)} />
        <InputField label="Zoom Client Id" value={clientId} onChange={(e) => setClientId(e.target.value)} />
        <InputField label="Zoom Client Secret" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} type="password" />
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={handleCheckApiConnection}>
          Check API Connection
        </Button>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </div>
    </div>
  );
};

export default ZoomSettings;