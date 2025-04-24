"use client";
import React, { useState, useEffect } from 'react';
import { FaEye } from "react-icons/fa";

interface Prescription {
  prescriptionId: number;
  advice: string;
  diagnosisTests: string;
  nextFollowUp: number;
  nextFollowUpType: string;
  prescriptionNotes: string;
  createdAt: string;
  patientId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: number;
  doctorName: string;
  doctorEmail: string;
  doctorPhone: string;
  clinicName: string;
  clinicAddress: string;
}

export default function PrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch('/api/patient/prescriptions');
        if (!response.ok) {
          throw new Error(`Failed to fetch prescriptions: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.prescriptions) {
          setPrescriptions(data.prescriptions);
        } else {
            setPrescriptions([]); // set to empty array if data.prescriptions is undefined/null
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching prescriptions.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-4">
          <p>Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-4 text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Prescriptions</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3">#</th>
                <th className="p-3">Mr. No</th>
                <th className="p-3">Doctor Info</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Created</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {prescriptions.length > 0 ? (
                prescriptions.map((prescription, index) => (
                  <tr
                    key={prescription.prescriptionId}
                    className="border-b last:border-none text-gray-700"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium text-blue-600">
                      {prescription.patientId}
                    </td>
                    <td className="p-3 font-semibold">{prescription.doctorName}</td>
                    <td className="p-3">{prescription.doctorPhone}</td>
                    <td className="p-3">{prescription.doctorEmail}</td>
                    <td className="p-3">{new Date(prescription.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button className="p-2 bg-blue-600 text-white rounded-md">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-gray-500">No prescriptions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
