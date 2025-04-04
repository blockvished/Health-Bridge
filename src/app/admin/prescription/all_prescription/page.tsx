"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";

// Sample data for prescriptions
const initialPrescriptions = [
  {
    id: 1,
    mrNo: "12345",
    patientName: "John Doe",
    phone: "(123) 456-7890",
    email: "john.doe@example.com",
    created: "2024-03-17 12:00 PM",
  },
  {
    id: 2,
    mrNo: "67890",
    patientName: "Jane Smith",
    phone: "(987) 654-3210",
    email: "jane.smith@example.com",
    created: "2024-03-18 02:30 PM",
  },
  {
    id: 3,
    mrNo: "13579",
    patientName: "Alice Johnson",
    phone: "(111) 222-3333",
    email: "alice.johnson@example.com",
    created: "2024-03-19 09:45 AM",
  },
  // Add more prescriptions as needed
];

export default function Prescriptions() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = React.useState(initialPrescriptions);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      setPrescriptions((prevPrescriptions) =>
        prevPrescriptions.filter((prescription) => prescription.id !== id)
      );
      alert(`Prescription with ID ${id} deleted.`);
    }
  };

  const handleDownload = (id: number) => {
    console.log(`Downloading prescription with ID: ${id}`);
    alert(`Downloading prescription with ID: ${id}`);
    // ... your download logic here
  };

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
            {prescriptions.map((prescription) => (
              <tr
                key={prescription.id}
                className="hover:bg-gray-50 transition-all"
              >
                <td className="py-3 px-4 text-gray-700">{prescription.id}</td>
                <td className="py-3 px-4 text-gray-700">{prescription.mrNo}</td>
                <td className="py-3 px-4 text-gray-700">
                  {prescription.patientName}
                </td>
                <td className="py-3 px-4 text-gray-700">{prescription.phone}</td>
                <td className="py-3 px-4 text-gray-700">{prescription.email}</td>
                <td className="py-3 px-4 text-gray-700">
                  {prescription.created}
                </td>
                <td className="py-3 px-4 text-gray-700 flex space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                    onClick={() => handleDownload(prescription.id)}
                  >
                    <FaDownload />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                    onClick={() => handleDelete(prescription.id)}
                  >
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
}