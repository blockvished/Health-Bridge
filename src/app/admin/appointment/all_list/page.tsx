export default function AppointmentsPage() {
    const appointments = [
      { date: "22 Jul 2024" },
      { date: "18 Mar 2025" },
      { date: "19 Mar 2025" },
      { date: "24 Mar 2025" },
    ];
  
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-700">Appointments list by date</h3>
            <button className="text-sm bg-gray-100 px-3 py-1.5 rounded-md shadow hover:bg-gray-200">
              ← Back
            </button>
          </div>
  
          <div className="mt-4">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                  <th className="border border-gray-200 px-4 py-2">Date</th>
                  <th className="border border-gray-200 px-4 py-2">Patients</th>
                  <th className="border border-gray-200 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index} className="border border-gray-200">
                    <td className="px-4 py-3 flex items-center gap-2 text-blue-600">
                      <span className="bg-gray-200 px-2 py-1 rounded">📅</span>
                      {appointment.date}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className="bg-gray-200 px-2 py-1 rounded">👥</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 text-sm">1</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm shadow-sm hover:bg-gray-200">
                        👁️ See List
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  