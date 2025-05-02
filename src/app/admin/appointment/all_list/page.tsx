"use client"; // Ensure this is a client component
import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaEdit,
  FaEye,
  FaUser, // Import FaUser for the person icon
} from "react-icons/fa"; // Using react-icons
import { format } from "date-fns";
import AppointmentEditForm from "../AppointmentEditForm";

interface Appointment {
  appointmentId: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  mode: string;
  reason: string;
  visitStatus: boolean;
  paymentStatus: boolean;
  patientId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  isCancelled: boolean;
  cancelReason?: string; // Optional cancel reason
  mrNumber?: string; // Optional MR Number
}

interface DatedAppointments {
  date: string;
  appointments: Appointment[];
}

// Function to convert 24-hour time to 12-hour AM/PM format
const formatTime12Hour = (time24: string): string => {
  const [hours, minutes] = time24.slice(0, 5).split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
};

export default function AppointmentsPage() {
  // const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [datedAppointments, setDatedAppointments] = useState<
    DatedAppointments[]
  >([]);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const fetchAppointments = async () => {
    if (userId) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/doctor/appointments/get_all/dates/${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Appointments Data:", data);
        setDatedAppointments(data.appointments || []);
      } catch (err: any) {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const uniqueAppointmentDatesWithCount = datedAppointments.map((item) => ({
    date: item.date,
    count: item.appointments.length,
  }));

  const handleSeeList = (date: string) => {
    setSelectedDate(date);
  };

  const closeAppointmentList = () => {
    setSelectedDate(null);
  };

  const appointmentsForSelectedDate =
    datedAppointments.find((item) => item.date === selectedDate)
      ?.appointments || [];

  const handleCloseEditForm = () => {
    setEditingAppointment(null);
  };

  const handleAppointmentUpdated = () => {
    fetchAppointments();
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };

  return (
    <>
      {editingAppointment ? (
        <div className="mx-auto flex flex-col p-6 gap-6 w-full md:w-2/3 max-w-xl border-gray-300 rounded-xl shadow-md bg-white">
          <div className="mx-auto flex flex-col gap-6 w-full">
            <AppointmentEditForm
              appointment={editingAppointment}
              userId={userId}
              onClose={handleCloseEditForm}
              onSuccess={handleAppointmentUpdated}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md bg-white p-6 m-8 rounded-lg shadow">
          {/* Header */}
          <div className="flex justify-between items-center gap-4 mb-6 flex-wrap">
            {selectedDate ? (
              <h4 className="font-semibold text-lg text-gray-800">
                Appointments for {format(new Date(selectedDate), "dd MMMM")}
              </h4>
            ) : (
              <h3 className="font-semibold text-xl text-gray-700">
                Appointments list by date
              </h3>
            )}
            {selectedDate && (
              <button
                onClick={closeAppointmentList}
                className="flex items-center gap-2 text-gray-600 text-sm bg-gray-100 px-3 py-1.5 rounded-md shadow hover:bg-gray-200 cursor-pointer"
              >
                <FaArrowLeft />
                Back
              </button>
            )}
          </div>

          {loading && <>Loading...</>}

          {/* List of Dates with Count in a Table */}
          {!selectedDate && uniqueAppointmentDatesWithCount.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Patients</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueAppointmentDatesWithCount.map(({ date, count }) => (
                    <tr
                      key={date}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-500 text-sm" />
                          {format(new Date(date), "dd MMM")}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <FaUser className="text-gray-500 text-sm" />
                          {count}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleSeeList(date)}
                          className="inline-flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        >
                          <FaEye />
                          See List
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Appointment List for Selected Date */}
          {selectedDate && (
            <div className="mt-6">
              {/* The h4 for the selected date is now in the header */}
              {appointmentsForSelectedDate.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden min-w-[800px]">
                    <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                      <tr>
                        <th className="border border-gray-200 px-4 py-3">#</th>
                        <th className="border border-gray-200 px-4 py-3">
                          Patient Info
                        </th>
                        <th className="border border-gray-200 px-4 py-3">
                          Consultation Type
                        </th>
                        <th className="border border-gray-200 px-4 py-3">
                          Schedule Info
                        </th>
                        <th className="border border-gray-200 px-4 py-3">
                          Visit Status
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointmentsForSelectedDate.map((appointment, index) => (
                        <tr
                          key={appointment.appointmentId}
                          className="border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">
                              {appointment.patientName}
                            </div>
                            {appointment.mrNumber && (
                              <div className="text-gray-500 text-xs">
                                MR: {appointment.mrNumber}
                              </div>
                            )}
                            {appointment.patientPhone ===
                            appointment.patientEmail ? (
                              ""
                            ) : (
                              <div className="text-gray-500 text-xs">
                                Email: {appointment.patientEmail}
                              </div>
                            )}
                            <div className="text-gray-500 text-xs">
                              Phone: {appointment.patientPhone}
                            </div>
                          </td>
                          <td className="px-4 py-3 capitalize">
                            {appointment.mode}
                            {appointment.reason && (
                              <div className="text-gray-500 text-xs">
                                Reason: {appointment.reason}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 text-blue-600 font-medium">
                              <FaCalendarAlt className="text-blue-500 text-sm" />
                              {format(new Date(appointment.date), "dd MMM")}
                            </div>
                            <div className="text-gray-700 text-sm">
                              {formatTime12Hour(appointment.timeFrom)} -{" "}
                              {formatTime12Hour(appointment.timeTo)}
                            </div>

                            {appointment.isCancelled && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-sm">
                                Cancelled
                              </span>
                            )}
                            {appointment.paymentStatus && (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-sm">
                                Paid
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {appointment.visitStatus ? (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-sm">
                                Visited
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-sm">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              className="p-2 border rounded-md text-blue-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer transition"
                              onClick={() => handleEditAppointment(appointment)}
                              title="Edit appointment"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : loading ? (
                <p className="text-gray-500">Loading appointments...</p>
              ) : (
                <p className="text-gray-500"></p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
