import React from "react";

const ChangePassword = () => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-lg mx-auto w-full p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Old Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter old password"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">New Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter new password"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Confirm new password"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow-md w-full"
        >
          ✔ Update
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
