"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleOldPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setOldPassword(e.target.value);
  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);

  const toggleOldPasswordVisibility = () =>
    setShowOldPassword(!showOldPassword);
  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const clearInputFields = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMatchError(true);
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setPasswordMatchError(false);

    try {
      const response = await fetch("/api/change_password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Password changed successfully:", data);
        toast.success("Password changed successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        clearInputFields();
      } else {
        console.error("Error changing password:", data.error || data);
        toast.error(data.error || "Failed to change password.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 max-w-lg w-full sm:ml-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 sm:mb-8">
          Change Password
        </h1>
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Old Password
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={handleOldPasswordChange}
                onFocus={() => setFocusedInput("oldPassword")}
                onBlur={() => setFocusedInput(null)}
                className={`block w-full rounded-md py-3 pl-3 pr-10 focus:outline-none sm:text-sm ${
                  focusedInput === "oldPassword"
                    ? "border-blue-500 ring-blue-500 border-2"
                    : "border border-gray-300"
                }`}
                placeholder="Enter old password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showOldPassword ? (
                  <FaEyeSlash
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={toggleOldPasswordVisibility}
                  />
                ) : (
                  <FaEye
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={toggleOldPasswordVisibility}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={handleNewPasswordChange}
                onFocus={() => setFocusedInput("newPassword")}
                onBlur={() => setFocusedInput(null)}
                className={`block w-full rounded-md py-3 pl-3 pr-10 focus:outline-none sm:text-sm ${
                  focusedInput === "newPassword"
                    ? "border-blue-500 ring-blue-500 border-2"
                    : "border border-gray-300"
                }`}
                placeholder="Enter new password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showNewPassword ? (
                  <FaEyeSlash
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={toggleNewPasswordVisibility}
                  />
                ) : (
                  <FaEye
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={toggleNewPasswordVisibility}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onFocus={() => setFocusedInput("confirmPassword")}
                onBlur={() => setFocusedInput(null)}
                className={`block w-full rounded-md py-3 pl-3 pr-10 focus:outline-none sm:text-sm ${
                  focusedInput === "confirmPassword"
                    ? "border-blue-500 ring-blue-500 border-2"
                    : "border border-gray-300"
                }`}
                placeholder="Confirm new password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showConfirmPassword ? (
                  <FaEyeSlash
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  />
                ) : (
                  <FaEye
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  />
                )}
              </div>
              {passwordMatchError && (
                <p className="mt-2 text-sm text-red-600">
                  Passwords do not match.
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition duration-150 ease-in-out"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 999999 }}
        toastStyle={{ zIndex: 999999 }}
        limit={3}
      />
    </>
  );
};

export default ChangePassword;