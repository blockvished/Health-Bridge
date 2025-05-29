"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { ChevronRight, AlertCircle } from "lucide-react";

// Link mapping
const UNAVAILABLE_DATA_LINKS: Record<string, string> = {
  doctorVerificationPage: "/doctor/settings/verification",
  doctorInfoPage: "/doctor/profile",
  doctorEduPage: "/doctor/educations",
  doctorExpPage: "/doctor/experiences",
  doctorSchedulePage: "/doctor/settings/set-schedule",
  doctorConsultDetailPage: "/doctor/settings/live_consults",
  doctorClinicPage: "/doctor/chamber",
};

// Label mapping
const UNAVAILABLE_DATA_LABELS: Record<string, string> = {
  doctorVerificationPage: "Verify your account",
  doctorInfoPage: "Update Doctor Information",
  doctorEduPage: "Update educations",
  doctorExpPage: "Update experiences",
  doctorSchedulePage: "Update schedule for patients",
  doctorConsultDetailPage: "Update consultation details",
  doctorClinicPage: "Update clinic Information",
};

export default function DoctorInfoModal() {
  const [showModal, setShowModal] = useState(false);
  const [unavailablePages, setUnavailablePages] = useState<string[]>([]);

  useEffect(() => {
    const fetchUnavailableData = async () => {
      try {
        const res = await fetch("/api/doctor/unavailable-data");
        const data = await res.json();

        const missing = Object.entries(data)
          .filter(([, value]) => value === true)
          .map(([key]) => key);

        if (missing.length > 0) {
          setUnavailablePages(missing);
          setShowModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch unavailable doctor data", error);
      }
    };

    fetchUnavailableData();
  }, []);

  if (!showModal) return null;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-md">
        <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Complete Your Profile
        </DialogTitle>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please complete the following missing information to activate all features:
          </p>
          
          <div className="space-y-2">
            {unavailablePages.map((key, index) => (
              <Link
                key={key}
                href={UNAVAILABLE_DATA_LINKS[key]}
                className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200"
                onClick={() => setShowModal(false)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                    {UNAVAILABLE_DATA_LABELS[key]}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Complete all items to unlock your full doctor profile
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}