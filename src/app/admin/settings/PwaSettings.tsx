// PwaSettings.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react"; // Import Upload icon

const PwaSettings: React.FC = () => {
  const [enablePwa, setEnablePwa] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSaveSettings = () => {
    // Implement logic to save PWA settings
    console.log("Saving PWA Settings:", {
      enablePwa,
      logoFile,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">PWA Settings</h2>

      <div className="flex items-center mb-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enablePwa}
            onChange={(e) => setEnablePwa(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <div className="ml-2">
          <span>Enable PWA (Progressive Web Apps)</span>
          <p className="text-xs text-gray-500">Enable to allow your users to install PWA on their phone</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <div className="border rounded-lg p-4 mr-4">
            {logoFile ? (
              <img src={URL.createObjectURL(logoFile)} alt="PWA Logo" className="w-24 h-24" />
            ) : (
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Logo Preview</p>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="logo-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Browse
                </span>
              </Button>
            </label>
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">Image size 512x512</p>
          </div>
        </div>
      </div>

      <Button onClick={handleSaveSettings}>Save Changes</Button>
    </div>
  );
};

export default PwaSettings;