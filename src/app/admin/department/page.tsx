"use client";

import React from "react";
import Sidebar from "../_common/Sidebar";
import Topbar from "../_common/Topbar";
import Footer from "../_common/Footer";

const DepartmentPage: React.FC = () => {
  const departments = [
    { id: 1, name: "HR" },
    { id: 2, name: "IT" },
    { id: 3, name: "Finance" },
  ];
  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Departments</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md">
            + Add New Department
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-gray-700 font-medium">#</th>
                <th className="p-3 text-left text-gray-700 font-medium">
                  Name
                </th>
                <th className="p-3 text-left text-gray-700 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3 text-gray-900">{dept.id}</td>
                  <td className="p-3 text-gray-900">{dept.name}</td>
                  <td className="p-3 flex gap-2">
                    <button className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                      ✏️
                    </button>
                    <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default DepartmentPage;
