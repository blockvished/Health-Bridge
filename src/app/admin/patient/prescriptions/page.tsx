"use client";
import { FaEye } from "react-icons/fa";

const prescriptions = [
  {
    serialNo: 1,
    mrNo: "#14590",
    doctor: "Dr. Dheeraj Singh",
    phone: "8356860659",
    email: "jcmwishael@gmail.com",
    created: "25 Mar 2025",
  },
];

export default function PrescriptionsList() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Prescriptions</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3">#</th>
                <th className="p-3">Mr. No</th>
                <th className="p-3">Doctor Info</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Created</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {prescriptions.map((prescription) => (
                <tr
                  key={prescription.serialNo}
                  className="border-b last:border-none text-gray-700"
                >
                  <td className="p-3">{prescription.serialNo}</td>
                  <td className="p-3 font-medium text-blue-600">
                    {prescription.mrNo}
                  </td>
                  <td className="p-3 font-semibold">{prescription.doctor}</td>
                  <td className="p-3">{prescription.phone}</td>
                  <td className="p-3">{prescription.email}</td>
                  <td className="p-3">{prescription.created}</td>
                  <td className="p-3">
                    <button className="p-2 bg-blue-600 text-white rounded-md">
                      <FaEye />
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
}
