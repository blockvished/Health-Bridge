"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdOutlineDateRange, MdOutlineAccessTime } from "react-icons/md";
import AppointmentEditForm from "./AppointmentEditForm";

// Define interfaces for the data structure
interface Appointment {
  appointmentId: string;
  date: string;
  patientId: number;
  patientEmail: string;
  patientName: string;
  patientPhone: string;
  scheduleDate?: string;
  mode: string;
  paymentStatus: boolean;
  reason: string;
  timeFrom: string;
  timeTo: string;
  visitStatus: boolean;
  isCancelled?: boolean;
  cancelReason?: string;
}

interface AppointmentResponse {
  appointments: Appointment[];
}

// Function to format time from 24-hour to 12-hour format
const formatTime = (time24: string): string => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12; // Convert 0 to 12 for midnight
  return `${hour12}:${minutes} ${period}`;
};

interface AppointmentTableProps {
  userId: string | null;
  refresh: boolean; // Add the refresh prop
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  userId,
  refresh,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      fetchAppointments();
    }
  }, [userId, refresh]);

  // Move fetchAppointments outside useEffect so it can be called after deletion or edit
  const fetchAppointments = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/appointments/get_all/${userId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Failed to fetch appointments: ${res.status} - ${
            errorData?.message || res.statusText
          }`
        );
      }
      const data = (await res.json()) as AppointmentResponse;
      console.log(data)
      setAppointments(data.appointments || []);
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setLoading(false);
      console.error("Error fetching appointments:", err);
    }
  }, [userId]);

  // Function to handle appointment deletion
  // const deleteAppointment = async (appointmentId: number) => {
  //   if (!userId) return;

  //   try {
  //     const response = await fetch(
  //       `/api/doctor/appointments/delete/${userId}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ appointmentId }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to delete appointment");
  //     }

  //     // Refresh the appointments list after successful deletion
  //     fetchAppointments();
  //   } catch (error) {
  //     console.error("Error deleting appointment:", error);
  //     alert("Failed to delete appointment. Please try again.");
  //   }
  // };

  // Function to toggle row expansion
  const toggleRowExpansion = (appointmentId: string) => {
    if (expandedRow === appointmentId) {
      setExpandedRow(null); // Collapse if already expanded
    } else {
      setExpandedRow(appointmentId); // Expand the clicked row
    }
  };

  // Handle opening the edit form
  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };

  // Handle closing the edit form
  const handleCloseEditForm = () => {
    setEditingAppointment(null);
  };

  // Handle successful appointment update
  const handleAppointmentUpdated = () => {
    fetchAppointments();
  };

  useEffect(() => {
    if (userId) {
      fetchAppointments();
    }
  }, [userId, fetchAppointments]);

  // Filter appointments based on search input
  const filteredAppointments = appointments.filter((apt) =>
    `${apt.patientName || ""} ${apt.patientId || ""} ${
      apt.patientPhone || ""
    } ${apt.patientEmail || ""} ${apt.scheduleDate || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAppointments.length / entriesPerPage)
  );
  const startIndex = (currentPage - 1) * entriesPerPage;
  const displayedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  if (error) {
    return (
      <div className="mx-auto p-6 w-full md:w-2/3 text-red-500">
        Error loading appointments: {error}
      </div>
    );
  }

  return (
    <>
      {editingAppointment ? (
        <div className="mx-auto p-4 md:p-6 flex flex-col gap-6 w-full md:w-2/3 border border-gray-300 rounded-xl shadow-md bg-white">

        <AppointmentEditForm
          appointment={editingAppointment}
          userId={userId}
          onClose={handleCloseEditForm}
          onSuccess={handleAppointmentUpdated}
        />
        </div>
      ) : (
        <div className="mx-auto p-4 md:p-6 flex flex-col gap-6 w-full md:w-2/3 border border-gray-300 rounded-xl shadow-md bg-white">
          <div className="flex flex-row justify-between items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Appointments
            </h2>
            <button
              onClick={() => router.push("/admin/appointment/all_list")}
              className="text-gray-600 text-sm border px-3 py-1 rounded-md flex items-center gap-1 hover:bg-gray-100 w-auto justify-center cursor-pointer"
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
                  <option
                    className="p-2 rounded-md hover:bg-gray-100"
                    value={10}
                  >
                    10
                  </option>
                  <option
                    className="p-2 rounded-md hover:bg-gray-100"
                    value={50}
                  >
                    50
                  </option>
                  <option
                    className="p-2 rounded-md hover:bg-gray-100"
                    value={100}
                  >
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
                  <th className="p-3 font-medium text-left">Apt. id</th>
                  <th className="p-3 font-medium text-left">Patient Info</th>
                  <th className="p-3 font-medium text-left">Schedule Info</th>
                  <th className="p-3 font-medium text-left">
                    Consultation Type
                  </th>
                  <th className="p-3 font-medium text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedAppointments.length > 0 ? (
                  displayedAppointments.map((apt, index) => (
                    <React.Fragment key={apt.appointmentId}>
                      <tr
                        className={`border-b ${
                          expandedRow === apt.appointmentId
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        } transition cursor-pointer ${
                          apt.isCancelled ? "opacity-60" : ""
                        }`}
                        onClick={() => toggleRowExpansion(apt.appointmentId)}
                      >
                        <td className="p-3 text-gray-700">
                          {startIndex + index + 1}
                        </td>
                        <td className="p-3 text-gray-700">
                          {apt.appointmentId || "-"}
                        </td>
                        <td className="p-3 text-gray-700">
                          {apt.appointmentId ? (
                            <div>
                              <p className="font-semibold">
                                {apt.patientName} ({apt.patientId})
                              </p>
                              <p className="text-sm text-gray-500">
                                {apt?.patientPhone}
                              </p>
                              <p className="text-sm text-gray-500">
                                {apt?.patientEmail == apt?.patientPhone}
                              </p>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-2 text-gray-700">
                          <div className="flex flex-col">
                            <div className="flex items-center text-blue-600 mb-1">
                              <MdOutlineDateRange className="mr-1" size={16} />
                              <span>
                                {new Date(apt.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center text-blue-500 text-sm">
                              <MdOutlineAccessTime className="mr-1" size={14} />
                              <span className="text-xs">
                                {formatTime(apt.timeFrom.substring(0, 5))} -{" "}
                                {formatTime(apt.timeTo.substring(0, 5))}
                              </span>
                            </div>
                            {/* Status indicators */}
                            <div className="flex gap-2 mt-1">
                              {apt.isCancelled && (
                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-sm">
                                  Cancelled
                                </span>
                              )}
                              {apt.paymentStatus && (
                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-sm">
                                  Paid
                                </span>
                              )}
                              {apt.visitStatus && (
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-sm">
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-700">
                          <div className="flex items-center">
                            <span>{apt.mode || "-"}</span>
                            <span className="ml-2">
                              {expandedRow === apt.appointmentId ? (
                                <FiChevronUp className="text-blue-500" />
                              ) : (
                                <FiChevronDown className="text-gray-500" />
                              )}
                            </span>
                          </div>
                        </td>
                        <td
                          className="p-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex space-x-2">
                            <button
                              className="p-2 border rounded-md text-blue-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer transition"
                              onClick={() => handleEditAppointment(apt)}
                              title="Edit appointment"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Expandable reason section */}
                      {expandedRow === apt.appointmentId && (
                        <tr>
                          <td
                            colSpan={6}
                            className="bg-blue-50 p-4 border-b border-blue-200"
                          >
                            <div className="p-3 bg-white rounded-md shadow-sm border border-blue-100">
                              <h4 className="font-medium text-gray-700 mb-2">
                                Appointment Details:
                              </h4>
                              <div className="text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <p>
                                    <span className="font-medium">Reason:</span>{" "}
                                    {apt.reason || "No reason provided"}
                                  </p>
                                  {apt.isCancelled && (
                                    <p className="text-red-600 mt-2">
                                      <span className="font-medium">
                                        Cancellation Reason:
                                      </span>{" "}
                                      {apt.cancelReason ||
                                        "No cancellation reason provided"}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <p>
                                    <span className="font-medium">
                                      Payment Status:
                                    </span>{" "}
                                    {apt.paymentStatus ? "Paid" : "Pending"}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Visit Status:
                                    </span>{" "}
                                    {apt.visitStatus ? "Completed" : "Pending"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-gray-500">
                      {loading
                        ? "Loading appointments..."
                        : "No appointments found."}
                    </td>
                  </tr>
                )}
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
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default AppointmentTable;
