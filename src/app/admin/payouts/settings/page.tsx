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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl border border-gray-300 w-full">
      <h2 className="text-2xl font-semibold mb-6">Payout Settings</h2>
      
      <div className="flex items-center justify-between mb-6 bg-gray-100 p-3 rounded-lg">
        <span className="font-medium">Enable payouts</span>
        <div onClick={() => setPayoutsEnabled(!payoutsEnabled)} className="cursor-pointer">
          {payoutsEnabled ? <FiToggleRight size={26} className="text-blue-500" /> : <FiToggleLeft size={26} className="text-gray-400" />}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Minimum payout amount</label>
        <div className="flex items-center border border-gray-300 rounded-lg p-3">
          <span className="text-gray-500">₹</span>
          <input
            type="number"
            value={minPayout}
            onChange={(e) => setMinPayout(Number(e.target.value))}
            className="w-full focus:outline-none ml-2 bg-transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Commission Rate</label>
        <div className="flex items-center border border-gray-300 rounded-lg p-3">
          <input
            type="number"
            value={commissionRate}
            onChange={(e) => setCommissionRate(Number(e.target.value))}
            className="w-full focus:outline-none bg-transparent"
            min={1}
            max={99}
          />
          <span className="text-gray-500 ml-2">%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Must be between 1-99</p>
      </div>

      <h3 className="text-lg font-medium mb-4">Enable / Disable Payout Methods</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[{ label: "Enable Paypal", enabled: paypalEnabled, setEnabled: setPaypalEnabled },
          { label: "Enable IBAN", enabled: ibanEnabled, setEnabled: setIbanEnabled },
          { label: "Enable Swift", enabled: swiftEnabled, setEnabled: setSwiftEnabled }].map((method, index) => (
          <div
            key={index}
            className={`flex items-center justify-between border border-gray-300 rounded-lg p-3 cursor-pointer ${method.enabled ? 'bg-blue-50' : 'bg-gray-100'}`}
            onClick={() => method.setEnabled(!method.enabled)}
          >
            <span>{method.label}</span>
            {method.enabled ? <FiToggleRight size={24} className="text-blue-500" /> : <FiToggleLeft size={24} className="text-gray-400" />}
          </div>
        ))}
      </div>
      
      <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">Save Changes</button>
    </div>
  );
}