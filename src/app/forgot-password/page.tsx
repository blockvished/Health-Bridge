"use client";

import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";

interface OTPResponse {
  success: boolean;
  message: string;
  existingUserId: number;
  verificationId?: string;
  userExists?: boolean;
  verified?: boolean;
}

const ForgotPassword = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState<"input" | "verify" | "reset">(
    "input"
  );
  const [verificationType, setVerificationType] = useState<"mobile" | "email">(
    "mobile"
  );
  const [userId, setUserId] = useState<number>();
  const [resetToken, setResetToken] = useState<string>("");

  // Form states
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validation states
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // OTP states
  // const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  // const [isVerified, setIsVerified] = useState(false);

  // Mobile formatting
  const [displayValue, setDisplayValue] = useState("");

  const router = useRouter();

  const formatMobileNumber = (number: string): string => {
    const digitsOnly = number.replace(/\D/g, "");

    if (digitsOnly.length <= 5) {
      return digitsOnly;
    } else {
      return `${digitsOnly.substring(0, 5)} ${digitsOnly.substring(5, 10)}`;
    }
  };

  // Update display value for mobile
  useEffect(() => {
    if (verificationType === "mobile") {
      setDisplayValue(formatMobileNumber(mobile));
    }
  }, [mobile, verificationType]);

  // Validation functions
  const validateInput = useCallback(() => {
    if (verificationType === "mobile") {
      if (mobile && mobile.length === 10) {
        setMobileError("");
        setIsFormValid(true);
      } else if (mobile) {
        setMobileError("Mobile number must be exactly 10 digits");
        setIsFormValid(false);
      } else {
        setMobileError("");
        setIsFormValid(false);
      }
    } else {
      if (email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(email)) {
          setEmailError("");
          setIsFormValid(true);
        } else {
          setEmailError("Please enter a valid email address");
          setIsFormValid(false);
        }
      } else {
        setEmailError("");
        setIsFormValid(false);
      }
    }
  }, [mobile, email, verificationType]);

  const validatePasswords = useCallback(() => {
    let isValid = true;

    // Validate new password
    if (newPassword) {
      if (newPassword.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        isValid = false;
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
      isValid = false;
    }

    // Validate confirm password
    if (confirmPassword) {
      if (confirmPassword !== newPassword) {
        setConfirmPasswordError("Passwords do not match");
        isValid = false;
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setConfirmPasswordError("");
      isValid = false;
    }

    setIsFormValid(isValid);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (currentStep === "input") {
      validateInput();
    } else if (currentStep === "reset") {
      validatePasswords();
    }
  }, [currentStep, validateInput, validatePasswords]);

  // Handle mobile input change
  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, "");
    const limitedDigits = digitsOnly.substring(0, 10);
    setMobile(limitedDigits);
  };

  // Handle email input change
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.toLowerCase());
  };

  // Send OTP functions
  const handleSendMobileOTP = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    if (!mobile || mobile.length < 10) {
      setError("Please enter a valid mobile number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/forgot-password/send-otp-mobile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });

      const data: OTPResponse = await response.json();

      console.log(data);

      setUserId(data.existingUserId);

      if (response.ok && data.success) {
        // setOtpSent(true);
        setVerificationId(data.verificationId || "");
        setCurrentStep("verify");
        setSuccessMessage("OTP sent to your mobile number");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Mobile OTP send error:", error);
      setError("An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOTP = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/forgot-password/send-otp-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setUserId(data.existingUserId);

      if (response.ok && data.success) {
        // setOtpSent(true);
        setCurrentStep("verify");
        setSuccessMessage("OTP sent to your email address");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Email OTP send error:", error);
      setError("An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP functions
  const handleVerifyMobileOTP = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/forgot-password/verify-mobile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, verificationId, otp, userId }),
      });

      const data = await response.json();
      console.log(data);

      setResetToken(data.resetToken);

      if (response.ok && data.success) {
        // setIsVerified(true);
        setCurrentStep("reset");
        setSuccessMessage("Mobile number verified successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Mobile OTP verification error:", error);
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOTP = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/forgot-password/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, userId }),
      });

      const data = await response.json();
      setResetToken(data.resetToken);
      console.log(data);

      if (response.ok && data.success) {
        // setIsVerified(true);
        setCurrentStep("reset");
        setSuccessMessage("Email verified successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || "Invalid or expired OTP");
      }
    } catch (error) {
      console.error("Email OTP verification error:", error);
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    if (!isFormValid) {
      setError("Please fill in all fields correctly");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/change_password/create", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword,
          resetToken,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        return;
      }

      console.log("Registration successful");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Unexpected error during registration:", error);
    }
  };

  // Handle form submissions
  const handleSendOTP = () => {
    if (verificationType === "mobile") {
      handleSendMobileOTP();
    } else {
      handleSendEmailOTP();
    }
  };

  const handleVerifyOTP = () => {
    if (verificationType === "mobile") {
      handleVerifyMobileOTP();
    } else {
      handleVerifyEmailOTP();
    }
  };

  const handleBack = () => {
    if (currentStep === "verify") {
      setCurrentStep("input");
      // setOtpSent(false);
      setOtp("");
    } else if (currentStep === "reset") {
      setCurrentStep("verify");
      // setIsVerified(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-cyan-200 justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl flex overflow-hidden">
        {/* Left Section - Info */}
        <div className="w-1/3 hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-400">
          <div className="md:flex flex-col items-center justify-center text-white p-6 text-center">
            <h2 className="text-2xl font-bold">Live Doctors</h2>
            <p className="mt-2 text-sm">
              Reset your password securely with email or mobile verification
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
              {currentStep === "input" && "Forgot Password"}
              {currentStep === "verify" && "Verify OTP"}
              {currentStep === "reset" && "Reset Password"}
            </h2>
            <p className="text-gray-500 mt-2">
              {currentStep === "input" &&
                "Enter your mobile number or email to receive OTP"}
              {currentStep === "verify" &&
                `OTP sent to your ${verificationType}`}
              {currentStep === "reset" && "Create your new password"}
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded mx-4">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded mx-4">
              {successMessage}
            </div>
          )}

          {/* Step 1: Input mobile/email */}
          {currentStep === "input" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendOTP();
              }}
            >
              {/* Verification Type Selector */}
              <div className="mt-6 mx-4">
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationType("mobile");
                      setEmail("");
                      setEmailError("");
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      verificationType === "mobile"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Mobile Number
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationType("email");
                      setMobile("");
                      setMobileError("");
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      verificationType === "email"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Email Address
                  </button>
                </div>

                {verificationType === "mobile" ? (
                  <div>
                    <label className="block text-gray-600 font-medium">
                      Mobile Number:
                    </label>
                    <div className="relative flex items-center mt-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">+91</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your registered mobile number"
                        value={displayValue}
                        onChange={handleMobileChange}
                        required
                        maxLength={11}
                        className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </div>
                    {mobileError && (
                      <p className="text-red-500 text-xs mt-1">{mobileError}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-600 font-medium">
                      Email Address:
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your registered email address"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs mt-1">{emailError}</p>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full py-2 mt-6 rounded-lg text-lg font-semibold transition mx-4 ${
                  isFormValid && !loading
                    ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    : "bg-blue-300 text-white cursor-not-allowed"
                }`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {currentStep === "verify" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyOTP();
              }}
            >
              <div className="mt-6 mx-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>

                <div>
                  <label className="block text-gray-600 font-medium">
                    Enter OTP:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 4-6 digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").substring(0, 6))
                    }
                    required
                    maxLength={6}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-center text-2xl tracking-widest"
                  />
                </div>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !otp || otp.length < 4}
                className={`w-full py-2 mt-6 rounded-lg text-lg font-semibold transition mx-4 ${
                  otp && otp.length >= 4 && !loading
                    ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    : "bg-blue-300 text-white cursor-not-allowed"
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {currentStep === "reset" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleResetPassword();
              }}
            >
              <div className="mt-6 space-y-4 mx-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>

                <div>
                  <label className="block text-gray-600 font-medium">
                    New Password:
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password (min 8 characters)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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

                <div>
                  <label className="block text-gray-600 font-medium">
                    Confirm New Password:
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                  {confirmPasswordError && (
                    <p className="text-red-500 text-xs mt-1">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full py-2 mt-6 rounded-lg text-lg font-semibold transition mx-4 ${
                  isFormValid && !loading
                    ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    : "bg-blue-300 text-white cursor-not-allowed"
                }`}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-gray-600 text-sm mx-4">
            Remember your password?{" "}
            <Link href="/" className="text-blue-500 font-medium">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
