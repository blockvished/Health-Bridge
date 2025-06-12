"use client";
import React, { useEffect, useState } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    const fetchConsultationSettings = async () => {
      if (userId) {
        setLoading(true);
        
        try {
          const res = await fetch(
            `/api/doctor/consultation/settings/`
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
            toast.info("No existing settings found. You can configure them now.");
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            toast.error(`Failed to load consultation settings: ${err.message}`);
            console.error("Error fetching consultation settings:", err);
          } else {
            toast.error("Failed to load consultation settings. Please refresh the page.");
            console.error("Unknown error:", err);
          }        
        } finally {
          setLoading(false);
        }
      }
    };

    fetchConsultationSettings();
  }, [userId]);

  const handleConsultationFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setConsultationFee(value);
    } else {
      toast.warning("Please enter a valid consultation fee (numbers only).");
    }
  };

  const handleLiveConsultationToggle = () => {
    const newStatus = !liveConsultation;
    setLiveConsultation(newStatus);
    
    if (newStatus) {
      toast.success("Live consultation enabled!");
    } else {
      toast.info("Live consultation disabled.");
    }
  };

  const handleSaveChanges = async () => {
    if (!userId) {
      toast.error("User session expired. Please login again.");
      return;
    }

    // Validation before saving
    if (!consultationFee || parseFloat(consultationFee) <= 0) {
      toast.warning("Please enter a valid consultation fee.");
      return;
    }

    if (!meetingLink || meetingLink.trim() === "") {
      toast.warning("Please provide a meeting invitation link.");
      return;
    }

    setSaving(true);
    toast.info("Saving consultation settings...");

    try {
      const res = await fetch(`/api/doctor/consultation/settings/`, {
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
      toast.success("Consultation settings saved successfully!");
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`Failed to save settings: ${err.message}`);
        console.error("Error saving consultation settings:", err);
      } else {
        toast.error("An unexpected error occurred while saving settings.");
        console.error("Error saving consultation settings:", err);
      }
    } finally {
      setSaving(false);
    }
  };

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
                className="w-full border border-gray-300 rounded-r-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={consultationFee}
                onChange={handleConsultationFeeChange}
                placeholder="Enter consultation fee"
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
                className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={meetingOption}
                onChange={(e) => {
                  setMeetingOption(e.target.value as "google" | "zoom" | "teams");
                  toast.info(`Switched to ${e.target.value === 'google' ? 'Google Meet' : e.target.value === 'zoom' ? 'Zoom' : 'Microsoft Teams'}`);
                }}
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
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="Paste your meeting invitation link here..."
            />
          </div>

          {/* Live Consultation Toggle */}
          <div className="flex items-center">
            <div
              className="relative inline-block w-10 mr-2 align-middle cursor-pointer"
              onClick={handleLiveConsultationToggle}
            >
              <input
                type="checkbox"
                id="toggle"
                className="sr-only"
                checked={liveConsultation}
                onChange={() => {}}
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors ${
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
            disabled={saving || loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 w-fit ${
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

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light" 
      />
    </div>
  );
};

export default LiveConsultationSettings;