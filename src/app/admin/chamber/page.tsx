import React from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";

const clinics = [
  {
    id: 1,
    thumb: "https://via.placeholder.com/100", // Replace with actual image URL
    name: "Digambar Healthcare Center",
    location: "Gorakhpur, U.P. India",
    appointmentLimit: 30,
    status: "Active",
  },
];

const ClinicList = () => {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Clinics</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          + Add New Clinic
        </button>
      </div>
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="p-3 text-left font-medium">#</th>
            <th className="p-3 text-left font-medium">Thumb</th>
            <th className="p-3 text-left font-medium">Information</th>
            <th className="p-3 text-left font-medium">Appointment Limit</th>
            <th className="p-3 text-left font-medium">Status</th>
            <th className="p-3 text-left font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map((clinic) => (
            <tr key={clinic.id} className="border-t hover:bg-gray-50">
              <td className="p-4 text-gray-700">{clinic.id}</td>
              <td className="p-4">
                <img
                  src={clinic.thumb}
                  alt={clinic.name}
                  className="w-20 h-14 object-cover rounded"
                />
              </td>
              <td className="p-4">
                <div className="font-semibold text-gray-800">{clinic.name}</div>
                <div className="text-sm text-gray-500">{clinic.location}</div>
              </td>
              <td className="p-4 text-gray-700">{clinic.appointmentLimit}</td>
              <td className="p-4">
                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full flex items-center">
                  <BsCheckCircle className="mr-1" /> Active
                </span>
              </td>
              <td className="p-4 flex gap-2">
                <button className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition">
                  <FiEdit />
                </button>
                <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
                  <FiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClinicList;
