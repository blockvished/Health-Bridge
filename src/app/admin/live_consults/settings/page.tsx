"use client";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";

import { FaRupeeSign, FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const LiveConsultationSettings = () => {
  const [consultationFee, setConsultationFee] = useState("1000.00");
  const [meetingOption, setMeetingOption] = useState("Google Meet");
  const [meetingLink, setMeetingLink] = useState("https://googlemeet.com");
  const [liveConsultation, setLiveConsultation] = useState(true);
  const router = useRouter();

  return (
    <div className="max-w-lg w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-medium text-gray-800">
          Consultation Settings
        </h1>
        <button
          onClick={() => router.push("/admin/live_consults")}
          className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
        >
          <FaCalendarAlt className="mr-1" size={14} /> Consultations
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* Consultation Fees */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Consultation Fees <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <div className="bg-gray-200 flex items-center justify-center px-4 rounded-l-md border border-gray-300">
                <span className="text-gray-600">₹</span>
              </div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-r-md p-2 focus:outline-none"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
              />
            </div>
          </div>

          {/* Video Meeting Option */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Active video meeting option{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none appearance-none"
                value={meetingOption}
                onChange={(e) => setMeetingOption(e.target.value)}
              >
                <option>Google Meet</option>
                <option>Zoom</option>
                <option>Microsoft Teams</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
            <p className="text-red-500 text-xs mt-1">
              This selected video meeting option will be used for your video
              consultation with patients
            </p>
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Google Meet Invitation link{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:outline-none"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>

          {/* Live Consultation Toggle */}
          <div className="flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle">
              <input
                type="checkbox"
                id="toggle"
                className="sr-only"
                checked={liveConsultation}
                onChange={() => setLiveConsultation(!liveConsultation)}
              />
              <div
                className={`block w-10 h-6 rounded-full ${
                  liveConsultation ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  liveConsultation ? "transform translate-x-4" : ""
                }`}
              ></div>
            </div>
            <div>
              <label
                htmlFor="toggle"
                className="text-gray-700 font-medium cursor-pointer"
              >
                Live Consultation
              </label>
              <p className="text-gray-500 text-xs">
                Enable to allow patients for online consultation
              </p>
            </div>
          </div>

          {/* Save Changes Button */}

          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2 w-fit">
            <FaCheck className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveConsultationSettings;
