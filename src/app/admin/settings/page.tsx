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


const tabs = [
  { id: "website", label: "Website Settings", icon: Settings },
  { id: "preferences", label: "preferences", icon: Paintbrush },
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
    <div className="flex min-h-screen bg-white rounded-lg shadow-md bg-[#f0f2f5] p-6">
      {" "}
      {/* Light grayish background */}
      {/* Sidebar */}
      <div className="w-1/4">
        <h2 className="text-lg font-semibold mb-4">⚙️ Manage Settings</h2>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-2 p-2 rounded-lg transition ${
                activeTab === tab.id
                  ? "bg-[#e0e0e0] font-semibold"
                  : "hover:bg-[#f5f5f5]" // Lighter gray for active, slightly lighter for hover
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Content Area */}
      <div className="w-3/4 ml-6 bg-white p-6">
        {activeTab === "website" && <WebsiteSettings />}
        {activeTab === "preferences" && <PreferencesSettings />}
        {activeTab === "zoom" && <ZoomSettings />}
        {activeTab === "email" && <Email />}
        {activeTab === "recaptcha" && <Email />}
        {activeTab === "social" && <ZoomSettings />}
        {activeTab === "doctors" && <ZoomSettings />}
        {activeTab === "whatsapp" && <ZoomSettings />}
        {activeTab === "twilio" && <ZoomSettings />}
        {activeTab === "pwa" && <ZoomSettings />}
      </div>
    </div>
  );
}
