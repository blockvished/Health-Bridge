import React from "react";
import Sidebar from "../_common/Sidebar";
import Footer from "../_common/Footer";
import Topbar from "../_common/Topbar";

const staffMembers = [
  {
    id: 1,
    name: "vi",
    email: "vivi",
    role: "huh",
    clinics: "All Clinics",
    initial: "V",
  },
  {
    id: 2,
    name: "Jatin Gupta",
    email: "Gjatin782@gmail.com",
    role: "ASM",
    clinics: "All Clinics",
    initial: "J",
  },
];

const StaffPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col">
        <Topbar />

        <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-4xl mx-auto w-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Staff</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow-md">
              + Add new staff
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-0">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-left p-3 font-medium">#</th>
                  <th className="text-left p-3 font-medium">Thumb</th>
                  <th className="text-left p-3 font-medium">Information</th>
                  <th className="text-left p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff, index) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-gray-50 transition border-b border-gray-200"
                  >
                    <td className="p-3 text-gray-700">{index + 1}</td>
                    <td className="p-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold text-lg">
                        {staff.initial}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-900">
                        {staff.name}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        {staff.clinics}
                      </div>
                      <div className="text-sm text-gray-500">{staff.email}</div>
                      <div className="text-sm text-gray-500">{staff.role}</div>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button className="p-1.5 border rounded-md bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center w-8 h-8">
                        ✏️
                      </button>
                      <button className="p-1.5 border rounded-md bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center w-8 h-8">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default StaffPage;
