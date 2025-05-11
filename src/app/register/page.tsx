"use client";
import React, { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { specialities, practiceTypes, PlanFeature, Plan } from "./constants";

import Step1BasicInfo from "./Step1BasicInfo";
import Step2ProfessionalDetails from "./Step2ProfessionalDetails";
import Step3Subscription from "./Step3Subscription";
// import Step4Security from "./components/Step4Security";

const Signup = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [mobileVerified, setMobileVerified] = useState(true); // default should be false but true for testing

  // Step 1 - Basic Info
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("8356870659");
  const [email, setEmail] = useState("");
  const [clinicName, setClinicName] = useState("");

  // OTP verification
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");

  // Step 2 - Professional Details
  const [speciality, setSpeciality] = useState("");
  const [practiceType, setPracticeType] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // Step 3 - Subscription
  const [subscriptionPlan, setSubscriptionPlan] = useState(0);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);

  // Step 4 - Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // General state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Subscription plans // TODO: get from db
// Replace your existing useEffect with this improved version
useEffect(() => {
  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching plans...");
      const response = await fetch("/api/plans");
      
      // Log the raw response for debugging
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to fetch plans");
      }
      
      const data = await response.json();
      console.log("Plans API response:", data);
      
      if (data?.success && data?.data && Array.isArray(data.data)) {
        console.log("Setting available plans:", data.data);
        // Just use the data directly without reformatting
        setAvailablePlans(data.data);
      } else {
        setError(data?.error || "Failed to fetch plans");
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  fetchPlans();
}, []);

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

  const handleSendOTP = async () => {
    setError(null);
    setLoading(true);

    if (!mobile || mobile.length < 10) {
      setError("Please enter a valid mobile number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setVerificationId(data.verificationId);
        setSuccessMessage("OTP sent to your mobile number");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP send error:", error);
      setError("An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError(null);
    setLoading(true);

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verificationId, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMobileVerified(true);
        setSuccessMessage("Mobile number verified successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const sendDataToBackend = async (finalStep = false) => {
    setError(null);
    setLoading(true);

    const userData = {
      fullName,
      mobile,
      email,
      clinicName,
      speciality,
      practiceType,
      yearsOfExperience,
      city,
      pincode,
      subscriptionPlan,
      // payment stuff and email stuff
      password: finalStep ? password : "",
      role: "doctor",
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        if (finalStep) {
          setSuccessMessage(
            data.message || "Registration successful! Redirecting..."
          );
          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = "/"; // Replace with your login page URL
          }, 2000);
        }
        return true;
      } else {
        setError(data.message || "Registration failed. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("API error:", error);
      setError("An unexpected error occurred. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    setError(null);

    // Validate Step 1
    if (currentStep === 1) {
      if (!fullName.trim()) {
        return setError("Full name is required");
      }
      if (!mobileVerified) {
        return setError("Please verify your mobile number");
      }

      // Send data to backend at Step 1
      await sendDataToBackend();
    }

    // Validate Step 2
    if (currentStep === 2) {
      if (!speciality) {
        return setError("Please select your speciality");
      }
      if (!yearsOfExperience) {
        return setError("Years of experience is required");
      }
      if (!city.trim()) {
        return setError("City is required");
      }
      if (!pincode.trim() || pincode.length !== 6) {
        return setError("Please enter a valid 6-digit pincode");
      }

      // Send data to backend at Step 2
      await sendDataToBackend();
    }

    // Validate Step 3
    if (currentStep === 3) {
      if (!subscriptionPlan) {
        return setError("Please select a subscription plan");
      }

      // Send data to backend at Step 3
      await sendDataToBackend();
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setError(null);
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to terms and conditions to proceed");
      setLoading(false);
      return;
    }

    try {
      const role = "doctor"; // Default role
      const userData = {
        fullName,
        mobile,
        email,
        clinicName,
        speciality,
        practiceType,
        yearsOfExperience,
        city,
        pincode,
        subscriptionPlan,
        role,
        password,
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201 && response.ok) {
        setSuccessMessage(
          data.message || "Registration successful! Redirecting..."
        );
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/"; // Replace with your login page URL
        }, 2000);
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

  const renderStepIndicator = () => {
    const steps = [
      "Basic Information",
      "Professional Details",
      "Subscription Plan",
      "Security",
    ];

    return (
      <div className="w-full flex mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentStep > index + 1
                  ? "bg-green-500 text-white"
                  : currentStep === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {currentStep > index + 1 ? "✓" : index + 1}
            </div>
            <div className="text-xs mt-1 text-center">{step}</div>
            {index < steps.length - 1 && (
              <div
                className={`hidden md:block h-0.5 w-full ${
                  currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                }`}
                style={{ margin: "0.5rem 0" }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-cyan-200 justify-center items-center p-3">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl flex items-center justify-center overflow-hidden">

        <div className="w-full md:w-2/3 p-6 flex items-center flex-col justify-center items-center">
          <div className="text-center w-full max-w-md mb-4">
            <Image
              src="/logo_live_doctors.png"
              alt="Live Doctors Logo"
              className="mx-auto mb-2"
              width={48}
              height={48}
            />
            <h2 className="text-2xl font-bold text-gray-800">
              Create Your Account
            </h2>
            <p className="text-gray-500 mt-1">Sign up to get started</p>
          </div>

          {renderStepIndicator()}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded w-full max-w-md mb-4">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded w-full max-w-md mb-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSignup} className="w-full max-w-md">
            {currentStep === 1 && (
              <Step1BasicInfo
                fullName={fullName}
                setFullName={setFullName}
                mobile={mobile}
                setMobile={setMobile}
                email={email}
                setEmail={setEmail}
                clinicName={clinicName}
                setClinicName={setClinicName}
                otpSent={otpSent}
                mobileVerified={mobileVerified}
                otp={otp}
                setOtp={setOtp}
                loading={loading}
                handleSendOTP={handleSendOTP}
                handleVerifyOTP={handleVerifyOTP}
                handleNextStep={handleNextStep}
              />
            )}
            {currentStep === 2 && (
              <Step2ProfessionalDetails
                speciality={speciality}
                setSpeciality={setSpeciality}
                practiceType={practiceType}
                setPracticeType={setPracticeType}
                yearsOfExperience={yearsOfExperience}
                setYearsOfExperience={setYearsOfExperience}
                city={city}
                setCity={setCity}
                pincode={pincode}
                setPincode={setPincode}
                handlePrevStep={handlePrevStep}
                handleNextStep={handleNextStep}
                specialities={specialities}
                practiceTypes={practiceTypes}
              />
            )}
            {currentStep === 3 && (
              <Step3Subscription
                availablePlans={availablePlans}
                subscriptionPlan={subscriptionPlan}
                setSubscriptionPlan={setSubscriptionPlan}
                handlePrevStep={handlePrevStep}
                handleNextStep={handleNextStep}
              />
            )}
            {/* {currentStep === 4 && (
              <Step4Security
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
                agreeTerms={agreeTerms}
                setAgreeTerms={setAgreeTerms}
                handlePrevStep={handlePrevStep}
                loading={loading}
              />
            )} */}
          </form>

          {currentStep === 1 && (
              
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/"
              className="text-blue-500 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
            )}

        </div>
      </div>
    </div>
  );
};

export default Signup;
