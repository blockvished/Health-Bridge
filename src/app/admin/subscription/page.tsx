"use client";

import React, { useState } from "react";
import Sidebar from "../_common/Sidebar";
import Footer from "../_common/Footer";
import Topbar from "../_common/Topbar";

const Subscription: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState("Yearly");

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-4xl mx-auto w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Subscription</h1>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 text-sm rounded-lg shadow-md ${
                selectedPlan === "Monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedPlan("Monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-lg shadow-md ${
                selectedPlan === "Yearly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedPlan("Yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-white border rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Subscription Details</h2>
          <table className="w-full border-collapse border-0">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3 text-gray-700 font-medium">Subscription:</td>
                <td className="p-3 text-gray-900">Basic Plan</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 text-gray-700 font-medium">Price:</td>
                <td className="p-3 text-gray-900">₹3990.00</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 text-gray-700 font-medium">
                  Billing Cycle:
                </td>
                <td className="p-3 text-gray-900">Yearly</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 text-gray-700 font-medium">Last Billing:</td>
                <td className="p-3 text-gray-900">20 Jul 2024</td>
              </tr>
              <tr>
                <td className="p-3 text-gray-700 font-medium">Expire:</td>
                <td className="p-3 text-red-600 font-medium">
                  20 Jul 2025{" "}
                  <span className="text-gray-500">(129 Days left)</span>
                </td>
              </tr>
              <tr>
                <td className="p-3 text-gray-700 font-medium">
                  Payment Status:
                </td>
                <td className="p-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">
                    ✔ Verified
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
