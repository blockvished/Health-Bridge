'use client';

import { useEffect, useState } from 'react';
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';

type PayoutSettingsType = {
  minimumPayoutAmount: number;
  commissionRate: number;
};

export default function PayoutSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [minPayout, setMinPayout] = useState(0);
  const [commissionRate, setCommissionRate] = useState(0);

  // Load existing payout settings on mount
  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/payout/payout-settings');
        if (res.ok) {
          const data: PayoutSettingsType = await res.json();
          setMinPayout(Number(data.minimumPayoutAmount));
          setCommissionRate(Number(data.commissionRate));
        } else if (res.status === 404) {
          setError('Payout settings do not exist. Please create them.');
        } else {
          setError('Failed to load payout settings');
        }
      } catch {
        setError('Failed to load payout settings');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/payout/payout-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minimumPayoutAmount: minPayout,
          commissionRate,
        }),
      });
      if (res.ok) {
        alert('Payout settings saved successfully');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save payout settings');
      }
    } catch {
      setError('Failed to save payout settings');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto p-4 bg-white shadow rounded-lg border border-gray-200 w-full md:max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Payout Settings</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
      >
        Save Changes
      </button>
    </div>
  );
}
