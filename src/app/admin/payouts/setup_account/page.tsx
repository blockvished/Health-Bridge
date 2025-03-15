import React from "react";

const PayoutForm = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Setup Payout Account</h2>
      <button className="bg-gray-700 text-white px-4 py-2 rounded mb-4">Account Details</button>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name *</label>
          <input type="text" className="w-full p-2 border rounded" defaultValue="TEST" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">State *</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="UP" />
          </div>
          <div>
            <label className="block text-sm font-medium">City *</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="TESDD" />
          </div>
          <div>
            <label className="block text-sm font-medium">Postcode *</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="112233" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium">Address *</label>
          <input type="text" className="w-full p-2 border rounded" defaultValue="vsdfs fsf af sfdsfd s" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Account Holder Name *</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="Ac Holder" />
          </div>
          <div>
            <label className="block text-sm font-medium">Bank Name *</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="SBI" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Country *</label>
            <select className="w-full p-2 border rounded">
              <option>India</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">City *</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="fgfgfg" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Account Number *</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="423424242432424324" />
          </div>
          <div>
            <label className="block text-sm font-medium">IFSC Code *</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="SBIIN000123456" />
          </div>
        </div>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
      </div>
    </div>
  );
};

export default PayoutForm;
