import React from "react";

const PayoutForm = () => {
  return (
    <div className="max-w-3xl bg-white p-6 shadow-md rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Setup Payout Account</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-800">Full Name *</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900" defaultValue="TEST" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">State *</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900" defaultValue="UP" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">City *</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900" defaultValue="TESDD" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Postcode *</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900" defaultValue="112233" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">Address *</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900" defaultValue="vsdfs fsf af sfdsfd s" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Account Holder Name *</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900" defaultValue="Ac Holder" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Bank Name *</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900" defaultValue="SBI" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Country *</label>
            <select className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900">
              <option>India</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">City *</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900" defaultValue="fgfgfg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Account Number *</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900" defaultValue="423424242432424324" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">IFSC Code *</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900" defaultValue="SBIIN000123456" />
          </div>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm shadow">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PayoutForm;
