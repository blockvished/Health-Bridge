"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'; // Import toZonedTime

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Patient {
  id: number;
  userId: number;
  age: number;
  weight: number;
  user?: User;
}

interface MedicationDosage {
  id: number;
  medicationId: number;
  morning?: string;
  afternoon?: string;
  evening?: string;
  night?: string;
  whenToTake?: string;
  howManyDaysToTakeMedication?: number;
  medicationFrequecyType?: string;
  note?: string;
}

interface Medication {
  id: number;
  prescriptionId: number;
  drugType?: string;
  drugName: string;
  medicationDosage: MedicationDosage[];
}

interface Prescription {
  id: number;
  patientId: number;
  doctorId: number;
  clinicId: number;
  advice?: string;
  diagnosisTests?: string;
  nextFollowUp?: number;
  nextFollowUpType?: string;
  prescriptionNotes?: string;
  createdAt: string;
  updatedAt?: string;
  medication: Medication[];
  patient?: Patient;
}

export default function Prescriptions() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch("/api/doctor/prescription/get_all");
        if (!response.ok) {
          throw new Error(`Failed to fetch prescriptions: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.prescriptions) {
          setPrescriptions(data.prescriptions);
        } else {
          setError("Invalid data format received from the API.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching prescriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      try {
        const response = await fetch(`/api/doctor/prescription/delete?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to delete prescription: ${response.status} - ${errorData?.message || 'Unknown error'}`);
        }
        setPrescriptions((prevPrescriptions) =>
          prevPrescriptions.filter((prescription) => prescription.id !== id)
        );
        alert(`Prescription with ID ${id} deleted successfully.`);
      } catch (err: any) {
        setError(err.message || "An error occurred while deleting the prescription.");
      }
    }
  };

  const handleDownload = (id: number) => {
    console.log(`Downloading prescription with ID: ${id}`);
    alert(`Downloading prescription with ID ${id} (client-side only).`);
    // In a real application, you would initiate the download from the server
  };

  const displayISTTime = (dateString: string) => {
    try {
      // Attempt to parse the date string.  parseISO handles many formats.
      const parsedDate = parseISO(dateString);
      const istDate = toZonedTime(parsedDate, 'Asia/Kolkata'); // Use toZonedTime
      return format(istDate, "PPPppp");
    } catch (error) {
      console.error("Error formatting date:", error, "Date String:", dateString);
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Loading prescriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Prescriptions
        </h3>
        <button
          className="bg-gray-400 text-white text-xs px-2 py-1 sm:text-sm sm:px-4 sm:py-2 rounded-md flex items-center hover:bg-gray-500 transition"
          onClick={() => router.push("/admin/prescription")}
        >
          <FaPlus className="mr-1 sm:mr-2" />
          Create New Prescription
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto min-w-[600px]">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="py-3 px-4 text-left border-b">#</th>
              <th className="py-3 px-4 text-left border-b">Mr. No</th>
              <th className="py-3 px-4 text-left border-b">Patient Name</th>
              <th className="py-3 px-4 text-left border-b">Phone</th>
              <th className="py-3 px-4 text-left border-b">Email</th>
              <th className="py-3 px-4 text-left border-b">Created</th>
              <th className="py-3 px-4 text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr
                key={prescription.id}
                className="hover:bg-gray-50 transition-all"
              >
                <td className="py-3 px-4 text-gray-700">{prescription.id}</td>
                <td className="py-3 px-4 text-gray-700">{prescription.patient?.id}</td>
                <td className="py-3 px-4 text-gray-700">
                  {prescription.patient?.user?.name || "N/A"}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {prescription.patient?.user?.phone || "N/A"}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {prescription.patient?.user?.email || "N/A"}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {prescription.createdAt
                    ? displayISTTime(prescription.createdAt)
                    : "N/A"}
                </td>
                <td className="py-3 px-4 text-gray-700 flex space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                    onClick={() => handleDownload(prescription.id)}
                  >
                    <FaDownload />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                    onClick={() => handleDelete(prescription.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

