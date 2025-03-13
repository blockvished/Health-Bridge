import React from "react";
import Link from "next/link";

const Signup = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-cyan-200 justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl flex overflow-hidden">
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
        <div className="w-full md:w-2/3 p-8 flex flex-col justify-center items-center">
          <div className="text-center w-full max-w-md">
            <img
              src="/logo_live_doctors.png"
              alt="Live Doctors Logo"
              className="h-12 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">
              Create Your Account
            </h2>
            <p className="text-gray-500 mt-1">Sign up to get started</p>
          </div>
          <div className="w-full max-w-md p-4 flex flex-col justify-center">
            <div className="mt-3 space-y-2">
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Your phone number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">
                I agree to the{" "}
                <Link href="#" className="text-blue-500">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-blue-500">
                  Privacy Policy
                </Link>
                .
              </span>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg text-sm font-semibold hover:bg-blue-600 transition">
              Register
            </button>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
