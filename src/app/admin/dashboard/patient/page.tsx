"use client";
import { useEffect, useState } from "react";
import {
  AiOutlineClockCircle,
  AiOutlineCalendar,
  AiOutlineFieldTime,
} from "react-icons/ai";

// Define types for the appointment data from API
interface Appointment {
  appointmentId: number;
  date: string;
  timeFrom: string;
  timeTo: string;
  mode: string;
  reason: string;
  visitStatus: string;
  paymentStatus: string | null;
  patientId: string | null;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  clinicName: string;
  clinicAddress: string;
  isCancelled: boolean;
  cancelReason: string | null;
}

interface ApiResponse {
  appointments: Appointment[];
  error?: string;
}

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/patient/appointments');
        
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Filter to only show non-cancelled appointments
        const upcomingAppointments = data.appointments.filter(
          appointment => !appointment.isCancelled
        );
        
        setAppointments(upcomingAppointments);
      } catch (err: any) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Function to format date in required format (e.g. "01 Apr 2025")
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  // Function to format time range (e.g. "09:00 AM - 01:00 PM")
  const formatTimeRange = (timeFrom: string, timeTo: string): string => {
    if (!timeFrom || !timeTo) return 'N/A';
    
    const formatTime = (time: string): string => {
      try {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minutes} ${ampm}`;
      } catch (err) {
        return time; // Return original if parsing fails
      }
    };
    
    return `${formatTime(timeFrom)} - ${formatTime(timeTo)}`;
  };

  // Format consultation type (mode) from API
  const formatConsultationType = (mode: string): string => {
    if (!mode) return 'N/A';
    
    const modeMap: Record<string, string> = {
      'online': 'Online',
      'offline': 'Offline (Chamber)',
      'video': 'Video Consultation',
      'home': 'Home Visit'
    };
    
    return modeMap[mode.toLowerCase()] || mode;
  };

  if (loading) return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AiOutlineClockCircle className="text-gray-600" />
        Upcoming Appointments
      </h2>
      <div className="text-center py-8">Loading appointments...</div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AiOutlineClockCircle className="text-gray-600" />
        Upcoming Appointments
      </h2>
      <div className="text-center py-8 text-red-500">Error: {error}</div>
    </div>
  );

  if (appointments.length === 0) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AiOutlineClockCircle className="text-gray-600" />
          Upcoming Appointments
        </h2>
        <div className="text-center py-8 text-gray-500">No upcoming appointments found.</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AiOutlineClockCircle className="text-gray-600" />
        Upcoming Appointments
      </h2>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-5 min-w-[100px]">Serial No</th>
              <th className="p-5 min-w-[120px]">Mr. No</th>
              <th className="p-5 min-w-[200px]">Doctor Info</th>
              <th className="p-5 min-w-[200px]">Schedule Info</th>
              <th className="p-5 min-w-[150px]">Consultation Type</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {appointments.map((appointment, index) => (
              <tr
                key={appointment.appointmentId}
                className="border-b last:border-none"
              >
                <td className="p-5">{index + 1}</td>
                <td className="p-5">
                  <span className="px-4 py-1 bg-gray-200 text-gray-700 rounded-md text-sm inline-block">
                    #{appointment.patientId}
                  </span>
                </td>
                <td className="p-5">
                  <p className="font-semibold">{appointment.doctorName || 'N/A'}</p>
                  <p className="text-sm text-gray-500">
                    {appointment.clinicName || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.clinicAddress || 'N/A'}
                  </p>
                </td>
                <td className="p-5">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-gray-700">
                      <AiOutlineCalendar className="text-gray-600" />
                      {formatDate(appointment.date)}
                    </span>
                    <span className="flex items-center gap-2 text-gray-700">
                      <AiOutlineFieldTime className="text-gray-600" />
                      {formatTimeRange(appointment.timeFrom, appointment.timeTo)}
                    </span>
                  </div>
                </td>
                <td className="p-5">
                  <span className="px-4 py-1 bg-gray-200 text-gray-700 rounded-md text-sm inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                    {formatConsultationType(appointment.mode)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}