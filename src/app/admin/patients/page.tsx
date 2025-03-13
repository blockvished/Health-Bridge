import React from "react";
import Sidebar from "../_common/Sidebar";
import Footer from "../_common/Footer";
import Topbar from "../_common/Topbar";

const patients = [
  {
    id: 1,
    mrNo: "45826",
    name: "Patient",
    age: "0",
    phone: "924062456",
    address: "",
  },
  {
    id: 2,
    mrNo: "28705",
    name: "Raj Kumar",
    age: "35",
    phone: "9650561756",
    address: "",
  },
];

const Patients: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col">
        <Topbar />

        <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-5xl mx-auto w-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              All Patients
            </h1>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 text-sm rounded-lg shadow-sm">
              + Add new Patients
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-0">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="p-3 font-medium text-left">#</th>
                  <th className="p-3 font-medium text-left">Mr. No</th>
                  <th className="p-3 font-medium text-left">Name</th>
                  <th className="p-3 font-medium text-left">Age</th>
                  <th className="p-3 font-medium text-left">Phone</th>
                  <th className="p-3 font-medium text-left">Address</th>
                  <th className="p-3 font-medium text-left">Prescriptions</th>
                  <th className="p-3 font-medium text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr
                    key={patient.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-gray-700">{index + 1}</td>
                    <td className="p-3 text-gray-700">{patient.mrNo}</td>
                    <td className="p-3 text-gray-700">{patient.name}</td>
                    <td className="p-3 text-gray-700">{patient.age}</td>
                    <td className="p-3 text-gray-700">{patient.phone}</td>
                    <td className="p-3 text-gray-700">
                      {patient.address || "-"}
                    </td>
                    <td className="p-3">
                      <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                        👁️ View
                      </button>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button className="p-2 border rounded-md bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center w-8 h-8">
                        ✏️
                      </button>
                      <button className="p-2 border rounded-md bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center w-8 h-8">
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

export default Patients;
