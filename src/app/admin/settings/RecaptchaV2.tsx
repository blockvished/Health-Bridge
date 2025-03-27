// ReCaptchaV2Settings.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const ReCaptchaV2Settings: React.FC = () => {
  const [siteKey, setSiteKey] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleSaveSettings = () => {
    // Implement logic to save reCAPTCHA v2 settings
    console.log("Saving reCAPTCHA v2 Settings:", { siteKey, secretKey });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">reCAPTCHA v2 Settings</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Captcha Site key</label>
        <input
          type="text"
          value={siteKey}
          onChange={(e) => setSiteKey(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Captcha Secret key</label>
        <input
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <Button onClick={handleSaveSettings}>Save Changes</Button>
    </div>
  );
};

export default ReCaptchaV2Settings;