"use client";
import React, { useState } from "react";
import { FaVideo, FaRupeeSign } from "react-icons/fa";
import { MdOutlineVideoCall } from "react-icons/md";
import { useRouter } from "next/navigation";

const LiveConsultationSettings = () => {
  const [consultationFee, setConsultationFee] = useState("1000.00");
  const [meetingOption, setMeetingOption] = useState("Google Meet");
  const [meetingLink, setMeetingLink] = useState("https://googlemeet.com");
  const [liveConsultation, setLiveConsultation] = useState(true);
  const router = useRouter();

  return (
    <div className="max-w-2xl w-full p-6 bg-white shadow-md rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Consultation Settings</h1>
        <button
          onClick={() => router.push("/admin/live_consults")}
          className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
        >
          <MdOutlineVideoCall className="mr-2" /> Consultations
        </button>
      </div>

      <div className="space-y-4">
        {/* Consultation Fees */}
        <div>
          <label className="block text-gray-700 font-medium">Consultation Fees *</label>
          <div className="flex items-center border rounded-md p-2 mt-1 bg-gray-100">
            <FaRupeeSign className="text-gray-600 mr-2" />
            <input
              type="text"
              className="w-full bg-transparent focus:outline-none"
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
            />
          </div>
        </div>

        {/* Video Meeting Option */}
        <div>
          <label className="block text-gray-700 font-medium">Active Video Meeting Option *</label>
          <select
            className="mt-1 w-full p-2 border rounded-md bg-gray-100 focus:outline-none"
            value={meetingOption}
            onChange={(e) => setMeetingOption(e.target.value)}
          >
            <option>Google Meet</option>
            <option>Zoom</option>
            <option>Microsoft Teams</option>
          </select>
          <p className="text-red-500 text-sm mt-1">This selected video meeting option will be used for your video consultation with patients</p>
        </div>

        {/* Meeting Link */}
        <div>
          <label className="block text-gray-700 font-medium">Google Meet Invitation Link *</label>
          <textarea
            className="mt-1 w-full p-2 border rounded-md bg-gray-100 focus:outline-none"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
        </div>

        {/* Live Consultation Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="accent-blue-500"
            checked={liveConsultation}
            onChange={() => setLiveConsultation(!liveConsultation)}
          />
          <span className="text-gray-700">Enable Live Consultation</span>
        </div>

        {/* Save Changes Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default LiveConsultationSettings;