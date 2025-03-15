export default function AdvisesPage() {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-700">All Additional Advises</h3>
            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm shadow-sm hover:bg-gray-200">
              + Create New
            </button>
          </div>
  
          <div className="mt-4">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 text-sm">#</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 text-sm">Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 text-sm">Details</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">No data found!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  