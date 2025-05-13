import React, { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";

const Step4Security = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  showConfirmPassword,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  agreeTerms,
  setAgreeTerms,
  loading,
  onRegistrationComplete,
}) => {
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }
    setPasswordMatchError(false);

    // Simulate sending registration data to the backend
    try {
      // In a real scenario, you would send the registration data here
      // For this example, we'll just simulate a successful response after a delay
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      // Simulate a successful registration
      console.log("Registration successful");
      setRegistrationSuccess(true);
      setLoading(false);

      // Optionally call a parent component's callback
      if (onRegistrationComplete) {
        onRegistrationComplete();
      }

      // Redirect after a delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      setErrorMessage("An unexpected error occurred during registration.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      {registrationSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Registration completed successfully. Redirecting...</span>
        </div>
      )}
      {passwordMatchError && (
        <p className="text-red-500 text-sm">Passwords do not match.</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}
      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Create Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a secure password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Password must be at least 8 characters with number, special character
          & capital letter
        </p>
      </div>
      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      <div className="mt-4">
        <label className="flex items-start">
          <input
            type="checkbox"
            className="mt-1"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            required
          />
          <span className="ml-2 text-sm text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
      </div>
      <div className="flex justify-between pt-4">
        <button
          type="submit"
          disabled={!password || !confirmPassword || !agreeTerms || loading}
          className={`px-6 py-2 rounded-lg text-white ${
            !password || !confirmPassword || !agreeTerms || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
          } transition`}
        >
          {loading ? "Processing..." : "Complete Registration"}
        </button>
      </div>
    </form>
  );
};

export default Step4Security;