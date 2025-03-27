"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WebsiteSettings() {
  const [trialDays, setTrialDays] = useState(30);
  const [emailBeforePlanEnds, setEmailBeforePlanEnds] = useState(7);
  const [currency, setCurrency] = useState("USD");

  const currencies = ["USD", "EUR", "GBP", "INR", "JPY"]; // Example currency options

  const handleSubmit = () => {
    // Handle form submission here (e.g., send data to an API)
    console.log("Trial Days:", trialDays);
    console.log("Email Before Plan Ends:", emailBeforePlanEnds);
    console.log("Currency:", currency);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Website Settings</h2>

      {/* Image Upload Section */}
      <div className="flex justify-between items-center bg-[#f9f9f9] p-4 rounded-lg">
        <UploadButton label="Upload Favicon" />
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="w-20 mb-2" />
          <UploadButton label="Upload Logo" />
        </div>
        <div className="flex flex-col items-center">
          <img src="/doctor.png" alt="Doctor" className="w-20 mb-2" />
          <UploadButton label="Upload Home Image" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="mt-6 space-y-4">
        <InputField label="Application Name" defaultValue="Live Doctors" />
        <InputField
          label="Application Title"
          defaultValue="Comprehensive tools to manage health care practice."
        />
        <TagInput
          label="Keywords"
          tags={[
            "appointment",
            "doctors",
            "clinic",
            "practice management",
            "chamber",
          ]}
        />
        <TextareaField
          label="Description"
          defaultValue="Our all-in-one healthcare practice management system is designed to simplify and optimize your clinical operations."
        />
        <TextareaField
          label="Footer About"
          defaultValue="Live Doctors is an all-in-one encompassing healthcare practice management system designed to streamline clinical operations and enhance marketing efforts for all the doctors and medical practitioners."
        />
        <InputField label="Admin Email" defaultValue="imvpathak@gmail.com" />
        <InputField
          label="Copyright"
          defaultValue="Copyright: © 2024. Live Doctors. All Rights Reserved. An Initiative of Prgenix"
        />

        {/* New Number Inputs */}
        <InputField
          label="Set trial days"
          type="number"
          value={trialDays}
          onChange={(e) => setTrialDays(Number(e.target.value))}
        />
        <InputField
          label="Email before the plan ends"
          type="number"
          value={emailBeforePlanEnds}
          onChange={(e) => setEmailBeforePlanEnds(Number(e.target.value))}
        />

        {/* Select Input */}
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

        {/* Submit Button */}
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

function UploadButton({ label }: { label: string }) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 bg-[#e0e0e0] cursor-not-allowed"
    >
      {" "}
      {/* Light gray for button */}
      <Upload size={16} />
      {label}
    </Button>
  );
}

function TagInput({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <div className="border rounded-lg p-2 mt-1 flex flex-wrap gap-2 bg-[#f9f9f9]">
        {" "}
        {/* Slightly lighter gray for tag input */}
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-500 text-white px-2 py-1 rounded-lg text-sm"
          >
            {tag} ✖
          </span>
        ))}
      </div>
    </div>
  );
}

function TextareaField({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <textarea
        defaultValue={defaultValue}
        className="w-full border rounded-lg p-2 mt-1 h-24"
      ></textarea>
    </div>
  );
}
