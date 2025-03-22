"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function Prescriptions() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Prescriptions
        </h3>
        <button
          className="bg-gray-400 text-white text-xs px-2 py-1 sm:text-sm sm:px-4 sm:py-2 rounded-md flex items-center hover:bg-gray-500 transition"
          onClick={() => router.push("/admin/prescription")}
        >
          <FaPlus className="mr-1 sm:mr-2" />
          Create New Prescription
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto min-w-[600px]">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="py-3 px-4 text-left border-b">#</th>
              <th className="py-3 px-4 text-left border-b">Mr. No</th>
              <th className="py-3 px-4 text-left border-b">Patient Name</th>
              <th className="py-3 px-4 text-left border-b">Phone</th>
              <th className="py-3 px-4 text-left border-b">Email</th>
              <th className="py-3 px-4 text-left border-b">Created</th>
              <th className="py-3 px-4 text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50 transition-all">
              <td className="py-3 px-4 text-gray-700">1</td>
              <td className="py-3 px-4 text-gray-700">12345</td>
              <td className="py-3 px-4 text-gray-700">John Doe</td>
              <td className="py-3 px-4 text-gray-700">(123) 456-7890</td>
              <td className="py-3 px-4 text-gray-700">john.doe@example.com</td>
              <td className="py-3 px-4 text-gray-700">2024-03-17 12:00 PM</td>
              <td className="py-3 px-4 text-gray-700">
                <button className="text-red-600 hover:text-red-800 focus:outline-none">
                  <FaTrash />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
