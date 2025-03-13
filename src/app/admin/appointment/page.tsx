"use client";

import React, { useState } from "react";
import Sidebar from "../_common/Sidebar";
import Footer from "../_common/Footer";
import Topbar from "../_common/Topbar";

const appointmentsData = [
  {
    id: 1,
    serialNo: "1",
    patient: { name: "", mrNo: "", phone: "", email: "" },
    scheduleDate: "24 Mar 2025",
    scheduleTime: "09:00 AM - 01:00 PM",
    type: "Online",
  },
  {
    id: 2,
    serialNo: "1",
    patient: { name: "Raj Kumar", mrNo: "28705", phone: "9650561756", email: "patient@livedoctors.in" },
    scheduleDate: "19 Mar 2025",
    scheduleTime: "09:00 AM - 01:00 PM",
    type: "Offline",
  },
  {
    id: 3,
    serialNo: "1",
    patient: { name: "Patient", mrNo: "45826", phone: "924062456", email: "patient@gmail.com" },
    scheduleDate: "18 Mar 2025",
    scheduleTime: "09:00 AM - 01:00 PM",
    type: "Offline",
  },
  {
    id: 4,
    serialNo: "1",
    patient: { name: "Raj Kumar", mrNo: "28705", phone: "9650561756", email: "patient@livedoctors.in" },
    scheduleDate: "22 Jul 2024",
    scheduleTime: "09:00 AM - 01:00 PM",
    type: "Offline",
  },
];

const Appointments = () => {
  const [appointments, setAppointments] = useState(appointmentsData);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col">
        <Topbar />

        <div className="flex max-w-6xl mx-auto gap-6 p-6">
          {/* Left: Add Appointment Form */}
          <div className="bg-white shadow-md rounded-xl p-6 w-1/3">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Appointment</h2>

            <label className="text-sm text-gray-600">Date</label>
            <input type="date" className="w-full p-2 border rounded-md mt-1 mb-3" />

            <label className="text-sm text-gray-600">Appointment Type</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2">
                <input type="radio" name="appointmentType" value="Online" className="accent-blue-500" />
                Online
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="appointmentType" value="Offline" className="accent-blue-500" />
                Offline
              </label>
            </div>

            <label className="text-sm text-gray-600">Patient</label>
            <select className="w-full p-2 border rounded-md mt-1 mb-4">
              <option>Select</option>
              {appointments.map((apt) => (
                <option key={apt.id} value={apt.patient.name}>
                  {apt.patient.name} ({apt.patient.mrNo})
                </option>
              ))}
            </select>

            <button className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600">
              + Add Serial
            </button>
          </div>

          {/* Right: Appointments Table */}
          <div className="bg-white shadow-md rounded-xl p-6 w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Appointments</h2>
              <button className="text-gray-600 text-sm border px-3 py-1 rounded-md">📅 List by date</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-0">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="p-3 font-medium text-left">#</th>
                    <th className="p-3 font-medium text-left">Serial No</th>
                    <th className="p-3 font-medium text-left">Patient Info</th>
                    <th className="p-3 font-medium text-left">Schedule Info</th>
                    <th className="p-3 font-medium text-left">Consultation Type</th>
                    <th className="p-3 font-medium text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt, index) => (
                    <tr key={apt.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="p-3 text-gray-700">{index + 1}</td>
                      <td className="p-3 text-gray-700">{apt.serialNo}</td>
                      <td className="p-3 text-gray-700">
                        {apt.patient.name ? (
                          <div>
                            <p className="font-semibold">{apt.patient.name} ({apt.patient.mrNo})</p>
                            <p className="text-sm text-gray-500">{apt.patient.phone}</p>
                            <p className="text-sm text-gray-500">{apt.patient.email}</p>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-blue-500 font-medium">{apt.scheduleDate}</span>
                        <br />
                        <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                          {apt.scheduleTime}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-md text-sm ${
                            apt.type === "Online" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {apt.type}
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="p-2 border rounded-md bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center w-8 h-8">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>Showing 1 to {appointments.length} of {appointments.length} entries</span>
              <div className="flex items-center gap-2">
                <button className="border px-3 py-1 rounded-md text-gray-500 cursor-not-allowed">Previous</button>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-md">1</span>
                <button className="border px-3 py-1 rounded-md text-gray-500 cursor-not-allowed">Next</button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Appointments;
