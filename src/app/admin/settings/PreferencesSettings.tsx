"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PreferencesSettings() {
  const [multilingual, setMultilingual] = useState(true);
  const [registration, setRegistration] = useState(true);
  const [payments, setPayments] = useState(false);
  const [recaptcha, setRecaptcha] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);
  const [smsVerification, setSmsVerification] = useState(false);
  const [users, setUsers] = useState(true);
  const [blogs, setBlogs] = useState(false);
  const [faqs, setFaqs] = useState(true);
  const [workflow, setWorkflow] = useState(false);

  const handleSubmit = () => {
    // Handle form submission here
    console.log("Multilingual:", multilingual);
    console.log("Registration:", registration);
    // ... (Log other states)
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Preferences</h2>
      <div className="space-y-4">
        <ToggleSwitch
          label="Multilingual System"
          checked={multilingual}
          onChange={setMultilingual}
        />
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
        <ToggleSwitch label="Users" checked={users} onChange={setUsers} />
        <ToggleSwitch label="Blogs" checked={blogs} onChange={setBlogs} />
        <ToggleSwitch label="FAQs" checked={faqs} onChange={setFaqs} />
        <ToggleSwitch
          label="Workflow"
          checked={workflow}
          onChange={setWorkflow}
        />
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
    <div className="flex items-center justify-between">
      <p className="font-medium">{label}</p>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}
