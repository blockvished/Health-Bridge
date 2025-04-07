"use client";

import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on user role
      if (data.user.role === "doctor") {
        router.push("/dashboard/doctor");
      } else if (
        data.user.role === "admin" ||
        data.user.role === "superadmin"
      ) {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-cyan-200 justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl flex overflow-hidden">
        {/* Left Section - Info */}
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

        {/* Right Section - Form */}
        <div className="w-full md:w-2/3 p-8 flex flex-col justify-center">
          <div className="text-center">
            <img
              src="/logo_live_doctors.png"
              alt="Live Doctors Logo"
              className="h-12 mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-800">
              Sign in to Live Doctors
            </h2>
            <p className="text-gray-500 mt-2">Access your account below</p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded mx-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mt-6 space-y-3 mx-4">
              <div>
                <label className="block text-gray-600 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium">
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
              </div>
            </div>

            <div className="text-right mt-2 mx-4">
              <Link href="#" className="text-blue-500 text-sm">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition mx-4 disabled:bg-blue-300"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600 text-sm mx-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
