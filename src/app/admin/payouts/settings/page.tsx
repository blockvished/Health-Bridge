'use client';

import { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PayoutSettingsType = {
  minimumPayoutAmount: number;
  commissionRate: number;
};

export default function PayoutSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minPayout, setMinPayout] = useState(0);
  const [commissionRate, setCommissionRate] = useState(0);
  const toastShown = useRef(false);

  // Load existing payout settings on mount
  useEffect(() => {
    console.log('Component mounted/remounted');
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

    return () => {
      console.log('Component unmounting');
    };
  }, []);

  async function handleSubmit(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();
    e?.stopPropagation();
    
    console.log('Submit clicked - before API call');
    setLoading(true);
    setError(null);
    toastShown.current = false;
    
    try {
      const res = await fetch('/api/admin/payout/payout-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minimumPayoutAmount: minPayout,
          commissionRate,
        }),
      });
      console.log('API response:', res.status);
      
      if (res.ok) {
        console.log('Success - showing toast');
        toastShown.current = true;
        
        // Try showing toast immediately
        toast.success('Payout settings saved successfully!', {
          toastId: 'payout-success',
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Also try with a delay in case of timing issues
        // setTimeout(() => {
        //   if (toastShown.current) {
        //     toast.success('Settings saved successfully!', {
        //       toastId: 'payout-success-delayed',
        //       position: "top-right",
        //       autoClose: 5000,
        //     });
        //   }
        // }, 100);
        
        setTimeout(() => {
          setLoading(false);
        }, 200);
        
      } else {
        const data = await res.json();
        const errorMessage = data.error || 'Failed to save payout settings';
        console.log('Error - showing toast:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = 'Failed to save payout settings';
      console.log('Catch error - showing toast:', error);
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <div>Loading...</div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ 
            zIndex: 9999999,
            top: '20px',
            right: '20px'
          }}
          toastStyle={{ 
            zIndex: 9999999,
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          limit={3}
        />
      </>
    );
  }

  return (
    <>
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
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ 
          zIndex: 9999999,
          top: '20px',
          right: '20px'
        }}
        toastStyle={{ 
          zIndex: 9999999,
          fontSize: '14px',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        limit={3}
      />
    </>
  );
}