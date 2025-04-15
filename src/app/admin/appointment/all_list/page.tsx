"use client"; // Ensure this is a client component
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa"; // Using react-icons for edit and delete
import { format } from "date-fns";
import { X } from "lucide-react";

interface Appointment {
  appointmentId: number;
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
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [datedAppointments, setDatedAppointments] = useState<
    DatedAppointments[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
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

    fetchAppointments();
  }, [userId]);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const uniqueAppointmentDates = datedAppointments.map((item) => item.date);

  const handleSeeList = (date: string) => {
    setSelectedDate(date);
  };

  const closeAppointmentList = () => {
    setSelectedDate(null);
  };

  const appointmentsForSelectedDate =
    datedAppointments.find((item) => item.date === selectedDate)
      ?.appointments || [];

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h3 className="font-semibold text-lg text-gray-700">
          Appointments List
        </h3>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 text-sm bg-gray-100 px-3 py-1.5 rounded-md shadow hover:bg-gray-200"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* List of Dates */}
      {!selectedDate && (
        <div className="mt-4">
          <ul className="space-y-2">
            {uniqueAppointmentDates.map((date) => (
              <li
                key={date}
                className="flex items-center justify-between bg-gray-100 rounded-md p-3 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500" />
                  <span className="text-blue-600">
                    {format(new Date(date), "dd MMM yyyy")}
                  </span>
                </div>
                <button
                  onClick={() => handleSeeList(date)}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
                >
                  <FaEye />
                  See List
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Appointment List for Selected Date */}
      {selectedDate && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-md text-gray-800">
              Appointments for {format(new Date(selectedDate), "dd MMM yyyy")}
            </h4>
            <button
              onClick={closeAppointmentList}
              className="flex items-center gap-2 text-sm bg-red-500 text-white px-3 py-1.5 rounded-md shadow hover:bg-red-600"
            >
              <X className="h-4 w-4" /> 
              Close
            </button>
          </div>
          {appointmentsForSelectedDate.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                    <th className="border border-gray-200 px-3 py-2">#</th>
                    <th className="border border-gray-200 px-3 py-2">
                      Patient Info
                    </th>
                    <th className="border border-gray-200 px-3 py-2">
                      Consultation Type
                    </th>
                    <th className="border border-gray-200 px-3 py-2">
                      Schedule Info
                    </th>
                    <th className="border border-gray-200 px-3 py-2">Status</th>
                    <th className="border border-gray-200 px-3 py-2 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsForSelectedDate.map((appointment, index) => (
                    <tr
                      key={appointment.appointmentId}
                      className="border border-gray-200"
                    >
                      <td className="px-3 py-3">{index + 1}</td>
                      <td className="px-3 py-3">
                        {appointment.patientName}
                        {appointment.mrNumber && (
                          <div className="text-gray-500 text-xs">
                            MR: {appointment.mrNumber}
                          </div>
                        )}
                        <div className="text-gray-500 text-xs">
                          Phone: {appointment.patientPhone}
                        </div>
                        <div className="text-gray-500 text-xs">
                          Email: {appointment.patientEmail}
                        </div>
                      </td>
                      <td className="px-3 py-3 capitalize">
                        {appointment.mode}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500 text-sm" />
                          {format(new Date(appointment.date), "dd MMM yyyy")}
                        </div>
                        <div className="text-blue-600 text-sm">
                          {formatTime12Hour(appointment.timeFrom)} -{" "}
                          {formatTime12Hour(appointment.timeTo)}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                            appointment.paymentStatus
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.paymentStatus ? "Paid" : "Unpaid"}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 ml-1 text-xs font-semibold ${
                            appointment.visitStatus
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.visitStatus ? "Visited" : "Not Visited"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="text-blue-500 hover:text-blue-700 cursor-pointer">
                            <FaEdit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No appointments for this date.</p>
          )}
        </div>
      )}
    </div>
  );
}
