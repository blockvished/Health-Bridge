"use client";

import React, { useState } from "react";
import { FaPen, FaTrash, FaPlus, FaCheck, FaArrowLeft } from "react-icons/fa";

// 🔹 DepartmentForm Component
const DepartmentForm: React.FC<{ 
  onSave: (name: string) => void; 
  onCancel: () => void; 
}> = ({ onSave, onCancel }) => {
  const [name, setName] = useState("");

  return (
    <div className="mt-6">
      <h2 className="text-md font-semibold text-gray-800 mb-4">Add New Department</h2>
      <label className="block text-sm font-medium text-gray-600 mb-1">Department Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter department name"
      />
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => onSave(name)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FaCheck /> Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg shadow hover:bg-gray-300 transition"
        >
          <FaArrowLeft /> Back
        </button>
      </div>
    </div>
  );
};

// 🔹 Main Department Page Component
const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "HR" },
    { id: 2, name: "IT" },
    { id: 3, name: "Finance" },
  ]);
  const [showForm, setShowForm] = useState(false);

  const addDepartment = (name: string) => {
    if (name.trim() === "") return;
    setDepartments([...departments, { id: departments.length + 1, name }]);
    setShowForm(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">Departments</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            <FaPlus className="text-gray-500" /> Add New Department
          </button>
        )}
      </div>

      {/* Add New Department Form */}
      {showForm ? (
        <DepartmentForm onSave={addDepartment} onCancel={() => setShowForm(false)} />
      ) : (
        /* Table */
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
                    <button className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                      <FaPen className="text-gray-600" />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DepartmentPage;
