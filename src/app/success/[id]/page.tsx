"use client";
import React, { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import Step4Security from "../../register/Step4Security";

const Signup = () => {
  // Step 4 - Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(4);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
