import React from "react";

const PayoutsPage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Earnings Card */}
        <div className="border border-blue-400 rounded-lg p-4 bg-white shadow-md">
          <h2 className="text-blue-500 font-bold text-lg">₹0</h2>
          <p className="text-gray-600 text-sm">Total earnings (after commission of 3%)</p>
        </div>

        {/* Withdraw Card */}
        <div className="border border-orange-400 rounded-lg p-4 bg-white shadow-md">
          <h2 className="text-orange-500 font-bold text-lg">₹0</h2>
          <p className="text-gray-600 text-sm">Total withdraw</p>
        </div>

        {/* Balance Card */}
        <div className="border border-green-400 rounded-lg p-4 bg-white shadow-md">
          <h2 className="text-green-500 font-bold text-lg">₹0.00</h2>
          <p className="text-gray-600 text-sm">Balance</p>
        </div>
      </div>

      {/* Minimum Payout Notice */}
      <p className="text-gray-500 text-sm text-right">
        © Minimum payout amount ₹1000
      </p>

      {/* Payouts Table */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h3 className="font-semibold text-lg text-gray-700">Payouts</h3>
        <div className="border-t mt-2">
          <p className="text-center py-4 text-gray-500">No data found!</p>
        </div>
      </div>
    </div>
  );
};

export default PayoutsPage;
