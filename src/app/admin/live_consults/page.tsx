import React from "react";
import { FiSettings, FiEdit } from "react-icons/fi";
import { BsCameraVideo } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";

const consultations = [
  {
    id: 1,
    serialNo: 1,
    patientInfo: "(MR: #)\nPhone:",
    scheduleDate: "24 Mar 2025",
    scheduleTime: "09:00 AM-01:00 PM",
    consultationType: "Online",
    price: "$1000.00",
    paymentStatus: "Paid",
    onlineMeeting: "Start Meeting",
    prescription: "Not Created",
  },
  {
    id: 2,
    serialNo: 1,
    patientInfo: "Raj Kumar (MR: #28705)\nPhone: 9650561756\npatient@livedoctors.in",
    scheduleDate: "19 Mar 2025",
    scheduleTime: "09:00 AM-01:00 PM",
    consultationType: "Offline",
    price: "$1000.00",
    paymentStatus: "Pending",
    onlineMeeting: "Start Meeting",
    prescription: "Not Created",
  },
];

const ConsultationsPage = () => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-6xl mx-auto w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Consultations</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow-md flex items-center gap-2">
          <FiSettings /> Settings
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-0 text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="p-3 font-medium">#</th>
              <th className="p-3 font-medium">Serial No</th>
              <th className="p-3 font-medium">Patient Info</th>
              <th className="p-3 font-medium">Schedule Info</th>
              <th className="p-3 font-medium">Consultation Type</th>
              <th className="p-3 font-medium text-right">Price</th>
              <th className="p-3 font-medium">Payment Status</th>
              <th className="p-3 font-medium">Online Meeting</th>
              <th className="p-3 font-medium">Prescription</th>
              <th className="p-3 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation, index) => (
              <tr
                key={consultation.id}
                className="hover:bg-gray-50 transition border-b border-gray-200"
              >
                <td className="p-3 text-gray-700">{index + 1}</td>
                <td className="p-3 text-gray-700">{consultation.serialNo}</td>
                <td className="p-3 whitespace-pre-line">{consultation.patientInfo}</td>
                <td className="p-3">
                  <div className="text-blue-600 font-medium cursor-pointer">{consultation.scheduleDate}</div>
                  <div className="text-sm text-gray-500">{consultation.scheduleTime}</div>
                </td>
                <td className="p-3 text-gray-700">
                  <span className={`px-2 py-1 text-sm rounded-md ${consultation.consultationType === 'Online' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{consultation.consultationType}</span>
                </td>
                <td className="p-3 text-gray-700 text-right">
                  <span className="flex justify-end items-center gap-2">
                    <FaDollarSign className="text-green-500" /> {consultation.price}
                  </span>
                </td>
                <td className="p-3 text-gray-700">
                  <span className={`px-2 py-1 text-sm rounded-md ${consultation.paymentStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{consultation.paymentStatus}</span>
                </td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-green-100 text-green-600 rounded-md text-sm flex items-center gap-2">
                    <BsCameraVideo /> {consultation.onlineMeeting}
                  </button>
                </td>
                <td className="p-3">
                  <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-md text-sm">{consultation.prescription}</span>
                </td>
                <td className="p-3 flex justify-center gap-2">
                  <button className="p-1.5 border rounded-md bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center w-8 h-8">
                    <FiEdit />
                  </button>
                  <button className="p-1.5 border rounded-md bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center w-8 h-8">
                    <MdDelete />
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

export default ConsultationsPage;