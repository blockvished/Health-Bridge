"use client";

import React, { useState } from "react";

const Subscription: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState("Yearly");

  return (
    <div className="flex flex-col items-center md:items-start p-4 space-y-4">
      {/* Toggle Buttons */}
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 text-sm rounded-lg border transition-all ${
            selectedPlan === "Monthly"
              ? "bg-blue-600 text-white"
              : "border-blue-600 text-blue-600"
          }`}
          onClick={() => setSelectedPlan("Monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 text-sm rounded-lg border transition-all ${
            selectedPlan === "Yearly"
              ? "bg-blue-600 text-white"
              : "border-blue-600 text-blue-600"
          }`}
          onClick={() => setSelectedPlan("Yearly")}
        >
          Yearly
        </button>
      </div>

      {/* Subscription Card */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm border border-gray-200 mx-auto">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-3">Subscription</h2>
          <div className="border-t border-gray-300 pt-3 space-y-1">
            <p className="text-gray-700 font-medium">
              Subscription: <span className="font-normal">Basic Plan</span>
            </p>
            <p className="text-gray-700 font-medium">
              Price: <span className="font-normal">₹3990.00</span>
            </p>
            <p className="text-gray-700 font-medium">
              Billing Cycle: <span className="font-normal">Yearly</span>
            </p>
            <p className="text-gray-700 font-medium">
              Last Billing: <span className="font-normal">20 Jul 2024</span>
            </p>
            <p className="text-gray-700 font-medium">
              Expire:{" "}
              <span className="text-red-600">20 Jul 2025 (125 Days left)</span>
            </p>
          </div>
        </div>
        <div className="bg-green-100 border-t border-gray-300 text-green-700 flex items-center justify-between w-full rounded-b-lg">
          <span className="p-3">Payment Status:</span>
          <span className="font-semibold p-3">✔ Verified</span>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
