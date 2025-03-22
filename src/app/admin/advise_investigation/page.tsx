"use client";
import { useState } from "react";

export default function DiagnosticTestPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-base sm:text-lg text-gray-700">
            {isCreating ? "Add New Test" : "All Diagnostic Test"}
          </h3>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-xs sm:text-sm shadow-sm hover:bg-gray-200"
            >
              + Add New Test
            </button>
          )}
        </div>

        {isCreating ? (
          // Create New Form
          <div className="mt-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
            />

            <label className="block text-xs sm:text-sm font-medium text-gray-700 mt-4">
              Details
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mt-1 h-32 text-sm"
            ></textarea>

            <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2">
              <button
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-xs sm:text-sm shadow-sm hover:bg-gray-600 w-full sm:w-auto"
              >
                Back
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-xs sm:text-sm shadow-sm hover:bg-blue-600 w-full sm:w-auto">
                Save
              </button>
            </div>
          </div>
        ) : (
          // Table View (Responsive)
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-gray-600 text-xs sm:text-sm">
                    #
                  </th>
                  <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-gray-600 text-xs sm:text-sm">
                    Name
                  </th>
                  <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-gray-600 text-xs sm:text-sm">
                    Details
                  </th>
                  <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-gray-600 text-xs sm:text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-gray-500 py-4 text-xs sm:text-sm"
                  >
                    No data found!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
