"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PreferencesSettings() {
  const [registration, setRegistration] = useState(true);
  const [payments, setPayments] = useState(false);
  const [recaptcha, setRecaptcha] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);
  const [smsVerification, setSmsVerification] = useState(false);

  const handleSubmit = () => {
    // Handle form submission here
    console.log("Registration:", registration);
    // ... (Log other states)
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Preferences</h2>
      <div className="space-y-4">

        <ToggleSwitch
          label="Registration System"
          checked={registration}
          onChange={setRegistration}
        />
        <ToggleSwitch
          label="Payments"
          checked={payments}
          onChange={setPayments}
        />
        <ToggleSwitch
          label="reCaptcha"
          checked={recaptcha}
          onChange={setRecaptcha}
        />
        <ToggleSwitch
          label="Email Verification"
          checked={emailVerification}
          onChange={setEmailVerification}
        />
        <ToggleSwitch
          label="SMS Verification"
          checked={smsVerification}
          onChange={setSmsVerification}
        />
        <p className="text-sm text-red-500">
          Note: If you want to enable sms verification please make sure you have
          disabled the email verification...
        </p>
      </div>
      <Button onClick={handleSubmit} className="mt-4">
        Save Changes
      </Button>
    </div>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div 
      className="flex items-center space-x-4 cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <div className="relative inline-flex items-center">
        <div
          className={`w-9 h-5 rounded-full transition-all duration-300 ${
            checked ? "bg-blue-600" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 bg-white rounded-full w-4 h-4 transition-transform duration-300 ${
              checked ? "translate-x-4" : ""
            }`}
          ></span>
        </div>
      </div>
      <p className="font-medium">{label}</p>
    </div>
  );
}