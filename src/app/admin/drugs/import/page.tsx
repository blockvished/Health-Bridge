export default function BulkImportDrugs() {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Bulk Import Drugs</h3>
            <div className="flex gap-2">
              <button className="bg-blue-100 text-blue-600 text-sm px-3 py-1.5 rounded-md hover:bg-blue-200">
                📥 Download CSV Template
              </button>
              <button className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-md hover:bg-gray-200">
                ☰ Drugs
              </button>
            </div>
          </div>
  
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Upload CSV file</label>
            <input type="file" className="w-full border rounded-md px-3 py-2 text-sm" />
  
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2">
              ✅ Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
  