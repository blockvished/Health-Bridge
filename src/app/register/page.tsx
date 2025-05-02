"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[^a-zA-Z0-9\s]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    return null;
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!name) {
      setError("Please enter your name.");
      setLoading(false);
      return;
    }

    if (!email) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to terms and conditions to proceed.");
      setLoading(false);
      return;
    }

    try {
      const role = "doctor"; // Default role for new users
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, role, password }),
      });

      const data = await response.json();
      console.log("Response data:", response);

      if (response.status === 201 && response.ok) {
        setSuccessMessage(
          data.message || "Registration successful! Redirecting..."
        );
        // Optionally redirect the user after a short delay
        setTimeout(() => {
          window.location.href = "/login"; // Replace with your login page URL
        }, 1000);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-cyan-200 justify-center items-center p-3">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl flex overflow-hidden">
        <div className="w-1/3 hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-400">
          <div className="md:flex flex-col items-center justify-center text-white p-6 text-center">
            <h2 className="text-2xl font-bold">Live Doctors</h2>
            <p className="mt-2 text-sm">
              Our all-in-one healthcare practice management system is designed
              to simplify and optimize your clinical operations while enhancing
              your marketing and promotional efforts.
            </p>
            <div className="absolute bottom-10 text-xs text-white">
              <p>Copyright © 2024. Live Doctors. All Rights Reserved.</p>
              <p>
                <Link href="#" className="underline">
                  Privacy
                </Link>{" "}
                |{" "}
                <Link href="#" className="underline">
                  Terms
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3 p-8 flex flex-col justify-center items-center">
          <div className="text-center w-full max-w-md">
            <Image
              src="/logo_live_doctors.png"
              alt="Live Doctors Logo"
              className="mx-auto mb-2" // Removed h-12 as we'll use the height prop
              width={48} // h-12 in Tailwind corresponds to a height of 3rem, which is typically 48px
              height={48} // Assuming you want a square logo with the same height
            />
            <h2 className="text-2xl font-bold text-gray-800">
              Create Your Account
            </h2>
            <p className="text-gray-500 mt-1">Sign up to get started</p>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-4">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-4">
              {successMessage}
            </div>
          )}
          <form
            onSubmit={handleSignup}
            className="w-full max-w-md p-4 flex flex-col justify-center"
          >
            <div className="mt-2 space-y-1">
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Phone
                </label>
                <div>
                  <style jsx>{`
                    input[type="number"]::-webkit-outer-spin-button,
                    input[type="number"]::-webkit-inner-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                    }
                  `}</style>
                  <input
                    type="number"
                    placeholder="Your phone number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      MozAppearance: "textfield",
                    }}
                  />
                </div>
              </div>

              <label className="block text-gray-600 text-sm font-medium">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <label className="block text-gray-600 text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2 cursor-pointer"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span className="text-gray-600">
                I agree to the{" "}
                <Link href="#" className="text-blue-500">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-blue-500">
                  Privacy Policy
                </Link>
                .
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg text-sm font-semibold hover:bg-blue-600 transition cursor-pointer"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 font-medium">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
