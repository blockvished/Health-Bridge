"use client";
import React, { useEffect, useState } from "react";

const PayoutsPage = () => {
  const [minimumPayout, setMinimumPayout] = useState(0);
  const [commissionRate, setCommissionRate] = useState(0);
  const [loading, setLoading] = useState(true);

  const [balanceInfo, setBalanceInfo] = useState({
    balance: 0,
    totalWithdraw: 0,
    totalEarnings: 0,
  });

  const [showForm, setShowForm] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  useEffect(() => {
    const fetchPayoutSettings = async () => {
      try {
        const [settingsRes, balanceRes] = await Promise.all([
          fetch("/api/admin/payout/payout-settings"),
          fetch("/api/doctor/payout/balance"),
        ]);

        if (!settingsRes.ok || !balanceRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const settingsData = await settingsRes.json();
        const balanceData = await balanceRes.json();

        setMinimumPayout(settingsData.minimumPayoutAmount);
        setCommissionRate(settingsData.commissionRate);
        setBalanceInfo({
          balance: parseFloat(balanceData.balance),
          totalWithdraw: parseFloat(balanceData.totalWithdraw),
          totalEarnings: parseFloat(balanceData.totalEarnings),
        });
      } catch (error) {
        console.error("Error fetching payout data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutSettings();
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!requestAmount || parseFloat(requestAmount) < minimumPayout) {
      alert(`Amount must be at least ₹${minimumPayout}`);
      return;
    }

    try {
      const res = await fetch("/api/doctor/payout/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(requestAmount),
          method: paymentMethod,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      alert("Payout request submitted!");
      setRequestAmount("");
      setPaymentMethod("UPI");
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Failed to submit payout request.");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border border-blue-400 rounded-lg p-4 bg-white shadow-md">
          <h2 className="text-blue-500 font-bold text-lg">
            ₹{balanceInfo.totalEarnings}
          </h2>
          <p className="text-gray-600 text-sm">Total earnings</p>
        </div>
        <div className="border border-orange-400 rounded-lg p-4 bg-white shadow-md">
          <h2 className="text-orange-500 font-bold text-lg">
            ₹{balanceInfo.totalWithdraw}
          </h2>
          <p className="text-gray-600 text-sm">Total withdrawn</p>
        </div>
        <div className="border border-green-400 rounded-lg p-4 bg-white shadow-md">
          <h2 className="text-green-500 font-bold text-lg">
            ₹{balanceInfo.balance.toFixed(2)}
          </h2>
          <p className="text-gray-600 text-sm">Balance</p>
        </div>
      </div>

      {/* Minimum Payout Notice */}
      <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500">
        <p>
          {loading
            ? "Loading payout settings..."
            : `Minimum payout amount: ₹${minimumPayout}`}
        </p>
        {!loading && commissionRate !== null && (
          <p>Commission rate: {commissionRate}%</p>
        )}
      </div>

      {/* Request Payout Form */}
      {showForm && (
        <form
          onSubmit={handleRequestSubmit}
          className="bg-white p-6 mt-4 rounded-lg shadow-md"
        >
          <h4 className="text-gray-700 font-semibold text-md mb-4">
            Request a Payout
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="UPI">UPI</option>
                <option value="NEFT">NEFT</option>
                <option value="IMPS">IMPS</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Submit Request
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Payouts Table */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-gray-700">Payouts</h3>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
          >
            {showForm ? "Cancel" : "Request Payout"}
          </button>
        </div>
        <div className="border-t mt-2">
          <p className="text-center py-4 text-gray-500">No data found!</p>
        </div>
      </div>
    </div>
  );
};

export default PayoutsPage;
