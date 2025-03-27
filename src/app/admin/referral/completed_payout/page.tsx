"use client"
// CompletedPayouts.tsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react"; // Import ChevronDown icon

const CompletedPayouts: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Completed</h2>
        <button onClick={toggleExpand} className="p-1">
          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      </div>
      {isExpanded && (
        <div className="mt-4 text-center text-gray-500">
          No data found!
        </div>
      )}
    </div>
  );
};

export default CompletedPayouts;