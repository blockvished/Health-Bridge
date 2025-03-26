'use client';

import { useState } from 'react';
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';

export default function PayoutSettings() {
  const [payoutsEnabled, setPayoutsEnabled] = useState(true);
  const [minPayout, setMinPayout] = useState(1000);
  const [commissionRate, setCommissionRate] = useState(3);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [ibanEnabled, setIbanEnabled] = useState(false);
  const [swiftEnabled, setSwiftEnabled] = useState(true);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 w-full">
      <h2 className="text-xl font-semibold mb-4">Payout Settings</h2>

      <div className="flex items-center mb-4 cursor-pointer" onClick={() => setPayoutsEnabled(!payoutsEnabled)}>
        {payoutsEnabled ? <FiToggleRight size={24} className="text-blue-500" /> : <FiToggleLeft size={24} className="text-gray-400" />}
        <span className="ml-2 font-medium">Enable payouts</span>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Enable to activate payouts module and receive patient appointment payments to admin account.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium">Minimum payout amount</label>
        <div className="flex items-center border border-gray-300 rounded p-2">
          <span className="text-gray-500 mr-2">₹</span>
          <input
            type="number"
            value={minPayout}
            onChange={(e) => setMinPayout(Number(e.target.value))}
            className="w-full focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Commission Rate</label>
        <div className="flex items-center border border-gray-300 rounded p-2">
          <input
            type="number"
            value={commissionRate}
            onChange={(e) => setCommissionRate(Number(e.target.value))}
            className="w-full focus:outline-none"
            min={1}
            max={99}
          />
          <span className="text-gray-500 ml-2">%</span>
        </div>
        <p className="text-xs text-gray-500">Must be between 1-99</p>
      </div>

      <h3 className="text-lg font-medium mb-2">Enable / Disable Payout Methods</h3>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className={`flex items-center border border-gray-300 rounded p-2 cursor-pointer w-full sm:w-auto ${paypalEnabled ? 'bg-gray-100' : ''}`} onClick={() => setPaypalEnabled(!paypalEnabled)}>
          {paypalEnabled ? <FiToggleRight size={24} className="text-blue-500" /> : <FiToggleLeft size={24} className="text-gray-400" />}
          <span className="ml-2">Enable Paypal</span>
        </div>
        <div className={`flex items-center border border-gray-300 rounded p-2 cursor-pointer w-full sm:w-auto ${ibanEnabled ? 'bg-gray-100' : ''}`} onClick={() => setIbanEnabled(!ibanEnabled)}>
          {ibanEnabled ? <FiToggleRight size={24} className="text-blue-500" /> : <FiToggleLeft size={24} className="text-gray-400" />}
          <span className="ml-2">Enable IBAN</span>
        </div>
        <div className={`flex items-center border border-gray-300 rounded p-2 cursor-pointer w-full sm:w-auto ${swiftEnabled ? 'bg-gray-100' : ''}`} onClick={() => setSwiftEnabled(!swiftEnabled)}>
          {swiftEnabled ? <FiToggleRight size={24} className="text-blue-500" /> : <FiToggleLeft size={24} className="text-gray-400" />}
          <span className="ml-2">Enable Swift</span>
        </div>
      </div>

      <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Save Changes</button>
    </div>
  );
}
