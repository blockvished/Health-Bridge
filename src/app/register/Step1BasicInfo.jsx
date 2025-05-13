import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";

const Step1BasicInfo = ({
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
  setEmailVerified
}) => {
  // State for email verification
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [loadingEmailOTP, setLoadingEmailOTP] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate email whenever it changes
  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const formatMobileNumber = (value) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 5) {
      return `${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
    }
    return digitsOnly;
  };

  const handleMobileChange = (e) => {
    setMobile(e.target.value.replace(/\D/g, ""));
  };

  const handleSendEmailOTP = async () => {
    if (!isEmailValid) return;

    setLoadingEmailOTP(true);
    // Simulate sending OTP - replace with your actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEmailOtpSent(true);
    setLoadingEmailOTP(false);
    console.log("Simulated email OTP sent to:", email);
  };

  const handleVerifyEmailOTP = async () => {
    setLoadingEmailOTP(true);
    // Simulate verifying OTP - replace with your actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (emailOtp === "123456") {
      setEmailVerified(true);
      console.log("Email verified successfully");
    } else {
      alert("Invalid OTP");
    }
    setLoadingEmailOTP(false);
  };

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
              maxLength={10}
              disabled={mobileVerified}
              required
            />
          </div>
          <div className="w-24">
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={
                otpSent || mobileVerified || loading || mobile.length < 10
              }
              className={`w-full h-full px-2 py-2 rounded-lg text-white ${
                otpSent || mobileVerified || loading || mobile.length < 10
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition whitespace-nowrap`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </div>
      </div>

      {otpSent && !mobileVerified && (
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

      {mobileVerified && (
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
              disabled={emailVerified}
            />
            <div className="h-5 mt-1">
              {email && !isEmailValid && (
                <div className="text-red-500 text-xs">
                  Please enter a valid email address (e.g., example@domain.com)
                </div>
              )}
            </div>
          </div>
          <div className="w-24 self-start">
            <button
              type="button"
              onClick={handleSendEmailOTP}
              disabled={
                emailOtpSent || emailVerified || loadingEmailOTP || !isEmailValid
              }
              className={`w-full h-10 px-2 py-2 rounded-lg text-white ${
                emailOtpSent || emailVerified || loadingEmailOTP || !isEmailValid
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition whitespace-nowrap`}
            >
              {loadingEmailOTP ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </div>
      </div>

      {emailOtpSent && !emailVerified && (
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
        </div>
      )}

      {emailVerified && (
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
        />
      </div>

      <div className="flex justify-start pt-6">
        <button
          type="button"
          onClick={handleNextStep}
          disabled={
            !mobileVerified || !fullName.trim() || !email || !isEmailValid || !emailVerified
          }
          className={`flex items-center px-6 py-2 rounded-lg text-white ${
            !mobileVerified || !fullName.trim() || !email || !isEmailValid || !emailVerified
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