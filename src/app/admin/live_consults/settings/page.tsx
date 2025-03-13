"use client";
import React, { useState } from "react";

const LiveConsultationSettings = () => {
  const [consultationFee, setConsultationFee] = useState("1000.00");
  const [meetingOption, setMeetingOption] = useState("Google Meet");
  const [meetingLink, setMeetingLink] = useState("https://googlemeet.com");
  const [liveConsultation, setLiveConsultation] = useState(true);

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-4xl mx-auto w-full p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Consultation Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Consultation Fees *</label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded-md"
            value={consultationFee}
            onChange={(e) => setConsultationFee(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Active Video Meeting Option *</label>
          <select
            className="mt-1 w-full p-2 border rounded-md"
            value={meetingOption}
            onChange={(e) => setMeetingOption(e.target.value)}
          >
            <option>Google Meet</option>
            <option>Zoom</option>
            <option>Microsoft Teams</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Google Meet Invitation Link *</label>
          <textarea
            className="mt-1 w-full p-2 border rounded-md"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={liveConsultation}
            onChange={() => setLiveConsultation(!liveConsultation)}
          />
          <span className="text-gray-700">Enable Live Consultation</span>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default LiveConsultationSettings;