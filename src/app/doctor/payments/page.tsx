"use client"

import React, { useState, useEffect } from "react";
import { FaFileInvoiceDollar, FaSync } from "react-icons/fa";

interface Transaction {
  id: string;
  patientName: string;
  patientId: string;
  transactionId: string;
  orderId: string;
  amount: number;
  paymentMode: string;
  timestamp: string;
  status: 'COMPLETED' | 'FAILED';
}

interface ApiResponse {
  Patients: Transaction[];
}

const PatientTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/doctor/patients/transactions');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      setTransactions(data.Patients || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Transaction['status']): string => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const refreshData = (): void => {
    fetchTransactions();
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-7xl mx-auto w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaFileInvoiceDollar className="text-blue-600 text-2xl" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Patient Transactions
          </h1>
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <FaSync className={`${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="text-red-600 font-medium">Error loading transactions:</div>
            <div className="text-red-700">{error}</div>
          </div>
          <button
            onClick={refreshData}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-sm font-medium">Total Transactions</div>
          <div className="text-2xl font-bold text-blue-800">{transactions.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 text-sm font-medium">Completed</div>
          <div className="text-2xl font-bold text-green-800">
            {transactions.filter(t => t.status === 'COMPLETED').length}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-purple-600 text-sm font-medium">Total Amount</div>
          <div className="text-2xl font-bold text-purple-800">
            ₹{transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left p-4 font-medium border-b">#</th>
                <th className="text-left p-4 font-medium border-b">Patient Name</th>
                <th className="text-left p-4 font-medium border-b">Patient ID</th>
                <th className="text-left p-4 font-medium border-b">Transaction ID</th>
                <th className="text-left p-4 font-medium border-b">Order ID</th>
                <th className="text-left p-4 font-medium border-b">Amount</th>
                <th className="text-left p-4 font-medium border-b">Payment Mode</th>
                <th className="text-left p-4 font-medium border-b">Date & Time</th>
                <th className="text-left p-4 font-medium border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <td className="p-4 text-gray-700 font-medium">{index + 1}</td>
                  <td className="p-4 font-semibold text-gray-900">
                    {transaction.patientName}
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {transaction.patientId}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 font-mono">
                    {transaction.transactionId}
                  </td>
                  <td className="p-4 text-gray-600 font-mono text-xs">
                    {transaction.orderId}
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {transaction.paymentMode.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 text-sm">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {transactions.length === 0 && !loading && (
        <div className="py-12 text-center text-gray-500">
          <FaFileInvoiceDollar className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-lg">No transactions found</p>
          <p className="text-sm">Patient transactions will appear here once available.</p>
        </div>
      )}
    </div>
  );
};

export default PatientTransactionsPage;