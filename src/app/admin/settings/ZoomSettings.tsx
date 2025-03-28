"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle } from "lucide-react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password";
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

const ZoomSettings: React.FC = () => {
  const [accountId, setAccountId] = useState("Prgenix");
  const [clientId, setClientId] = useState("ekhjg");
  const [clientSecret, setClientSecret] = useState("****************");

  const handleCreateZoomApp = () => {
    console.log("Creating Zoom App...");
  };

  const handleZoomIntegrationDoc = () => {
    window.open("https://doxe.originlabsoft.com/docs/#docs_zoom", "_blank");
  };

  const handleCheckApiConnection = () => {
    console.log("Checking API Connection...");
  };

  const handleSubmit = () => {
    console.log("Saving Zoom Settings...");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Zoom Settings</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <Button
          variant="outline"
          onClick={handleCreateZoomApp}
          className="w-full sm:w-auto text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Create Zoom App
        </Button>
        <Button
          variant="outline"
          onClick={handleZoomIntegrationDoc}
          className="w-full sm:w-auto text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
        >
          <Check className="mr-2 h-4 w-4" />
          Zoom Integration doc
        </Button>
      </div>

      <div className="space-y-4">
        <InputField
          label="Zoom Account Id"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <InputField
          label="Zoom Client Id"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <InputField
          label="Zoom Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          type="password"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
        <Button
          variant="outline"
          onClick={handleCheckApiConnection}
          className="w-full sm:w-auto text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Check API Connection
        </Button>
        <Button
          onClick={handleSubmit}
          className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600"
        >
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ZoomSettings;