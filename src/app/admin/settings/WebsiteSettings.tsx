"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WebsiteSettings() {
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

  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(updatedKeywords);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      setKeywords([...keywords, e.currentTarget.value.trim()]);
      e.currentTarget.value = "";
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Website Settings</h2>

      <div className="flex flex-col md:flex-row gap-4 bg-[#f9f9f9] p-4 rounded-lg md:justify-between">
        <div className="flex items-center justify-between w-full md:w-auto">
          <UploadButton label="Upload Favicon" />
        </div>
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex flex-col items-center">
            <img src="/logo.png" alt="Logo" className="w-20 mb-2" />
            <UploadButton label="Upload Logo" />
          </div>
        </div>
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex flex-col items-center">
            <img src="/doctor.png" alt="Doctor" className="w-20 mb-2" />
            <UploadButton label="Upload Home Image" />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <InputField label="Application Name" defaultValue="Live Doctors" />
        <InputField
          label="Application Title"
          defaultValue="Comprehensive tools to manage health care practice."
        />
        <MetaTagsInput keywords={keywords} setKeywords={setKeywords} />
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

function UploadButton({ label }: { label: string }) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 bg-[#e0e0e0] cursor-not-allowed w-full"
    >
      <Upload size={16} />
      {label}
    </Button>
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

const MetaTagsInput: React.FC<{
  keywords: string[];

  setKeywords: (tags: string[]) => void;
}> = ({ keywords, setKeywords }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.key === " " || event.key === "Enter") &&
      inputValue.trim() !== ""
    ) {
      event.preventDefault();
      setKeywords([...keywords, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-gray-300 rounded p-2 flex flex-wrap gap-2">
      {keywords.map((tag, index) => (
        <div
          key={index}
          className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center space-x-1"
        >
          <span>{tag}</span>
          <button
            onClick={() => removeTag(index)}
            className="text-blue-600 hover:text-blue-800"
          >
            ×
          </button>
        </div>
      ))}
      <input
        type="text"
        className="flex-grow outline-none p-1"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
