const AppointmentsTable = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Appointments list by date</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Date</th>
              <th className="pb-3">Patients</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  22 Jul 2024
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  1
                </div>
              </td>
              <td className="py-4">
                <button className="text-blue-500 hover:text-blue-700">
                  See List →
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;
