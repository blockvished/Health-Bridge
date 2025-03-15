export default function Prescriptions() {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-5xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Prescriptions</h3>
            <button className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg flex items-center hover:bg-gray-300 transition">
              ➕ Create New Prescription
            </button>
          </div>
  
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="py-3 px-4 text-left border-b">#</th>
                  <th className="py-3 px-4 text-left border-b">Mr. No</th>
                  <th className="py-3 px-4 text-left border-b">Patient Name</th>
                  <th className="py-3 px-4 text-left border-b">Phone</th>
                  <th className="py-3 px-4 text-left border-b">Email</th>
                  <th className="py-3 px-4 text-left border-b">Created</th>
                  <th className="py-3 px-4 text-left border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">No data available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    );
  }
  