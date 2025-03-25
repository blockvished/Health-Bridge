"use client";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { FaTimesCircle } from "react-icons/fa";

const appointments = [
  {
    serialNo: 1,
    mrNo: "#14590",
    doctor: "Dr. Dheeraj Singh",
    schedule: {
      date: "01 Apr 2025",
      time: "09:00 AM - 01:00 PM",
    },
    consultationType: "Offline",
    price: "₹ 1000.00",
    prescription: "Not Created",
    status: "Pending",
  },
];

export default function AppointmentsList() {
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
              <th className="p-3">Prescription</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {appointments.map((appointment) => (
              <tr
                key={appointment.serialNo}
                className="border-b last:border-none text-gray-700"
              >
                <td className="p-3">{appointment.serialNo}</td>
                <td className="p-3 font-medium text-blue-600">
                  {appointment.mrNo}
                </td>
                <td className="p-3 font-semibold">{appointment.doctor}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-xs">
                      <AiOutlineCalendar />
                      {appointment.schedule.date}
                    </span>
                    <span className="flex items-center gap-2 text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-xs">
                      <AiOutlineClockCircle />
                      {appointment.schedule.time}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-3 py-1 bg-gray-300 text-gray-800 rounded-full text-xs inline-flex items-center gap-2">
                    ● {appointment.consultationType}
                  </span>
                </td>
                <td className="p-3 text-gray-900 font-semibold">
                  <div className="flex flex-col">
                    <span>{appointment.price}</span>
                    {appointment.status === "Pending" && (
                      <span className="mt-1 px-3 py-1 bg-red-100 text-red-600 rounded-md text-xs inline-block">
                        ● Pending
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                      ✖ {appointment.prescription}
                    </span>
                  </div>
                </td>
                <td className="p-3 flex items-center gap-2">
                  <button className="p-2 bg-red-100 text-red-600 rounded-md">
                    <FaTimesCircle />
                  </button>
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
