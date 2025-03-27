"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const AffiliateSettings: React.FC = () => {
  const [enableReferral, setEnableReferral] = useState(false);
  const [commissionRate, setCommissionRate] = useState(25);
  const [minimumPayout, setMinimumPayout] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [referralGuidelines, setReferralGuidelines] = useState("");

  const handleSaveSettings = () => {
    // Implement logic to save affiliate settings
    console.log("Saving Affiliate Settings:", {
      enableReferral,
      commissionRate,
      minimumPayout,
      paymentMethod,
      referralGuidelines,
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Affiliate Settings</h2>

      <div className="flex items-center mb-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enableReferral}
            onChange={(e) => setEnableReferral(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <span className="ml-2">Enable Referral</span>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Commission Rate</label>
        <input
          type="number"
          value={commissionRate}
          onChange={(e) => setCommissionRate(parseInt(e.target.value))}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Minimum Payout</label>
        <input
          type="number"
          value={minimumPayout}
          onChange={(e) => setMinimumPayout(parseInt(e.target.value))}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Payment method</label>
        <input
          type="text"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Referral Guidelines</label>
        <textarea
          value={referralGuidelines}
          onChange={(e) => setReferralGuidelines(e.target.value)}
          className="w-full border rounded-lg p-2 h-32"
        />
      </div>

      <Button onClick={handleSaveSettings} className="bg-blue-500 text-white">
        Save Changes
      </Button>
    </div>
  );
};

export default AffiliateSettings;