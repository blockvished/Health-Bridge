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
      action: "...", // Use three dots for the action
    },
    // Add more dummy data if needed
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Domain Request</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500">
            <th className="py-2">#</th>
            <th className="py-2">Current Domain</th>
            <th className="py-2">Custom Domain</th>
            <th className="py-2">Date</th>
            <th className="py-2">Status</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((request) => (
            <tr key={request.id} className="border-t">
              <td className="py-2">{request.id}</td>
              <td className="py-2">{request.currentDomain}</td>
              <td className="py-2">{request.customDomain}</td>
              <td className="py-2">{request.date}</td>
              <td className="py-2">
                {request.status === "Pending" ? (
                  <span className="bg-yellow-200 text-yellow-800 rounded-full px-2 py-1 text-xs">
                    {request.status}
                  </span>
                ) : (
                  request.status
                )}
              </td>
              <td className="py-2">{request.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomDomainRequest;