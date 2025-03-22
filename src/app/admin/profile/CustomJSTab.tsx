"use client";

import { useEffect, useState } from "react";

interface DoctorCustomJs {
  id: number;
  doctorId: number;
  customJs: string;
}

const CustomJSTab = ({ doctorId = 1 }) => {
  const [customJs, setCustomJs] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchCustomJs = async () => {
      try {
        const response = await fetch(`/api/doctor/customjs/${doctorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch custom JS");
        }
        const data: DoctorCustomJs = await response.json();
        setCustomJs(data.customJs || ""); 
      } catch (err) {
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomJs();
  }, [doctorId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomJs(e.target.value);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom JS
          </label>
          <textarea
            className="w-full border border-gray-300 rounded p-2 h-48 font-mono"
            value={customJs}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
};

export default CustomJSTab;
