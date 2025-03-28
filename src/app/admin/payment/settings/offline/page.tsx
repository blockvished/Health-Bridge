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
    <div className="flex  p-4"> {/* Added padding for mobile */}
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add Offline Payment</h2>

        <form onSubmit={handleSubmit} className="space-y-4"> {/* Reduced space-y for mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
              required
            >
              <option value="">Select User</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Plan</label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
              required
            >
              <option value="">Select Plans</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Type</label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"> {/* Responsive radio layout */}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"> {/* Responsive radio layout */}
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

          <button
            type="submit"
            className="mt-4 w-full sm:w-auto px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            ✓ Add Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOfflinePayment;