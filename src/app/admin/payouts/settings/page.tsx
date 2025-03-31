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
    <div className="mx-auto p-4 bg-white shadow rounded-lg border border-gray-200 w-full md:max-w-3xl"> {/* Adjusted max-width */}
      <h2 className="text-xl font-semibold mb-4">Payout Settings</h2>

      <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-md">
        <span className="text-sm font-medium">Enable payouts</span>
        <div onClick={() => setPayoutsEnabled(!payoutsEnabled)} className="cursor-pointer">
          {payoutsEnabled ? <FiToggleRight size={20} className="text-blue-500" /> : <FiToggleLeft size={20} className="text-gray-400" />}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium mb-1">Minimum payout amount</label>
        <div className="flex items-center border border-gray-200 rounded-md p-2">
          <span className="text-gray-500 text-sm">₹</span>
          <input
            type="number"
            value={minPayout}
            onChange={(e) => setMinPayout(Number(e.target.value))}
            className="w-full focus:outline-none ml-2 bg-transparent text-sm"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium mb-1">Commission Rate</label>
        <div className="flex items-center border border-gray-200 rounded-md p-2">
          <input
            type="number"
            value={commissionRate}
            onChange={(e) => setCommissionRate(Number(e.target.value))}
            className="w-full focus:outline-none bg-transparent text-sm"
            min={1}
            max={99}
          />
          <span className="text-gray-500 ml-2 text-sm">%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Must be between 1-99</p>
      </div>

      <h3 className="text-lg font-medium mb-3">Payout Methods</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {[{ label: "Paypal", enabled: paypalEnabled, setEnabled: setPaypalEnabled },
          { label: "IBAN", enabled: ibanEnabled, setEnabled: setIbanEnabled },
          { label: "Swift", enabled: swiftEnabled, setEnabled: setSwiftEnabled }].map((method, index) => (
          <div
            key={index}
            className={`flex items-center justify-between border border-gray-200 rounded-md p-2 cursor-pointer text-sm ${method.enabled ? 'bg-blue-50' : 'bg-gray-50'}`}
            onClick={() => method.setEnabled(!method.enabled)}
          >
            <span>{method.label}</span>
            {method.enabled ? <FiToggleRight size={20} className="text-blue-500" /> : <FiToggleLeft size={20} className="text-gray-400" />}
          </div>
        ))}
      </div>

      <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors text-sm">Save Changes</button>
    </div>
  );
}