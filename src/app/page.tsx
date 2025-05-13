"use client";

import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const router = useRouter();

  const validateForm = useCallback(() => {
    // Validate login (mobile or email)
    if (login) {
      const isMobile = /^\d+$/.test(login); // Check if login contains only digits

      if (isMobile) {
        // Mobile validation - exactly 10 digits
        if (login.length !== 10) {
          setLoginError("Mobile number must be exactly 10 digits");
          setIsFormValid(false);
        } else {
          setLoginError("");
          // Check if password is also valid
          setIsFormValid(password.length >= 8);
        }
      } else {
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(login)) {
          setLoginError("Please enter a valid email address");
          setIsFormValid(false);
        } else {
          setLoginError("");
          // Check if password is also valid
          setIsFormValid(password.length >= 8);
        }
      }
    } else {
      setLoginError("");
      setIsFormValid(false);
    }

    // Validate password
    if (password) {
      if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        setIsFormValid(false);
      } else {
        setPasswordError("");
        // Only set form valid if login is also valid
        if (login) {
          const isMobile = /^\d+$/.test(login);
          if (isMobile && login.length === 10) {
            setIsFormValid(true);
          } else if (!isMobile && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {
            setIsFormValid(true);
          }
        }
      }
    } else {
      setPasswordError("");
      setIsFormValid(false);
    }
  }, [login, password, setLoginError, setIsFormValid, setPasswordError]);

  // Validate form inputs and update button state
  useEffect(() => {
    validateForm();
  }, [login, password, validateForm]);

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
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message || "Login failed");
        setError(data.message);
        return;
      }

      // Redirect based on user role
      if (data.user.role === "doctor") {
        router.push("/admin/dashboard/user");
      } else if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "patient") {
        router.push("/admin/dashboard/patient");
      }
    } catch (err: unknown) {
      let errorMessage = "An unexpected error occurred during login";
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value.toLowerCase());
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value); // Keep original case for password
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
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-2/3 p-8 flex flex-col justify-center">
          <div className="text-center">
            <Image
              src="/logo_live_doctors.png"
              alt="Live Doctors Logo"
              className="mx-auto mb-4"
              width={150}
              height={48}
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
                <label className="block text-gray-600 font-medium">
                  Mobile / Email:{" "}
                </label>
                <input
                  type="text"
                  placeholder="Please enter your registered Mobile Number or E-Mail"
                  value={login}
                  onChange={handleLoginChange}
                  required
                  className={`w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                />
                {loginError && (
                  <p className="text-red-500 text-xs mt-1">{loginError}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 font-medium">
                  Password:
                </label>

                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm`}
                    value={password}
                    onChange={handlePasswordChange}
                    required
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
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>
            </div>

            <div className="text-right mt-2 mx-4">
              <Link href="#" className="text-blue-500 text-sm">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-2 mt-4 rounded-lg text-lg font-semibold transition mx-4 ${
                isFormValid && !loading
                  ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  : "bg-blue-300 text-white cursor-not-allowed"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600 text-sm mx-4">
            Don&apos;t have an account?{" "}
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
