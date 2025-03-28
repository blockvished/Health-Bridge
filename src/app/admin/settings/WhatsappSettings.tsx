"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsappSettings() {
  const [enableGlobally, setEnableGlobally] = useState(true);
  const [instanceId, setInstanceId] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = () => {
    console.log("Enable Globally:", enableGlobally);
    console.log("Instance Id:", instanceId);
    console.log("Token:", token);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Whatsapp (<a 
                    href="https://ultramsg.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                  >
                    Ultramsg API
                  </a>)
      </h2>

      <div className="flex items-center mb-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enableGlobally}
            onChange={(e) => setEnableGlobally(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-focus:outline-none peer-checked:bg-blue-600 transition-all duration-300">
            <span className="absolute top-0.5 left-0.5 bg-white rounded-full w-4 h-4 transition-transform duration-300 peer-checked:translate-x-4"></span>
          </div>
        </label>
        <span className="ml-2">Enable Globally</span>
      </div>

      <div className="space-y-4">
        <InputField
          label="Instance Id"
          value={instanceId}
          onChange={(e) => setInstanceId(e.target.value)}
        />
        <InputField
          label="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
        <Check className="mr-2 h-4 w-4" />
        Save Changes
      </Button>

      <a
        href="https://ultramsg.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-sm text-blue-500 hover:underline"
      >
        Learn more about Ultramsg
      </a>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full border rounded-md p-2 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}