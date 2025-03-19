"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { FaPlus, FaTrash } from "react-icons/fa"; // Import icons

export default function Prescriptions() {
  const router = useRouter();
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Prescriptions</h3>
        <button
          className="bg-gray-600 text-white text-sm px-6 py-3 rounded-lg flex items-center hover:bg-gray-700 transition"
          onClick={() => router.push("/admin/prescription")} // Navigate on click
        >
          <FaPlus className="mr-2" />
          Create New Prescription
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
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
