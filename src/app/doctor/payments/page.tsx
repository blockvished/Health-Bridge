import React from "react";
import { FaFileInvoiceDollar } from "react-icons/fa";

const patientTransactions = [
  {
    id: 1,
    transactionId: "TRN-20240720-001",
    amount: "1000.00",
    paymentDate: "20 Jul 2024",
    paymentMethod: "UPI",
    status: "Completed",
  },
  // Add more transaction data here
  {
    id: 2,
    transactionId: "TRN-20240815-002",
    amount: "1000.00",
    paymentDate: "15 Aug 2024",
    paymentMethod: "UPI",
    status: "Completed",
  },
  {
    id: 3,
    transactionId: "TRN-20240901-003",
    amount: "1000.00",
    paymentDate: "01 Sep 2024",
    paymentMethod: "Bank Transfer",
    status: "Pending",
  },
];

const PatientTransactionsPage = () => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-5xl mx-auto w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Patient Transactions
        </h1>
        <div className="flex items-center space-x-2">
          <FaFileInvoiceDollar className="text-gray-500" />
          <span className="text-gray-600 text-sm">All Transactions</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-0">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left p-3 font-medium">#</th>
              <th className="text-left p-3 font-medium">Transaction ID</th>
              <th className="text-left p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium">Payment Date</th>
              <th className="text-left p-3 font-medium">Payment Method</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {patientTransactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 transition border-b border-gray-200"
              >
                <td className="p-3 text-gray-700">{index + 1}</td>
                <td className="p-3 font-semibold text-gray-900">
                  {transaction.transactionId}
                </td>
                <td className="p-3 font-medium text-gray-900">
                  ₹ {transaction.amount}
                </td>
                <td className="p-3 text-gray-700">{transaction.paymentDate}</td>
                <td className="p-3 text-gray-700">
                  {transaction.paymentMethod}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${
                      transaction.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {patientTransactions.length === 0 && (
        <div className="py-6 text-center text-gray-500">
          No transactions found for this patient.
        </div>
      )}
    </div>
  );
};

export default PatientTransactionsPage;
