"use client";

import { FaDownload, FaBars, FaCheck } from "react-icons/fa";

export default function BulkImportDrugs() {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Bulk Import Drugs
        </h3>
        <div className="flex gap-2">
          <button className="bg-blue-100 text-blue-600 text-sm px-3 py-1.5 rounded-md hover:bg-blue-200 flex items-center gap-2">
            <FaDownload className="text-blue-600" />
            <span className="ml-2">Download CSV Template</span>
          </button>
          <button className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-2">
            <FaBars className="text-gray-600" />
            <span className="ml-2">Drugs</span>
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <label className="block text-gray-600 text-sm font-medium mb-2">
          Upload CSV file
        </label>
        <div className="flex items-center gap-2">
          <label
            htmlFor="file-upload"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-700"
          >
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => console.log(e.target.files?.[0]?.name)}
          />
          <span className="text-sm text-gray-600">No file chosen</span>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2">
          <FaCheck /> Submit
        </button>
      </div>
    </div>
  );
}
