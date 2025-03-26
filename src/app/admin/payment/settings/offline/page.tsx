"use client";
import React, { useState } from "react";

const AddOfflinePayment: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      selectedUser,
      selectedPlan,
      subscriptionType,
      paymentStatus,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Centered Form Container */}
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add Offline Payment</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select User */}
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            required
          >
            <option value="">Select User</option>
          </select>

          {/* Select Plan */}
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            required
          >
            <option value="">Select Plans</option>
          </select>

          {/* Subscription Type */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">
              Subscription Type
            </label>
            <div className="flex space-x-6">
              <label className="inline-flex items-center text-sm">
                <input
                  type="radio"
                  name="subscriptionType"
                  value="monthly"
                  checked={subscriptionType === "monthly"}
                  onChange={() => setSubscriptionType("monthly")}
                  className="form-radio mr-2"
                />
                Monthly
              </label>
              <label className="inline-flex items-center text-sm">
                <input
                  type="radio"
                  name="subscriptionType"
                  value="yearly"
                  checked={subscriptionType === "yearly"}
                  onChange={() => setSubscriptionType("yearly")}
                  className="form-radio mr-2"
                />
                Yearly
              </label>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">
              Payment Status
            </label>
            <div className="flex space-x-6">
              <label className="inline-flex items-center text-sm">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="verified"
                  checked={paymentStatus === "verified"}
                  onChange={() => setPaymentStatus("verified")}
                  className="form-radio mr-2"
                />
                Verified
              </label>
              <label className="inline-flex items-center text-sm">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="pending"
                  checked={paymentStatus === "pending"}
                  onChange={() => setPaymentStatus("pending")}
                  className="form-radio mr-2"
                />
                Pending
              </label>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            ✓ Add Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOfflinePayment;
