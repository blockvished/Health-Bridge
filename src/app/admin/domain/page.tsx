"use client";

import React from "react";
import { FaCog, FaPlus, FaEdit } from "react-icons/fa";

const domains = [
  {
    id: 1,
    currentDomain: "example.com",
    customDomain: "custom.com",
    date: "2025-03-15",
    status: "Active",
  },
];

const DomainTable = () => {
  return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">Domain</h2>
          <div className="flex gap-1.5">
            <button className="bg-red-500 text-white px-2.5 py-1 rounded flex items-center gap-1 text-sm">
              <FaCog className="text-xs" /> DNS Settings
            </button>
            <button className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded flex items-center gap-1 text-sm">
              <FaPlus className="text-xs" /> Create New
            </button>
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b border-gray-300">
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Current Domain</th>
                <th className="p-2 text-left">Custom Domain</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((domain, index) => (
                <tr key={domain.id} className="border-t border-gray-300">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{domain.currentDomain}</td>
                  <td className="p-2">{domain.customDomain}</td>
                  <td className="p-2">{domain.date}</td>
                  <td className={`p-2 ${domain.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                    {domain.status}
                  </td>
                  <td className="p-2">
                    <button className="bg-blue-500 text-white px-3 py-1.5 rounded flex items-center gap-2 text-sm">
                      <FaEdit /> Manage
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

export default DomainTable;
