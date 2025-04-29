"use client";
import { Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { FaTimesCircle } from "react-icons/fa";

// Define types for the appointment data
interface Appointment {
  appointmentId: number;
  date: string;
  timeFrom: string;
  timeTo: string;
  mode: string;
  reason: string;
  visitStatus: string;
  paymentStatus: string | null;
  patientId: string | number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  clinicName: string;
  clinicAddress: string;
  isCancelled: boolean;
  cancelReason: string | null;
  price?: string;
}

interface ApiResponse {
  appointments: Appointment[];
  error?: string;
}

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/patient/appointments");

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data: ApiResponse = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setAppointments(data.appointments || []);
      } catch (err: any) {
        console.error("Error fetching appointments:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Function to format date in required format (e.g. "01 Apr 2025")
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid Date";
    }
  };

  // Function to format time range (e.g. "09:00 AM - 01:00 PM")
  const formatTimeRange = (timeFrom: string, timeTo: string): string => {
    if (!timeFrom || !timeTo) return "N/A";

    const formatTime = (time: string): string => {
      try {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minutes} ${ampm}`;
      } catch (err) {
        return time; // Return original if parsing fails
      }
    };

    return `${formatTime(timeFrom)} - ${formatTime(timeTo)}`;
  };

  // Function to get status badge class - fixed to handle null or undefined values
  const getStatusClass = (status: string | null | undefined): string => {
    if (!status) return "bg-gray-100 text-gray-600"; // Default styling for null/undefined

    try {
      const normalizedStatus = status.toLowerCase();
      if (normalizedStatus === "completed")
        return "bg-green-100 text-green-600";
      if (normalizedStatus === "pending") return "bg-red-100 text-red-600";
      if (normalizedStatus === "cancelled") return "bg-gray-100 text-gray-600";
      return "bg-yellow-100 text-yellow-800";
    } catch (err) {
      return "bg-gray-100 text-gray-600"; // Default styling if toLowerCase fails
    }
  };

  // Helper to safely capitalize first letter
  const capitalizeFirstLetter = (text: string | null | undefined): string => {
    if (!text) return "N/A";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  if (loading) return <div className="p-4">Loading appointments...</div>;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (appointments.length === 0) {
    return <div className="p-4">No appointments found.</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Appointments</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3">Serial No</th>
              <th className="p-3">Mr. No</th>
              <th className="p-3">Doctor Info</th>
              <th className="p-3">Schedule Info</th>
              <th className="p-3">Consultation type</th>
              <th className="p-3">Price</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {appointments.map((appointment, index) => (
              <tr
                key={appointment.appointmentId}
                className="border-b last:border-none text-gray-700"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium text-blue-600">
                  #{appointment?.patientId}
                </td>
                <td className="p-3 font-semibold">
                  {appointment.doctorName || "N/A"}
                </td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-xs">
                      <AiOutlineCalendar />
                      {formatDate(appointment.date)}
                    </span>
                    <span className="flex items-center gap-2 text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-xs">
                      <AiOutlineClockCircle />
                      {formatTimeRange(
                        appointment.timeFrom,
                        appointment.timeTo
                      )}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-3 py-1 bg-gray-300 text-gray-800 rounded-full text-xs inline-flex items-center gap-2">
                    ● {capitalizeFirstLetter(appointment.mode)}
                  </span>
                </td>
                <td className="p-3 text-gray-900 font-semibold">
                  <div className="flex flex-col">
                    <span>₹ {appointment.price || "1000.00"}</span>
                    <span
                      className={`mt-1 px-3 py-1 ${getStatusClass(
                        appointment.paymentStatus
                      )} rounded-md text-xs inline-block`}
                    >
                      ● {appointment.paymentStatus || "Pending"}
                    </span>
                  </div>
                </td>

                <td className="p-3 flex items-center gap-2">
                  <Link href={`/consultation`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-xs flex items-center gap-1">
                      <Video size={14} className="mr-1" /> Join
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// if consultation is online and if payment status is pending and not paid then he wont get the link
// else the row will contain the link from doctor id to doctor consultation settings and llnk
