"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TrialSettings() {
  const [trialDays, setTrialDays] = useState(30);
  const [emailBeforePlanEnds, setEmailBeforePlanEnds] = useState(7);
  const [currency, setCurrency] = useState("USD");
  const [keywords, setKeywords] = useState([
    "appointment",
    "doctors",
    "clinic",
    "practice management",
    "chamber",
  ]);

  const currencies = ["USD", "EUR", "GBP", "INR", "JPY"];

  const handleSubmit = () => {
    console.log("Trial Days:", trialDays);
    console.log("Email Before Plan Ends:", emailBeforePlanEnds);
    console.log("Currency:", currency);
    console.log("Keywords:", keywords);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Trial Settings</h2>
      <div className="mt-6 space-y-4">
        <InputField
          label="Set trial days"
          type="number"
          value={trialDays}
          onChange={(e) => setTrialDays(Number(e.target.value))}
        />
        <p className="text-red-600 text-sm mt-0">
          <span className="font-bold">!</span> Set 0 to disable trial option
        </p>
        <InputField
          label="Email before the plan ends"
          type="number"
          value={emailBeforePlanEnds}
          onChange={(e) => setEmailBeforePlanEnds(Number(e.target.value))}
        />
        <p className="text-red-600 text-sm mt-0">
          <span className="font-bold">!</span> Set 0 to disable this option
        </p>

        <div>
          <p className="font-medium">Currency</p>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={handleSubmit} className="mt-4">
          Save Settings
        </Button>
      </div>
    </div>
  );
}

function InputField({
  label,
  defaultValue,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <input
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-2 mt-1"
      />
    </div>
  );
}