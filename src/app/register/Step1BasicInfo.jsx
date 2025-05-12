import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Step1BasicInfo = ({
  fullName,
  setFullName,
  mobile,
  setMobile,
  email,
  setEmail,
  clinicName,
  setClinicName,
  otpSent,
  mobileVerified,
  otp,
  setOtp,
  loading,
  handleSendOTP,
  handleVerifyOTP,
  handleNextStep,
}) => {
  return (
    <div className="w-full space-y-3">
      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Your full name"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          <input
            type="tel"
            placeholder="Your mobile number"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            maxLength={10}
            disabled={mobileVerified}
            required
          />
          <button
            type="button"
            onClick={handleSendOTP}
            disabled={
              otpSent || mobileVerified || loading || mobile.length < 10
            }
            className={`px-4 py-2 rounded-lg text-white ${
              otpSent || mobileVerified || loading || mobile.length < 10
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            } transition whitespace-nowrap`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </div>

      {otpSent && !mobileVerified && (
        <div className="mt-2">
          <label className="block text-gray-600 text-sm font-medium mb-1">
            OTP Verification <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}

            />
            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={loading || otp.length < 4}
              className={`px-4 py-2 rounded-lg text-white ${
                loading || otp.length < 4
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition whitespace-nowrap`}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      )}

      {mobileVerified && (
        <div className="text-green-600 text-sm font-medium">
          Mobile number verified successfully! ✓
        </div>
      )}

      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="Your email address"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          required
        />
      </div>

      <div>
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

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleNextStep}
          disabled={!mobileVerified || !fullName.trim()}
          className={`flex items-center px-6 py-2 rounded-lg text-white ${
            !mobileVerified || !fullName.trim() | !email
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          } transition`}
        >
          Next <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step1BasicInfo;