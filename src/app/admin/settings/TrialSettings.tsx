"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { live_doctors_icon } from "../_common/global_variables";

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

function UploadButton({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 bg-[#e8e8e8] hover:bg-[#d8d8d8] rounded-lg py-3 px-4 text-xs text-gray-700 border-none w-full whitespace-nowrap">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="flex-shrink-0"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <span className="flex-shrink-0">{label}</span>
    </button>
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