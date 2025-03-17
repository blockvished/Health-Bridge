"use client"
import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaLock } from "react-icons/fa"; // Import lock icon

const ChangePassword: React.FC = () => {
  // State for old password, new password, and confirm password
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Handle input change
  const handleOldPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // You can handle the password change logic here
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);
    console.log("Confirm Password:", confirmPassword);
  };

  return (
    <div className="bg-gray-100 shadow-xl rounded-2xl max-w-lg mx-auto w-full p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Change Password</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-600 font-medium mb-2">Old Password</label>
          <div className="relative">
            <input
              type="password"
              value={oldPassword}
              onChange={handleOldPasswordChange}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
              placeholder="Enter old password"
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-2">New Password</label>
          <div className="relative">
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
              placeholder="Enter new password"
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
              placeholder="Confirm new password"
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <button
          type="submit"
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 text-sm rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
