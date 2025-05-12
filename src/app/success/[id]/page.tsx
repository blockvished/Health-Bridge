"use client";
import React, { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  specialities,
  practiceTypes,
  PlanFeature,
  Plan,
} from "../../register/constants";
import Step4Security from "../../register/Step4Security";

const Signup = () => {
  // Step 4 - Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(4);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // General state
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

  const sendDataToBackend = async (finalStep = false) => {
    setError(null);
    setLoading(true);

    // const userData = {
    //   fullName,
    //   mobile,
    //   email,
    //   clinicName,
    //   speciality,
    //   practiceType,
    //   yearsOfExperience,
    //   city,
    //   pincode,
    //   subscriptionPlan,
    //   billingPeriod, // Include billing period
    //   // payment stuff and email stuff
    //   password: finalStep ? password : "",
    //   role: "doctor",
    // };

    // try {
    //   const response = await fetch("/api/register", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(userData),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     if (finalStep) {
    //       setSuccessMessage(
    //         data.message || "Registration successful! Redirecting..."
    //       );
    //       // Redirect after a short delay
    //       setTimeout(() => {
    //         window.location.href = "/"; // Replace with your login page URL
    //       }, 2000);
    //     }
    //     return true;
    //   } else {
    //     setError(data.message || "Registration failed. Please try again.");
    //     return false;
    //   }
    // } catch (error: any) {
    //   console.error("API error:", error);
    //   setError("An unexpected error occurred. Please try again later.");
    //   return false;
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleNextStep = async () => {
    setError(null);

    // // Validate Step 3
    // if (currentStep === 3) {
    //   if (!subscriptionPlan) {
    //     return setError("Please select a subscription plan");
    //   }

    //   // Instead of going to the next step, initiate payment
    //   return handlePaymentInitiation();
    // }

    // setCurrentStep(currentStep + 1);
  };

  // const handleSignup = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setSuccessMessage(null);
  //   setLoading(true);

  //   // Validate passwords
  //   const passwordError = validatePassword(password);
  //   if (passwordError) {
  //     setError(passwordError);
  //     setLoading(false);
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match");
  //     setLoading(false);
  //     return;
  //   }

  //   if (!agreeTerms) {
  //     setError("Please agree to terms and conditions to proceed");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const role = "doctor"; // Default role
  //     const userData = {
  //       fullName,
  //       mobile,
  //       email,
  //       clinicName,
  //       speciality,
  //       practiceType,
  //       yearsOfExperience,
  //       city,
  //       pincode,
  //       subscriptionPlan,
  //       billingPeriod,
  //       role,
  //       password,
  //     };

  //     const response = await fetch("/api/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(userData),
  //     });

  //     const data = await response.json();

  //     if (response.status === 201 && response.ok) {
  //       setSuccessMessage(
  //         data.message || "Registration successful! Redirecting..."
  //       );
  //       // Redirect after a short delay
  //       setTimeout(() => {
  //         window.location.href = "/"; // Replace with your login page URL
  //       }, 2000);
  //     } else {
  //       setError(data.message || "Registration failed. Please try again.");
  //     }
  //   } catch (error: any) {
  //     console.error("Signup error:", error);
  //     setError("An unexpected error occurred. Please try again later.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        <div className="w-full p-6 flex items-center flex-col justify-center items-center">
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
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
