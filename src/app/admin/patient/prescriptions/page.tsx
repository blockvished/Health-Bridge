"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaEye,
  FaPrint,
  FaHospital,
} from "react-icons/fa";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useReactToPrint } from "react-to-print";
import Cookies from "js-cookie";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Clinic {
  id: number;
  name: string;
  imageLink?: string;
  address?: string;
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
  clinic: Clinic;
  doctor: Doctor;
}

interface PrescriptionPreviewProps {
  prescription: Prescription | null;
  onClose: () => void;
  doctor: Doctor;
  clinic: Clinic;
}

// Preview Modal Component
const PrescriptionPreview: React.FC<PrescriptionPreviewProps> = ({
  prescription,
  onClose,
  doctor,
  clinic,
}) => {
  const prescriptionRef = useRef<HTMLDivElement>(null);

  if (!prescription) return null;

  const formatMedicationDosage = (dosage: MedicationDosage) => {
    return {
      morning: dosage.morning || "0",
      afternoon: dosage.afternoon || "0",
      evening: dosage.evening || "0",
      night: dosage.night || "0",
      mealTime: dosage.whenToTake || "After meals",
      durationValue: dosage.howManyDaysToTakeMedication || 0,
      durationUnit: dosage.medicationFrequecyType || "days",
      note: dosage.note || "",
    };
  };

  const formatMedications = (medications: Medication[]) => {
    return medications.map((med) => ({
      type: med.drugType || "",
      name: med.drugName,
      dosages: med.medicationDosage.map(formatMedicationDosage),
    }));
  };

  const drugs = formatMedications(prescription.medication);
  const diagnosticTests = prescription.diagnosisTests || "";
  const advices = prescription.advice || "";
  const notes = prescription.prescriptionNotes || "";
  const nextFollowUp = prescription.nextFollowUp || "";
  const followUpDuration = prescription.nextFollowUpType || "days";

  const handlePrint = useReactToPrint({
    documentTitle: "Prescription",
    onBeforePrint: async () => {
      // Add print-specific styles if needed
      const style = document.createElement("style");
      style.id = "print-specific-styles";
      style.innerHTML = `
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .prescription-print-content {
            padding: 20px !important;
            font-size: 12pt !important;
          }
          .prescription-print-content hr {
            margin: 15px 0 !important;
          }
          .prescription-print-content .medication-item {
            margin-bottom: 10px !important;
          }
          .prescription-print-content .dosage-item {
            margin: 5px 0 !important;
            padding-left: 20px !important;
          }
        }
      `;
      document.head.appendChild(style);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      // Clean up print-specific styles
      const style = document.getElementById("print-specific-styles");
      if (style) document.head.removeChild(style);
      console.log("Printed successfully");
    },
    contentRef: prescriptionRef,
  });

  return (
    <div className="bg-opacity-50 bg-gray-100 flex justify-center items-start z-50 overflow-y-auto min-h-screen w-full">
      <div className="rounded-lg shadow-lg w-full max-w-5xl my-8">
        {/* Control buttons */}
        <div className="flex flex-wrap items-center justify-between rounded-t-lg bg-white">
          <h3 className="font-bold text-lg p-4 text-gray-800">
            Prescription Preview
          </h3>
          <div className="flex flex-wrap items-center gap-2 p-4">
            <button
              onClick={() => handlePrint()}
              className="bg-green-600 text-white px-4 py-2 rounded shadow text-sm sm:text-base flex items-center gap-2 cursor-pointer"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow text-sm sm:text-base cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Prescription content */}
        <div className="flex justify-center p-2 sm:p-10">
          <div className="bg-white p-4 sm:p-8 shadow-lg w-full sm:w-[210mm] sm:h-[297mm] border border-gray-300">
            {/* This div will be the only content printed */}
            <div ref={prescriptionRef} className="prescription-print-content">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-4 sm:gap-0">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{doctor.name}</h3>
                  <p className="text-sm sm:text-base">
                    {doctor.specialization}
                  </p>
                  <p className="text-sm sm:text-base">{doctor.degree}</p>
                  <p className="text-sm sm:text-base">{doctor.email}</p>
                </div>
                <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                  {clinic?.imageLink ? (
                    <img
                      src={clinic.imageLink}
                      alt={clinic.name || "Clinic Image"}
                      className="w-24 h-16 rounded-md object-cover mb-1"
                    />
                  ) : (
                    <FaHospital className="text-green-500 text-4xl mb-1" />
                  )}
                  <p className="font-semibold text-sm sm:text-base">
                    {clinic?.name || "Medical Clinic"}
                  </p>
                  <p className="text-sm sm:text-base">
                    {clinic?.address || "Address not available"}
                  </p>
                </div>
              </div>

              <hr className="my-4" />

              {/* Patient info section */}
              <div className="grid grid-cols-2 sm:flex justify-between text-sm mb-4 gap-2 sm:gap-0">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {prescription.patient?.user?.name || "Patient Name"}
                </p>
                <p>
                  <span className="font-semibold">Age:</span>{" "}
                  {prescription.patient?.age || "N/A"} Years
                </p>
                <p>
                  <span className="font-semibold">Weight:</span>{" "}
                  {prescription.patient?.weight || "N/A"} Kg
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {prescription.createdAt
                    ? format(parseISO(prescription.createdAt), "dd MMM yyyy")
                    : new Date().toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                </p>
              </div>

              <hr className="my-4" />

              {/* Prescription content */}
              <div className="flex">
                {/* Left sidebar for diagnostic tests, advices, and notes */}
                <div className="w-1/3 pr-4 border-r border-gray-200">
                  {/* Diagnostic Tests Section */}
                  {diagnosticTests && (
                    <div className="mb-6">
                      <h3 className="font-bold text-sm sm:text-base">
                        Diagnostic Tests:
                      </h3>
                      <p className="text-sm whitespace-pre-wrap">
                        {diagnosticTests}
                      </p>
                    </div>
                  )}

                  {/* Advice Section */}
                  {advices && (
                    <div className="mb-6">
                      <h3 className="font-bold text-sm sm:text-base">
                        Advice:
                      </h3>
                      <p className="text-sm whitespace-pre-wrap">{advices}</p>
                    </div>
                  )}

                  {/* Notes Section */}
                  {notes && (
                    <div className="mb-6">
                      <h3 className="font-bold text-sm sm:text-base">Notes:</h3>
                      <p className="text-sm whitespace-pre-wrap">{notes}</p>
                    </div>
                  )}
                  {nextFollowUp && (
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">
                        Next Follow up:
                      </h3>
                      <p className="text-sm whitespace-pre-wrap">
                        {nextFollowUp} {followUpDuration} later
                      </p>
                    </div>
                  )}
                </div>

                {/* Right side for medications */}
                <div className="w-2/3 pl-4">
                  <div className="text-center">
                    <p className="text-2xl font-serif">Rx</p>
                  </div>

                  {drugs && drugs.length > 0 ? (
                    <div className="mt-3">
                      {drugs.map((drug, index) => (
                        <div key={`drug-${index}`} className="mt-4">
                          <p className="text-md">
                            <span className="text-sm">
                              {drug.type &&
                                drug.type.charAt(0).toUpperCase() +
                                  drug.type.slice(1).toLowerCase()}
                            </span>
                            <strong> {drug.name}</strong>
                          </p>

                          {drug.dosages.map((dosage, dosageIndex) => (
                            <div
                              key={`dosage-${index}-${dosageIndex}`}
                              className="text-sm"
                            >
                              {dosageIndex > 0 && (
                                <strong className="mr-2">then</strong>
                              )}
                              {dosage.morning} + {dosage.afternoon} +{" "}
                              {dosage.evening} + {dosage.night} ---
                              <em> {dosage.mealTime} </em>
                              <span>
                                --- ( {dosage.durationValue}{" "}
                                {dosage.durationUnit} )
                              </span>
                              <div> {dosage.note} </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              {/* Footer content */}
              <div className="mt-16 sm:mt-32 pt-8 border-t border-gray-200">
                <div className="text-right">
                  {doctor.signatureImage ? (
                    <img
                      src={doctor.signatureImage}
                      alt={`${"doctorName"}'s signature`}
                      className="h-16 inline-block mb-2"
                      style={{ maxWidth: "200px", objectFit: "contain" }}
                    />
                  ) : (
                    <p className="text-sm">Signature</p>
                  )}
                  <p className="font-semibold">{doctor.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface Doctor {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  degree: string;
  signatureImage: string;
}

export default function Prescriptions() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  // Doctor info fetch
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/patient/prescriptions`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          if (data.doctor) {
            setDoctorData({
              name: data.doctor.name || "",
              email: data.doctor.email || "",
              phone: data.doctor.phone || "",
              specialization: data.doctor.specialization || "",
              degree: data.doctor.degree || "",
              signatureImage: data.doctor.signature_link || "",
            });
          }
        } else {
          console.error("Failed to fetch doctor data");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, [userId]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch("/api/patient/prescriptions");
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
        setError(
          err.message || "An error occurred while fetching prescriptions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handlePreview = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowPreview(true);
  };

  const closePreview = () => {
    setSelectedPrescription(null);
    setShowPreview(false);
  };

  const displayISTTime = (dateString: string) => {
    try {
      const parsedDate = parseISO(dateString);
      const istDate = toZonedTime(parsedDate, "Asia/Kolkata");
      return format(istDate, "PPPppp");
    } catch (error) {
      console.error(
        "Error formatting date:",
        error,
        "Date String:",
        dateString
      );
      return "Invalid Date";
    }
  };

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Show prescription preview when a prescription is selected
  if (showPreview && selectedPrescription) {
    return (
      <PrescriptionPreview
        prescription={selectedPrescription}
        onClose={closePreview}
        doctor={selectedPrescription.doctor}
        clinic={selectedPrescription.clinic}
      />
    );
  }

  // Otherwise show the prescriptions list
  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Prescriptions
        </h3>
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
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <tr
                  key={prescription.id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="py-3 px-4 text-gray-700">{prescription.id}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {prescription.patient?.id || "N/A"}
                  </td>
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
                  <td className="py-3 px-4 text-gray-700 flex space-x-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer"
                      onClick={() => handlePreview(prescription)}
                      title="Preview Prescription"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : loading ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  Loading prescriptions...
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No prescriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
