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
import WebsiteSettings from "./WebsiteSettings";
import PreferencesSettings from "./PreferencesSettings";
import ZoomSettings from "./ZoomSettings";
import Email from "./EmailSettings";
import ReCaptchaV2Settings from "./RecaptchaV2";
import SocialSettings from "./SocialSettingsForm";
import DoctorVerificationForm from "./DoctorVerificationForm";
import WhatsappSettings from "./WhatsappSettings";
import TwilioSmsSettings from "./TwilioSmsSettings";
import PwaSettings from "./PwaSettings";

const tabs = [
  { id: "website", label: "Website Settings", icon: Settings },
  { id: "preferences", label: "Preferences", icon: Paintbrush },
  { id: "zoom", label: "Zoom Settings", icon: Globe },
  { id: "email", label: "Email Settings", icon: MessageCircle },
  { id: "recaptcha", label: "reCAPTCHA V2 Settings", icon: Shield },
  { id: "social", label: "Social Settings", icon: List },
  { id: "doctors", label: "Doctors Verification", icon: Shield },
  { id: "whatsapp", label: "Whatsapp Settings", icon: MessageCircle },
  { id: "twilio", label: "Twilio Sms Settings", icon: Globe },
  { id: "pwa", label: "PWA Settings", icon: List },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("website");

  return (
    <div className="flex min-h-screen bg-white rounded-lg shadow-md bg-[#f0f2f5] p-6 m-6">
      <div className="w-1/4">
        <h2 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">⚙️ Manage Settings</h2>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-2 p-2 rounded-md transition cursor-pointer ${ // Changed rounded-lg to rounded-md
                activeTab === tab.id
                  ? "bg-gray-600 text-white"
                  : "hover:bg-[#f5f5f5]"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-3/4 ml-6 mt-6 bg-white p-6">
        {activeTab === "website" && <WebsiteSettings />}
        {activeTab === "preferences" && <PreferencesSettings />}
        {activeTab === "zoom" && <ZoomSettings />}
        {activeTab === "email" && <Email />}
        {activeTab === "recaptcha" && <ReCaptchaV2Settings />}
        {activeTab === "social" && <SocialSettings />}
        {activeTab === "doctors" && <DoctorVerificationForm />}
        {activeTab === "whatsapp" && <WhatsappSettings />}
        {activeTab === "twilio" && <TwilioSmsSettings />}
        {activeTab === "pwa" && <PwaSettings />}
      </div>
    </div>
  );
}