import React from "react";

const DomainTable: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-lg font-semibold">Domain</h2>
          <div className="flex gap-2">
            <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-1">
              <span className="text-sm">⚙</span> DNS Settings
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center gap-1">
              <span className="text-sm">➕</span> Create New
            </button>
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Current Domain</th>
                <th className="p-2 text-left">Custom Domain</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Example row, replace with dynamic data */}
              <tr className="border-t">
                <td className="p-2">1</td>
                <td className="p-2">example.com</td>
                <td className="p-2">custom.com</td>
                <td className="p-2">2025-03-15</td>
                <td className="p-2 text-green-600">Active</td>
                <td className="p-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">Manage</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DomainTable;
