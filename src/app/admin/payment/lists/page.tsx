"use client";

import React from "react";
import { FaEye } from "react-icons/fa";

const payments = [
  {
    id: 1,
    plan: "BASIC",
    billingCycle: "yearly",
    price: "₹3990.00",
    date: "20 Jul 2024",
  },
];

const PaymentsPage = () => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-4xl mx-auto w-full p-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Payments</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-0">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left p-3 font-medium">#</th>
              <th className="text-left p-3 font-medium">Plan</th>
              <th className="text-left p-3 font-medium">Billing Cycle</th>
              <th className="text-left p-3 font-medium">Price</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr
                key={payment.id}
                className="hover:bg-gray-50 transition border-b border-gray-200"
              >
                <td className="p-3 text-gray-700">{index + 1}</td>
                <td className="p-3 font-semibold text-gray-900">
                  {payment.plan}
                </td>
                <td className="p-3 text-gray-700">{payment.billingCycle}</td>
                <td className="p-3 font-medium text-gray-900">
                  {payment.price}
                </td>
                <td className="p-3 text-gray-700">{payment.date}</td>
                <td className="p-3">
                  <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition flex items-center justify-center gap-2">
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage;
