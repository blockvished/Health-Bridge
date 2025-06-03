"use client";
// CustomDomainSettings.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// Remove the import since we're using fetch now

const CustomDomainSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("Custom Domain Integration Guideline");
  const [shortDetails, setShortDetails] = useState(
    "Custom Domain Integration Guideline short details"
  );
  const [details, setDetails] = useState("");
  const [serverIp, setServerIp] = useState("200.201.231.122");
  const [type1, setType1] = useState("CNAME Record");
  const [host1, setHost1] = useState("www");
  const [value1, setValue1] = useState("www.livedoctors.in");
  const [ttl1, setTtl1] = useState("Automatic");
  const [type2, setType2] = useState("A Record");
  const [host2, setHost2] = useState("@");
  const [value2, setValue2] = useState("200.201.231.122");
  const [ttl2, setTtl2] = useState("Automatic");

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/domain-settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const settings = await response.json();
        
        setTitle(settings.title);
        setShortDetails(settings.shortDetails);
        setDetails(settings.details || "");
        setServerIp(settings.serverIp);
        setType1(settings.type1);
        setHost1(settings.host1);
        setValue1(settings.value1);
        setTtl1(settings.ttl1);
        setType2(settings.type2);
        setHost2(settings.host2);
        setValue2(settings.value2);
        setTtl2(settings.ttl2);
      } catch (error) {
        console.error("Failed to load settings:", error);
        // Keep default values if loading fails
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/domain-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          shortDetails,
          details,
          serverIp,
          type1,
          host1,
          value1,
          ttl1,
          type2,
          host2,
          value2,
          ttl2,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      const savedSettings = await response.json();
      console.log("Settings saved successfully:", savedSettings);
      // You can add a toast notification here
    } catch (error) {
      console.error("Failed to save settings:", error);
      // You can add error handling/toast here
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Domain Settings</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Short Details</label>
        <input
          type="text"
          value={shortDetails}
          onChange={(e) => setShortDetails(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full border rounded-lg p-2 h-32"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Your Server IP Address</label>
        <input
          type="text"
          value={serverIp}
          onChange={(e) => setServerIp(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
        <p className="text-xs text-blue-600 mt-1">
          This IP address will be used to setup users custom domain &gt; DNS
          settings
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block font-medium mb-1">Type1</label>
          <input
            type="text"
            value={type1}
            onChange={(e) => setType1(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Host1</label>
          <input
            type="text"
            value={host1}
            onChange={(e) => setHost1(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Value1</label>
          <input
            type="text"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">TTL1</label>
          <input
            type="text"
            value={ttl1}
            onChange={(e) => setTtl1(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block font-medium mb-1">Type2</label>
          <input
            type="text"
            value={type2}
            onChange={(e) => setType2(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Host2</label>
          <input
            type="text"
            value={host2}
            onChange={(e) => setHost2(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Value2</label>
          <input
            type="text"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">TTL2</label>
          <input
            type="text"
            value={ttl2}
            onChange={(e) => setTtl2(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>

      <Button 
        onClick={handleSaveSettings} 
        className="bg-blue-500 text-white"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default CustomDomainSettings;