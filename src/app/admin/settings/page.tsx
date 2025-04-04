"use client";
import { useState } from "react";
import {
  Paintbrush,
  Settings,
  Shield,
  MessageCircle,
  Globe,
  List,
} from "lucide-react";

import TrialSettings from "./TrialSettings";
import PreferencesSettings from "./PreferencesSettings";
import ZoomSettings from "./ZoomSettings";
import Email from "./EmailSettings";
import ReCaptchaV2Settings from "./RecaptchaV2";
import SocialSettings from "./SocialSettingsForm";
import DoctorVerificationForm from "./DoctorVerificationForm";
import TwilioSmsSettings from "./TwilioSmsSettings";
import PwaSettings from "./PwaSettings";

const tabs = [
  { id: "trial", label: "Trial Settings", icon: Settings },
  { id: "preferences", label: "Preferences", icon: Paintbrush },
  { id: "zoom", label: "Zoom Settings", icon: Globe },
  { id: "email", label: "Email Settings", icon: MessageCircle },
  { id: "recaptcha", label: "reCAPTCHA V2 Settings", icon: Shield },
  { id: "social", label: "Social Settings", icon: List },
  { id: "doctors", label: "Doctors Verification", icon: Shield }, 
  { id: "twilio", label: "Twilio Sms Settings", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("trial");

  return (
    <div className="bg-white rounded-lg shadow-md bg-gray-50 p-4 m-4">
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
        ⚙️ Settings
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-1/4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={16} />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="md:w-3/4 bg-white p-6 rounded-md shadow-sm">
          {activeTab === "trial" && <TrialSettings />}
          {activeTab === "preferences" && <PreferencesSettings />}
          {activeTab === "zoom" && <ZoomSettings />}
          {activeTab === "email" && <Email />}
          {activeTab === "recaptcha" && <ReCaptchaV2Settings />}
          {activeTab === "social" && <SocialSettings />}
          {activeTab === "doctors" && <DoctorVerificationForm />}
          {activeTab === "twilio" && <TwilioSmsSettings />}
          {activeTab === "pwa" && <PwaSettings />}
        </main>
      </div>
    </div>
  );
}
