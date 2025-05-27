"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, Loader2 } from "lucide-react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password";
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}) => {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
};

interface ZoomSettingsData {
  zoomAccountId: string;
  zoomClientId: string;
  zoomClientSecret: string;
}

const ZoomSettings: React.FC = () => {
  const [accountId, setAccountId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch existing settings on component mount
  useEffect(() => {
    fetchZoomSettings();
  }, []);

  const fetchZoomSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/settings/zoom_settings');
      const result = await response.json();

      if (result.success && result.data) {
        setAccountId(result.data.zoomAccountId || "");
        setClientId(result.data.zoomClientId || "");
        setClientSecret(result.data.zoomClientSecret || "");
      }
    } catch (error) {
      console.error('Error fetching zoom settings:', error);
      setMessage({ type: 'error', text: 'Failed to load zoom settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateZoomApp = () => {
    window.open("https://marketplace.zoom.us/develop/create", "_blank");
  };

  const handleZoomIntegrationDoc = () => {
    window.open("https://doxe.originlabsoft.com/docs/#docs_zoom", "_blank");
  };

  const handleSubmit = async () => {
    if (!accountId || !clientId || !clientSecret) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    try {
      setIsSaving(true);
      setMessage(null);

      const response = await fetch('/api/admin/settings/zoom_settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zoomAccountId: accountId,
          zoomClientId: clientId,
          zoomClientSecret: clientSecret
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Update the client secret display
        setClientSecret("****************");
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving zoom settings:', error);
      setMessage({ type: 'error', text: 'Failed to save zoom settings' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading zoom settings...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Zoom Settings</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

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
          disabled={isSaving}
        />
        <InputField
          label="Zoom Client Id"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          disabled={isSaving}
        />
        <InputField
          label="Zoom Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          type="password"
          disabled={isSaving}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
        <Button
          variant="outline"
          disabled={isCheckingConnection || isSaving}
          className="w-full sm:w-auto text-red-500 border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
        >
          {isCheckingConnection ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <AlertTriangle className="mr-2 h-4 w-4" />
          )}
          Check API Connection
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSaving || isCheckingConnection}
          className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ZoomSettings;