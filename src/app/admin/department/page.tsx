"use client";

import React from "react";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";

const DepartmentPage: React.FC = () => {
  const departments = [
    { id: 1, name: "HR" },
    { id: 2, name: "IT" },
    { id: 3, name: "Finance" },
  ];
  return (

      <div className="bg-white shadow rounded-lg p-6 w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-800">Departments</h1>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition">
            <FaPlus className="text-gray-500" /> Add New Department
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-gray-600 font-medium">#</th>
                <th className="p-3 text-left text-gray-600 font-medium">Name</th>
                <th className="p-3 text-left text-gray-600 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-900">{dept.id}</td>
                  <td className="p-3 text-gray-900">{dept.name}</td>
                  <td className="p-3 flex gap-2">
                    <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition">
                      <FaPen className="text-gray-600" />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition">
                      <FaTrash />
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
export default DepartmentPage;