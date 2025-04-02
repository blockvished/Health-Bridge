import React from 'react';

const FacebookAppSettings = () => {
  return (
    <div className="overflow-x-auto"> 
      <table className="min-w-full border-collapse border border-gray-300"> 
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border-b text-left">User ID</th>
            <th className="p-2 border-b text-left">Account Name</th>
            <th className="p-2 border-b text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-b break-all">3919603828358215</td> 
            <td className="p-2 border-b">Ravi Gupta</td>
            <td className="p-2 border-b text-red-500">Delete Account</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FacebookAppSettings;