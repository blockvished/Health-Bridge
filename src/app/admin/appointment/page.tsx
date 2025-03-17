"use client";

import React, { useState } from "react";
import { FiCalendar, FiTrash } from "react-icons/fi";
import { MdOutlineDateRange } from "react-icons/md";

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
    patient: {
      name: "Raj Kumar",
      mrNo: "28705",
      phone: "9650561756",
      email: "patient@livedoctors.in",
    },
    scheduleDate: "19 Mar 2025",
    scheduleTime: "09:00 AM - 01:00 PM",
    type: "Offline",
  },
  {
    id: 3,
    serialNo: "1",
    patient: {
      name: "Patient",
      mrNo: "45826",
      phone: "924062456",
      email: "patient@gmail.com",
    },
    scheduleDate: "18 Mar 2025",
    scheduleTime: "09:00 AM - 01:00 PM",
    type: "Offline",
  },
  {
    id: 4,
    serialNo: "1",
    patient: {
      name: "Raj Kumar",
      mrNo: "28705",
      phone: "9650561756",
      email: "patient@livedoctors.in",
    },
    scheduleDate: "22 Jul 2024",
    scheduleTime: "09:00 AM - 01:00 PM",
    type: "Offline",
  },
];

const Appointments = () => {
  const [appointments, setAppointments] = useState(appointmentsData);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter appointments based on search input
  const filteredAppointments = appointments.filter((apt) =>
    `${apt.patient.name} ${apt.patient.mrNo} ${apt.patient.phone} ${apt.patient.email} ${apt.scheduleDate}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredAppointments.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const displayedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  return (
    <div className="flex max-w-6xl mx-auto gap-6 p-6">
      {/* Left: Add Appointment Form */}
      <div className="bg-white shadow-md rounded-xl p-6 w-1/3">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add Appointment
        </h2>

        <label className="text-sm text-gray-600">Date</label>
        <input type="date" className="w-full p-2 border rounded-md mt-1 mb-3" />

        <label className="text-sm text-gray-600">Appointment Type</label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="appointmentType"
              value="Online"
              className="accent-blue-500"
            />
            Online
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="appointmentType"
              value="Offline"
              className="accent-blue-500"
            />
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

        <button className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2">
          <FiCalendar /> Add Serial
        </button>
      </div>

      {/* Right: Appointments Table */}
      <div className="bg-white shadow-md rounded-xl p-6 w-2/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Appointments</h2>
          <button className="text-gray-600 text-sm border px-3 py-1 rounded-md flex items-center gap-1">
            <MdOutlineDateRange /> List by date
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <label className="text-sm text-gray-600">
            Show
            <select
              className="border rounded-md px-2 py-1 mx-2"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            entries
          </label>
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
              {displayedAppointments.map((apt, index) => (
                <tr
                  key={apt.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-700">
                    {startIndex + index + 1}
                  </td>
                  <td className="p-3 text-gray-700">{apt.serialNo}</td>
                  <td className="p-3 text-gray-700">
                    {apt.patient.name ? (
                      <div>
                        <p className="font-semibold">
                          {apt.patient.name} ({apt.patient.mrNo})
                        </p>
                        <p className="text-sm text-gray-500">
                          {apt.patient.phone}
                        </p>
                        <p className="text-sm text-gray-500">
                          {apt.patient.email}
                        </p>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3">{apt.scheduleDate}</td>
                  <td className="p-3">{apt.type}</td>
                  <td className="p-3">
                    <button className="p-2 border rounded-md bg-red-500 text-white hover:bg-red-600 transition">
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            className={`px-4 py-2 rounded-md transition ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={`px-4 py-2 rounded-md transition ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
