"use client";

import React, { useState } from "react";
import { FaPen, FaTrash, FaPlus, FaCheck } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const DepartmentForm: React.FC<{ 
  onSave: (name: string) => void; 
  onCancel: () => void; 
}> = ({ onSave, onCancel }) => {
  const [name, setName] = useState("");

  return (
    <div className="w-full bg-white p-6 mx-auto">
      {/* Header with Back Button */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Add New Department</h2>
      </div>

      {/* Input Field */}
      <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter department name"
      />

      {/* Buttons */}
      <div className="mt-4 flex justify-start">
        <button
          onClick={() => onSave(name)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          <FaCheck /> Save
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
    <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-lg sm:max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-row justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Departments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 mt-2 sm:mt-0 rounded-lg shadow-sm hover:bg-gray-200 transition"
        >
          {showForm ? <IoArrowBack className="text-gray-500" /> : <FaPlus className="text-gray-500" />}
          {showForm ? "Back" : "Add New"}
        </button>
      </div>

      {/* Add New Department Form */}
      {showForm ? (
        <DepartmentForm onSave={addDepartment} onCancel={() => setShowForm(false)} />
      ) : (
        // Table
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
