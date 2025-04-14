"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiTrash } from "react-icons/fi";
import { MdOutlineDateRange } from "react-icons/md";
import { patient } from "../../../db/schema";

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

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState(appointmentsData);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

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
    <div className="mx-auto p-4 md:p-6 flex flex-col gap-6 w-full md:w-2/3 border border-gray-300 rounded-xl shadow-md bg-white">
      <div className="flex flex-row justify-between items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Appointments</h2>
        <button
          onClick={() => router.push("/admin/appointment/all_list")}
          className="text-gray-600 text-sm border px-3 py-1 rounded-md flex items-center gap-1 hover:bg-gray-100 w-auto justify-center"
        >
          <MdOutlineDateRange /> List by date
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-3 mb-4">
        {/* Entries Dropdown */}
        <label className="text-sm text-gray-600 flex items-center w-full md:w-auto">
          Show
          <div className="relative mx-2 w-24">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none transition w-full appearance-none cursor-pointer shadow-sm"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page
              }}
            >
              <option className="p-2 rounded-md hover:bg-gray-100" value={10}>
                10
              </option>
              <option className="p-2 rounded-md hover:bg-gray-100" value={50}>
                50
              </option>
              <option className="p-2 rounded-md hover:bg-gray-100" value={100}>
                100
              </option>
            </select>
            {/* Custom Chevron Icon */}
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          entries
        </label>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full md:w-auto focus:ring-2 focus:ring-gray-400 focus:outline-none transition text-gray-700 placeholder-gray-400 shadow-sm"
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
                <td className="p-3 text-gray-700">{startIndex + index + 1}</td>
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
  );
};

export default AppointmentTable;
