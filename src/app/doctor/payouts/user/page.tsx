"use client";
import React, { useEffect, useState } from "react";

// Type definitions
interface PayoutRequest {
  id: string;
  amount: number;
  balanceAtRequest?: number;
  requestedMethod: string;
  status: string;
  createdAt: string;
}

interface BalanceInfo {
  balance: number;
  totalWithdraw: number;
  totalEarnings: number;
}

interface PayoutSettings {
  minimumPayoutAmount: number;
  commissionRate: number;
}

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableComponentProps {
  children: React.ReactNode;
  className?: string;
}

// Table components
const Table: React.FC<TableProps> = ({ children, className = "" }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full border-collapse">{children}</table>
  </div>
);

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody>{children}</tbody>
);

const TableRow: React.FC<TableComponentProps> = ({ children, className = "" }) => (
  <tr className={`border-b border-gray-200 hover:bg-gray-50 ${className}`}>
    {children}
  </tr>
);

const TableHead: React.FC<TableComponentProps> = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableCell: React.FC<TableComponentProps> = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm text-gray-900 ${className}`}>
    {children}
  </td>
);

const PayoutsPage: React.FC = () => {
  const [minimumPayout, setMinimumPayout] = useState<number>(0);
  const [commissionRate, setCommissionRate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState<boolean>(true);

  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo>({
    balance: 0,
    totalWithdraw: 0,
    totalEarnings: 0,
  });

  const [showForm, setShowForm] = useState<boolean>(false);
  const [requestAmount, setRequestAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");

  useEffect(() => {
    const fetchPayoutSettings = async (): Promise<void> => {
      try {
        const [settingsRes, balanceRes] = await Promise.all([
          fetch("/api/admin/payout/payout-settings"),
          fetch("/api/doctor/payout/balance"),
        ]);

        

        const settingsData: PayoutSettings = await settingsRes.json();
        const balanceData: BalanceInfo = await balanceRes.json();

        setMinimumPayout(settingsData.minimumPayoutAmount);
        setCommissionRate(settingsData.commissionRate);
        setBalanceInfo({
          balance: parseFloat(balanceData.balance.toString()),
          totalWithdraw: parseFloat(balanceData.totalWithdraw.toString()),
          totalEarnings: parseFloat(balanceData.totalEarnings.toString()),
        });
      } catch (error) {
        console.error("Error fetching payout data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutSettings();
  }, []);

  useEffect(() => {
    const fetchPayoutRequests = async (): Promise<void> => {
      try {
        setRequestsLoading(true);
        const response = await fetch("/api/doctor/payout/request");
        
        if (!response.ok) {
          throw new Error("Failed to fetch payout requests");
        }

        const data: { payoutRequests: PayoutRequest[] } = await response.json();
        setPayoutRequests(data.payoutRequests || []);
      } catch (error) {
        console.error("Error fetching payout requests:", error);
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchPayoutRequests();
  }, []);

  const handleRequestSubmit = async (): Promise<void> => {
    if (!requestAmount || parseFloat(requestAmount) < minimumPayout) {
      alert(`Amount must be at least ₹${minimumPayout}`);
      return;
    }

    if (parseFloat(requestAmount) > balanceInfo.balance) {
      alert(`Amount cannot exceed your available balance of ₹${balanceInfo.balance.toFixed(2)}`);
      return;
    }

    try {
      const res = await fetch("/api/doctor/payout/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(requestAmount),
          selectedMethod: paymentMethod,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      
      alert("Payout request submitted!");
      setRequestAmount("");
      setPaymentMethod("UPI");
      setShowForm(false);
      
      // Refresh the payout requests list
      const refreshRes = await fetch("/api/doctor/payout/request");
      if (refreshRes.ok) {
        const refreshData: { payoutRequests: PayoutRequest[] } = await refreshRes.json();
        setPayoutRequests(refreshData.payoutRequests || []);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit payout request.");
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRequestAmount(e.target.value);
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border border-blue-400 rounded-lg p-4 bg-white shadow-md">
          <h2 className="text-blue-500 font-bold text-lg">
            ₹{balanceInfo.totalEarnings.toLocaleString()}
          </h2>
          <p className="text-gray-600 text-sm">Total earnings</p>
        </div>
        <div className="border border-orange-400 rounded-lg p-4 bg-white shadow-md">
          <h2 className="text-orange-500 font-bold text-lg">
            ₹{balanceInfo.totalWithdraw.toLocaleString()}
          </h2>
          <p className="text-gray-600 text-sm">Total withdrawn</p>
        </div>
        <div className="border border-green-400 rounded-lg p-4 bg-white shadow-md">
          <h2 className="text-green-500 font-bold text-lg">
            ₹{balanceInfo.balance.toFixed(2)}
          </h2>
          <p className="text-gray-600 text-sm">Available Balance</p>
        </div>
      </div>

      {/* Minimum Payout Notice */}
      <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 mb-4">
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
        <div className="bg-white p-6 mb-6 rounded-lg shadow-md">
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
                onChange={handleAmountChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                max={balanceInfo.balance}
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: ₹{balanceInfo.balance.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="UPI">UPI</option>
                <option value="NEFT">NEFT</option>
                <option value="IMPS">IMPS</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleRequestSubmit}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!requestAmount || parseFloat(requestAmount) > balanceInfo.balance || parseFloat(requestAmount) < minimumPayout}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payouts Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg text-gray-700">
            Payout Requests History
          </h3>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            disabled={balanceInfo.balance < minimumPayout}
          >
            {showForm ? "Cancel" : "Request Payout"}
          </button>
        </div>

        {requestsLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading payout requests...</p>
          </div>
        ) : payoutRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No payout requests found.</p>
            <p className="text-sm mt-1">{`Click "Request Payout" to create your first request.`}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance at Request</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <span className="font-mono text-sm">#{request.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      ₹{parseFloat(request.amount.toString()).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    ₹{parseFloat((request.balanceAtRequest || 0).toString()).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                      {request.requestedMethod}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium capitalize ${getStatusColor(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(request.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Help Text */}
      {balanceInfo.balance < minimumPayout && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> You need a minimum balance of ₹{minimumPayout} to request a payout. 
            Your current balance is ₹{balanceInfo.balance.toFixed(2)}.
          </p>
        </div>
      )}
    </div>
  );
};

export default PayoutsPage;