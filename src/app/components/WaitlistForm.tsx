"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

const WaitlistForm: React.FC = () => {
  const [formData, setFormData] = useState<{ firstName: string; email: string }>({
    firstName: "",
    email: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section className="py-12 px-6 flex justify-center items-center">
      <form
        className="bg-white p-10 rounded-xl shadow-xl w-full max-w-2xl mx-auto border border-gray-300"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Join the VIP Waitlist
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg focus:ring-[#64B5F6] focus:border-[#64B5F6] transition shadow-sm"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg focus:ring-[#64B5F6] focus:border-[#64B5F6] transition shadow-sm"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold py-4 rounded-lg transition duration-300 shadow-md text-lg"
          >
            Get My Free Guide
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-600 text-center">
          By joining, you agree to our{" "}
          <a href="#" className="underline text-[#1976D2] hover:text-[#1565C0]">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" className="underline text-[#1976D2] hover:text-[#1565C0]">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </section>
  );
};

export default WaitlistForm;
