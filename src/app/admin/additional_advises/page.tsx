"use client";
import { useState } from "react";

export default function AdvisesPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-700">
            {isCreating ? "Create New Advice" : "All Additional Advises"}
          </h3>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm shadow-sm hover:bg-gray-200"
            >
              + Create New
            </button>
          )}
        </div>

        {isCreating ? (
          // Create New Form (Replace this with the structure in your image)
          <div className="mt-4 p-4 border border-gray-300 rounded-lg">
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Details</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mt-1 h-32"
            ></textarea>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm shadow-sm hover:bg-gray-600"
              >
                Back
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm shadow-sm hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
        ) : (
          // Table View
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
        )}
      </div>
    </div>
  );
}
