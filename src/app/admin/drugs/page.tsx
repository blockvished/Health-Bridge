"use client";

import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing React Icons

const Drugs: React.FC = () => {
  const [drugs, setDrugs] = useState([
    { id: 1, name: "Avil", details: "Used for allergies and cold symptoms." },
    {
      id: 2,
      name: "Crocin",
      details: "Generic: Paracetamol\nBrand: Cipla\nParacetamol 350 mg",
    },
  ]);

  const handleDelete = (id: number) => {
    setDrugs(drugs.filter((drug) => drug.id !== id));
  };

  return (
    <div className="p-6">
      {/* Main Container */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-4xl mx-auto w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Drugs</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow-md">
            + Add new drug
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-0">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left p-3 font-medium">#</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Details</th>
                <th className="text-left p-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {drugs.map((drug, index) => (
                <tr
                  key={drug.id}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="p-3 text-gray-700">{index + 1}</td>
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">
                      {drug.name}
                    </div>
                  </td>
                  <td className="p-3 text-gray-700 whitespace-pre-line">
                    {drug.details}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="p-1.5 border rounded-md bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center w-8 h-8">
                      <FaEdit className="text-gray-600" />
                    </button>
                    <button
                      className="p-1.5 border rounded-md bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center w-8 h-8"
                      onClick={() => handleDelete(drug.id)}
                    >
                      <FaTrashAlt className="text-white" />
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

export default Drugs;
