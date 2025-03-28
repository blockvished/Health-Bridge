// CustomDomainRequest.tsx
import React from "react";

interface DomainRequest {
  id: number;
  currentDomain: string;
  customDomain: string;
  date: string;
  status: string;
  action: string;
}

const CustomDomainRequest: React.FC = () => {
  const dummyData: DomainRequest[] = [
    {
      id: 1,
      currentDomain: "https://www.livedoctors.in/",
      customDomain: "test.com",
      date: "15 Jul 2024",
      status: "Pending",
      action: "...",
    },
    // Add more dummy data if needed
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-md overflow-x-auto"> {/* Added overflow-x-auto */}
      <h2 className="text-lg font-semibold mb-4">Domain Request</h2>
      <table className="w-full text-left min-w-[600px]"> {/* Added min-w to prevent content collapse on small screens */}
        <thead>
          <tr className="text-gray-500">
            <th className="py-2 px-2 sm:px-4 whitespace-nowrap">#</th> {/* Added px and whitespace-nowrap */}
            <th className="py-2 px-2 sm:px-4 whitespace-nowrap">Current Domain</th>
            <th className="py-2 px-2 sm:px-4 whitespace-nowrap">Custom Domain</th>
            <th className="py-2 px-2 sm:px-4 whitespace-nowrap">Date</th>
            <th className="py-2 px-2 sm:px-4 whitespace-nowrap">Status</th>
            <th className="py-2 px-2 sm:px-4 whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((request) => (
            <tr key={request.id} className="border-t">
              <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{request.id}</td>
              <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{request.currentDomain}</td>
              <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{request.customDomain}</td>
              <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{request.date}</td>
              <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
                {request.status === "Pending" ? (
                  <span className="bg-yellow-200 text-yellow-800 rounded-full px-2 py-1 text-xs">
                    {request.status}
                  </span>
                ) : (
                  request.status
                )}
              </td>
              <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{request.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomDomainRequest;