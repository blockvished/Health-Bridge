// SocialSettings.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const SocialSettings: React.FC = () => {
  const [facebookUrl, setFacebookUrl] = useState("https://www.facebook.com/livedoctors.in");
  const [twitterUrl, setTwitterUrl] = useState("https://x.com/LiveDoctors24/");
  const [instagramUrl, setInstagramUrl] = useState("https://www.instagram.com/livedoctors/");
  const [linkedinUrl, setLinkedinUrl] = useState("https://www.linkedin.com/company/livedoctorsofficial/");
  const [googleAnalyticsCode, setGoogleAnalyticsCode] = useState(`
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-7DK8D4JDJ1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-7DK8D4JDJ1');
    </script>
  `);

  const handleSaveSettings = () => {
    // Implement logic to save social settings
    console.log("Saving Social Settings:", {
      facebookUrl,
      twitterUrl,
      instagramUrl,
      linkedinUrl,
      googleAnalyticsCode,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Social Settings</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Facebook</label>
        <input
          type="text"
          value={facebookUrl}
          onChange={(e) => setFacebookUrl(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Twitter</label>
        <input
          type="text"
          value={twitterUrl}
          onChange={(e) => setTwitterUrl(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Instagram</label>
        <input
          type="text"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Linkedin</label>
        <input
          type="text"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Google Analytics</label>
        <textarea
          value={googleAnalyticsCode}
          onChange={(e) => setGoogleAnalyticsCode(e.target.value)}
          className="w-full border rounded-lg p-2"
          rows={6} 
        />
      </div>

      <Button onClick={handleSaveSettings}>Save Changes</Button>
    </div>
  );
};

export default SocialSettings;