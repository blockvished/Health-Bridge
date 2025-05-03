"use client";
import React, { useEffect, useState } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa";
// import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LiveConsultationSettings = () => {
  const [consultationFee, setConsultationFee] = useState<string>("");
  const [meetingOption, setMeetingOption] = useState<
    "google" | "zoom" | "teams"
  >("google");
  const [meetingLink, setMeetingLink] = useState<string | undefined>("");
  const [liveConsultation, setLiveConsultation] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false); // New state for saving status
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    const fetchConsultationSettings = async () => {
      if (userId) {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `/api/doctor/consultation/settings/${userId}`
          );
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              `Failed to fetch settings: ${res.status} - ${
                errorData?.message || res.statusText
              }`
            );
          }
          const data = await res.json();
          if (data?.consultationSettings?.length > 0) {
            const settings = data.consultationSettings[0];
            setConsultationFee(String(settings.consultationFees || ""));
            setMeetingOption(settings.mode || "google");
            setMeetingLink(settings.consultationLink || "");
            setLiveConsultation(settings.isLiveConsultationEnabled || false);
          } else {
            setConsultationFee("");
            setMeetingLink("");
            setLiveConsultation(false);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
            console.error("Error fetching consultation settings:", err);
          } else {
            setError("An unknown error occurred");
            console.error("Unknown error:", err);
          }        
        } finally {
          setLoading(false);
        }
      }
    };

    fetchConsultationSettings();
  }, [userId]);

  const handleSaveChanges = async () => {
    if (!userId) {
      setError("User ID not found.");
      return;
    }

    setSaving(true); // Set saving to true when the process starts
    setError(null);

    try {
      const res = await fetch(`/api/doctor/consultation/settings/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultationFees: parseFloat(consultationFee || "0"),
          mode: meetingOption,
          consultationLink: meetingLink,
          liveConsultation: liveConsultation,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Failed to save settings: ${res.status} - ${
            errorData?.message || res.statusText
          }`
        );
      }

      const data = await res.json();
      console.log("Consultation settings saved:", data);
      // Optionally show a success message to the user
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Error saving consultation settings:", err);
      } else {
        setError("An unexpected error occurred while saving consultation settings.");
        console.error("Error saving consultation settings:", err);
      }
    } finally {
      setSaving(false); // Set saving back to false after completion (success or error)
    }
  }

  if (error) {
    return (
      <div className="max-w-lg w-full p-4 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="max-w-lg w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-medium text-gray-800">
          Consultation Settings
        </h1>
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
                onChange={(e) =>
                  setMeetingOption(
                    e.target.value as "google" | "zoom" | "teams"
                  )
                }
              >
                <option value="google">Google Meet</option>
                <option value="zoom">Zoom</option>
                <option value="teams">Microsoft Teams</option>
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
              Meeting Invitation link <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:outline-none"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>

          {/* Live Consultation Toggle */}
          <div className="flex items-center">
            <div
              className="relative inline-block w-10 mr-2 align-middle cursor-pointer"
              onClick={() => setLiveConsultation(!liveConsultation)}
            >
              <input
                type="checkbox"
                id="toggle"
                className="sr-only"
                checked={liveConsultation}
                onChange={() => {}}
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
          <button
            onClick={handleSaveChanges}
            disabled={saving || loading} // Disable when saving or loading
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2 w-fit ${
              saving || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin w-4 h-4" /> Saving...
              </>
            ) : (
              <>
                <FaCheck className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveConsultationSettings;