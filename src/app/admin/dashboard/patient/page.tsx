"use client";
import {
  AiOutlineClockCircle,
  AiOutlineCalendar,
  AiOutlineFieldTime,
} from "react-icons/ai";

const appointments = [
  {
    serialNo: 1,
    mrNo: "#14590",
    doctor: {
      name: "Dr. Dheeraj Singh",
      center: "Digambar Healthcare Center",
      location: "Gorakhpur, U.P. India",
    },
    schedule: {
      date: "01 Apr 2025",
      time: "09:00 AM - 01:00 PM",
    },
    consultationType: "Offline (Chamber)",
  },
  {
    serialNo: 2,
    mrNo: "#14591",
    doctor: {
      name: "Dr. Rajesh Kumar",
      center: "Metro Healthcare",
      location: "Delhi, India",
    },
    schedule: {
      date: "02 Apr 2025",
      time: "10:30 AM - 12:30 PM",
    },
    consultationType: "Online",
  },
];

export default function UpcomingAppointments() {
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
            {appointments.map((appointment) => (
              <tr
                key={appointment.serialNo}
                className="border-b last:border-none"
              >
                <td className="p-5">{appointment.serialNo}</td>
                <td className="p-5">
                  <span className="px-4 py-1 bg-gray-200 text-gray-700 rounded-md text-sm inline-block">
                    {appointment.mrNo}
                  </span>
                </td>
                <td className="p-5">
                  <p className="font-semibold">{appointment.doctor.name}</p>
                  <p className="text-sm text-gray-500">
                    {appointment.doctor.center}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.doctor.location}
                  </p>
                </td>
                <td className="p-5">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-gray-700">
                      <AiOutlineCalendar className="text-gray-600" />
                      {appointment.schedule.date}
                    </span>
                    <span className="flex items-center gap-2 text-gray-700">
                      <AiOutlineFieldTime className="text-gray-600" />
                      {appointment.schedule.time}
                    </span>
                  </div>
                </td>
                <td className="p-5">
                  <span className="px-4 py-1 bg-gray-200 text-gray-700 rounded-md text-sm inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                    {appointment.consultationType}
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
