"use client";
import { Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";

// Define types for the appointment data
interface Appointment {
  appointmentId: number;
  date: string;
  timeFrom: string;
  timeTo: string;
  mode: string;
  reason: string;
  visitStatus: string;
  paymentStatus: string | boolean | null; // Updated to handle boolean values
  amount: number;
  patientId: string | number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  doctorId?: string | number; // Added doctorId for consultation link
  clinicName: string;
  clinicAddress: string;
  isCancelled: boolean;
  cancelReason: string | null;
}

interface ApiResponse {
  appointments: Appointment[];
  error?: string;
}

interface ConsultationLinkResponse {
  consultationLink: string | null;
  message?: string;
  error?: string;
}

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [consultationLinks, setConsultationLinks] = useState<{
    [appointmentId: number]: string | null;
  }>({});
  const [paymentLoading, setPaymentLoading] = useState<{
    [appointmentId: number]: boolean;
  }>({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/patient/appointments");

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data: ApiResponse = await response.json();
        console.log(data)

        if (data.error) {
          throw new Error(data.error);
        }

        setAppointments(data.appointments || []);
      } catch (err: unknown) {
        console.error("Error fetching appointments:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          // Handle cases where the error is not an Error object
          console.error("An unexpected error occurred:", err);
          setError("An unexpected error occurred."); // Provide a generic error message
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchConsultationLinks = async () => {
      for (const appointment of appointments) {
        if (
          appointment.paymentStatus === true ||
          appointment.paymentStatus === "true"
        ) {
          if (appointment.mode?.toLowerCase() === "online") {
            try {
              const response = await fetch(`/api/patient/consultation`);
              if (response.ok) {
                const data: ConsultationLinkResponse = await response.json();
                setConsultationLinks((prevLinks) => ({
                  ...prevLinks,
                  [appointment.appointmentId]: data.consultationLink,
                }));
              } else {
                console.error(
                  `Failed to fetch consultation link for appointment ${appointment.appointmentId}`
                );
                setConsultationLinks((prevLinks) => ({
                  ...prevLinks,
                  [appointment.appointmentId]: null,
                }));
              }
            } catch (error) {
              console.error(
                `Error fetching consultation link for appointment ${appointment.appointmentId}:`,
                error
              );
              setConsultationLinks((prevLinks) => ({
                ...prevLinks,
                [appointment.appointmentId]: null,
              }));
            }
          } else {
            setConsultationLinks((prevLinks) => ({
              ...prevLinks,
              [appointment.appointmentId]: null,
            }));
          }
        } else {
          setConsultationLinks((prevLinks) => ({
            ...prevLinks,
            [appointment.appointmentId]: null,
          }));
        }
      }
    };

    if (!loading && appointments.length > 0) {
      fetchConsultationLinks();
    }
  }, [appointments, loading]);

  // Payment handler function
  const handlePayment = async (appointment: Appointment) => {
    setPaymentLoading(prev => ({
      ...prev,
      [appointment.appointmentId]: true
    }));

    try {
      const data = {
        amount: appointment.amount,
        appointmentId: appointment.appointmentId,
      };

      console.log("Payment data:", data);

      const response = await fetch(`/api/order-patient/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData);

      // Redirect user to PhonePe payment page
      if (responseData && responseData.checkoutPageUrl) {
        window.location.href = responseData.checkoutPageUrl;
      } else {
        alert("Failed to initiate payment. Please try again.");
      }
    } catch (err) {
      console.log(err);
      alert("Error initiating payment. Please try again.");
    } finally {
      setPaymentLoading(prev => ({
        ...prev,
        [appointment.appointmentId]: false
      }));
    }
  };

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
        console.log(err);
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
      console.log(err);
      return "bg-gray-100 text-gray-600"; // Default styling if toLowerCase fails
    }
  };

  // Helper to safely capitalize first letter
  const capitalizeFirstLetter = (text: string | null | undefined): string => {
    if (!text) return "N/A";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Function to check if join button should be displayed
  const shouldShowJoinButton = (appointment: Appointment): boolean => {
    // Don't show join button for cancelled appointments
    if (appointment.isCancelled) {
      return false;
    }

    // Only show join button for online consultations that are paid
    if (!appointment.mode || appointment.mode.toLowerCase() !== "online") {
      return false;
    }

    if (
      appointment.paymentStatus !== "true" &&
      appointment.paymentStatus !== true
    ) {
      return false;
    }

    return true;
  };

  // Function to check if payment button should be displayed
  const shouldShowPaymentButton = (appointment: Appointment): boolean => {
    // Don't show payment button for cancelled appointments
    if (appointment.isCancelled) {
      return false;
    }

    // Show payment button for both online and offline consultations that are not paid yet
    if (
      appointment.paymentStatus === "true" ||
      appointment.paymentStatus === true
    ) {
      return false;
    }

    return true;
  };

  // Function to check if "Pay at Clinic" message should be displayed
  const shouldShowPayAtClinicMessage = (appointment: Appointment): boolean => {
    // Don't show pay at clinic message for cancelled appointments
    if (appointment.isCancelled) {
      return false;
    }

    // Show "Pay at Clinic" message for offline appointments that are paid
    if (!appointment.mode || appointment.mode.toLowerCase() !== "offline") {
      return false;
    }

    if (
      appointment.paymentStatus === "true" ||
      appointment.paymentStatus === true
    ) {
      return true;
    }

    return false;
  };

  // Function to check if cancelled button should be displayed
  const shouldShowCancelledButton = (appointment: Appointment): boolean => {
    return appointment.isCancelled;
  };

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (appointments.length === 0 && !loading) {
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
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Loading appointments...
                </td>
              </tr>
            ) : (
              appointments.map((appointment, index) => (
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
                      <span>₹ {appointment.amount}</span>
                      <span
                        className={`mt-1 px-3 py-1 ${getStatusClass(
                          appointment.isCancelled
                            ? "cancelled"
                            : appointment.paymentStatus === true ||
                              appointment.paymentStatus === "true"
                            ? "completed"
                            : "pending"
                        )} rounded-md text-xs inline-block`}
                      >
                        ●{" "}
                        {appointment.isCancelled
                          ? "Cancelled"
                          : appointment.paymentStatus === true ||
                            appointment.paymentStatus === "true"
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col gap-2">
                      {/* Cancelled Button for cancelled appointments */}
                      {shouldShowCancelledButton(appointment) && (
                        <button
                          className="bg-gray-400 text-white font-bold py-2 px-3 rounded-md text-xs flex items-center gap-1 w-full justify-center cursor-not-allowed"
                          disabled
                        >
                          Cancelled
                        </button>
                      )}

                      {/* Join Button for paid online appointments */}
                      {shouldShowJoinButton(appointment) && (
                        <Link
                          href={
                            consultationLinks[appointment.appointmentId] || "#"
                          }
                        >
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-xs flex items-center gap-1 w-full justify-center"
                            disabled={
                              !consultationLinks[appointment.appointmentId]
                            }
                          >
                            <Video size={14} className="mr-1" /> Join
                          </button>
                        </Link>
                      )}

                      {/* Payment Button for unpaid appointments (both online and offline) */}
                      {shouldShowPaymentButton(appointment) && (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handlePayment(appointment)}
                            disabled={paymentLoading[appointment.appointmentId]}
                            className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-3 rounded-md text-xs flex items-center gap-1 w-full justify-center"
                          >
                            {paymentLoading[appointment.appointmentId] ? (
                              "Processing..."
                            ) : (
                              appointment.mode?.toLowerCase() === "online" ? "Pay to Join" : "Pay Online"
                            )}
                          </button>
                          
                          {/* Show "Pay at Clinic" option for offline appointments */}
                          {appointment.mode?.toLowerCase() === "offline" && (
                            <span className="text-xs text-gray-600 text-center">
                              or pay at clinic
                            </span>
                          )}
                        </div>
                      )}

                      {/* Message for paid offline appointments */}
                      {shouldShowPayAtClinicMessage(appointment) && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded text-center">
                          ✓ Paid - Visit clinic
                        </span>
                      )}

                      {/* Waiting message for paid online appointments without consultation link */}
                      {appointment.mode?.toLowerCase() === "online" && 
                       (appointment.paymentStatus === true || appointment.paymentStatus === "true") &&
                       !consultationLinks[appointment.appointmentId] &&
                       !appointment.isCancelled && (
                        <span className="text-xs text-gray-500 text-center">
                          Waiting to join
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}