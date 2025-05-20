"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, ChangeEvent } from "react";

interface Step1BasicInfoProps {
  fullName: string;
  setFullName: (name: string) => void;
  clinicName: string;
  setClinicName: (name: string) => void;
  handleNextStep: () => void;

  mobile: string;
  setMobile: (mobile: string) => void;
  otpSent: boolean;
  mobileVerified: boolean;
  otp: string;
  setOtp: (otp: string) => void;
  loading: boolean;
  handleSendOTP: () => Promise<{
    userExists?: boolean;
    verified?: boolean;
  } | null>;
  handleVerifyOTP: () => Promise<void>;

  email: string;
  setEmail: (email: string) => void;
  emailVerified: boolean;
  setEmailVerified: (verified: boolean) => void;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  fullName,
  setFullName,
  clinicName,
  setClinicName,
  handleNextStep,

  mobile,
  setMobile,
  otpSent,
  mobileVerified,
  otp,
  setOtp,
  loading,
  handleSendOTP,
  handleVerifyOTP,

  email,
  setEmail,
  emailVerified,
  setEmailVerified,
}) => {
  // State for email verification
  const [emailOtp, setEmailOtp] = useState<string>("");
  const [emailOtpSent, setEmailOtpSent] = useState<boolean>(false);
  const [loadingEmailOTP, setLoadingEmailOTP] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [existingAccount, setExistingAccount] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate email whenever it changes
  useEffect(() => {
    setIsEmailValid(validateEmail(email));
    if (email) setEmailError(null);
  }, [email]);

  const formatMobileNumber = (value: string): string => {
    if (!value) return "";
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 5) {
      return `${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
    }
    return digitsOnly;
  };

  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Set the raw, unformatted mobile number in the parent component's state
    setMobile(e.target.value.replace(/\D/g, ""));
    // Reset existing account message when user changes mobile number
    setExistingAccount(false);
  };

  // Modified Send OTP function to handle existing accounts
  const onSendOTP = async (): Promise<void> => {
    const result = await handleSendOTP();
    if (result && result.userExists && result.verified) {
      setExistingAccount(true);
    } else {
      setExistingAccount(false);
    }
  };

  const handleSendEmailOTP = async (): Promise<void> => {
    if (!isEmailValid) return;

    setLoadingEmailOTP(true);
    setEmailError(null);

    try {
      const response = await fetch("/api/send-otp-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailOtpSent(true);
        console.log("Email OTP sent successfully");
      } else {
        setEmailError(data.message || "Failed to send OTP. Please try again.");
        console.error("Failed to send email OTP:", data.message);
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      setEmailError("Network error. Please try again.");
    } finally {
      setLoadingEmailOTP(false);
    }
  };

  const handleVerifyEmailOTP = async (): Promise<void> => {
    setLoadingEmailOTP(true);
    setEmailError(null);
    try {
      const response = await fetch("/api/verify-otp-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: emailOtp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailVerified(true);
        console.log("Email verified successfully");
      } else {
        setEmailError(
          data.message || "Invalid or expired OTP. Please try again."
        );
        console.error("Failed to verify email OTP:", data.message);
      }
    } catch (error) {
      console.error("Error verifying email OTP:", error);
      setEmailError("Network error. Please try again.");
    } finally {
      setLoadingEmailOTP(false);
    }
  };

  const handleResendEmailOTP = async (): Promise<void> => {
    setEmailOtpSent(false);
    setEmailOtp("");
    await handleSendEmailOTP();
  };

  // Check if mobile number is valid for OTP sending
  const isMobileValid = mobile && mobile.length === 10;

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 p-4">
      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="inline-flex items-center w-full border rounded-lg focus-within:ring-2 focus-within:ring-blue-400 focus-within:outline-none">
          <span className="px-3 text-gray-500">Dr.</span>
          <input
            type="text"
            placeholder="Your full name"
            className="px-4 py-2 w-full rounded-r-lg focus:ring-0 focus:outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="w-full">
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2 w-full">
          <div className="inline-flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-400 focus-within:outline-none flex-1">
            <span className="px-3 text-gray-500">+91</span>
            <input
              type="tel"
              placeholder="Your mobile number"
              className="px-4 py-2 rounded-r-lg focus:ring-0 focus:outline-none w-full"
              value={formatMobileNumber(mobile)}
              onChange={handleMobileChange}
              maxLength={11} // 10 digits + 1 space
              disabled={mobileVerified}
              required
            />
          </div>
          <div className="w-24">
            <button
              type="button"
              onClick={onSendOTP}
              disabled={otpSent || mobileVerified || loading || !isMobileValid}
              className={`w-full h-full px-2 py-2 rounded-lg text-white ${
                !isMobileValid || otpSent || mobileVerified || loading
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition whitespace-nowrap`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </div>
        {mobile && mobile.length > 0 && mobile.length < 10 && (
          <div className="text-red-500 text-xs mt-1">
            Please enter a 10-digit mobile number
          </div>
        )}
      </div>

      {existingAccount && (
        <div className="w-full px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Account Already Exists
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You already have a verified account with this mobile number.
                  Please{" "}
                  <Link
                    href="/"
                    className="font-medium text-yellow-800 underline hover:text-yellow-900"
                  >
                    sign in
                  </Link>{" "}
                  instead.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {otpSent && !mobileVerified && !existingAccount && (
        <div className="w-full">
          <label className="block text-gray-600 text-sm font-medium mb-1">
            OTP Verification <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2 w-full">
            <input
              type="text"
              placeholder="Enter OTP"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
            />
            <div className="w-24">
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < 4}
                className={`w-full h-full px-2 py-2 rounded-lg text-white ${
                  loading || otp.length < 4
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600"
                } transition whitespace-nowrap`}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {mobileVerified && !existingAccount && (
        <div className="text-green-600 text-sm font-medium">
          Mobile number verified successfully! ✓
        </div>
      )}

      <div className="w-full">
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2 w-full">
          <div className="flex-1">
            <input
              type="email"
              placeholder="Your email address"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                emailError ? "border-red-500" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
              disabled={emailVerified}
            />
            <div className="h-5 mt-1">
              {email && !isEmailValid && !emailError && (
                <div className="text-red-500 text-xs">
                  Please enter a valid email address (e.g., example@domain.com)
                </div>
              )}
              {emailError && (
                <div className="text-red-500 text-xs">{emailError}</div>
              )}
            </div>
          </div>
          <div className="w-24 self-start">
            <button
              type="button"
              onClick={handleSendEmailOTP}
              disabled={
                emailOtpSent ||
                emailVerified ||
                loadingEmailOTP ||
                !isEmailValid ||
                existingAccount
              }
              className={`w-full h-10 px-2 py-2 rounded-lg text-white ${
                emailOtpSent ||
                emailVerified ||
                loadingEmailOTP ||
                !isEmailValid ||
                existingAccount
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition whitespace-nowrap`}
            >
              {loadingEmailOTP ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </div>
      </div>

      {emailOtpSent && !emailVerified && !existingAccount && (
        <div className="w-full">
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Email OTP Verification <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2 w-full">
            <input
              type="text"
              placeholder="Enter OTP"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
            />
            <div className="w-24">
              <button
                type="button"
                onClick={handleVerifyEmailOTP}
                disabled={loadingEmailOTP || emailOtp.length < 4}
                className={`w-full h-full px-2 py-2 rounded-lg text-white ${
                  loadingEmailOTP || emailOtp.length < 4
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600"
                } transition whitespace-nowrap`}
              >
                {loadingEmailOTP ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {`Didn't receive the OTP?`}
            <button
              type="button"
              onClick={handleResendEmailOTP}
              disabled={loadingEmailOTP}
              className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}

      {emailVerified && !existingAccount && (
        <div className="text-green-600 text-sm font-medium rounded-lg">
          Email verified successfully! ✓
        </div>
      )}

      <div className="w-full">
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Clinic Name <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Your clinic name"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          disabled={existingAccount}
        />
      </div>

      <div className="flex justify-start pt-6">
        <button
          type="button"
          onClick={handleNextStep}
          disabled={
            !mobileVerified ||
            !fullName.trim() ||
            !email ||
            !isEmailValid ||
            !emailVerified ||
            existingAccount
          }
          className={`flex items-center px-6 py-2 rounded-lg text-white ${
            !mobileVerified ||
            !fullName.trim() ||
            !email ||
            !isEmailValid ||
            !emailVerified ||
            existingAccount
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          } transition`}
        >
          Next <ArrowRight className="ml-2" size={16} />
        </button>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
