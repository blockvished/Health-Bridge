"use client";
import React, { useRef } from "react";
import {
  FaPrint,
  FaSave,
  FaEdit,
  FaArrowLeft,
  FaHospital,
} from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { Drug, Dosage } from "./DrugEntry";

interface PrescriptionPreviewProps {
  setTogglePreview: React.Dispatch<React.SetStateAction<boolean>>;
  doctorName?: string;
  doctorSpecialization?: string;
  doctorDegree?: string;
  doctorEmail?: string;
  signatureImage?: string;
  patient?: {
    name: string;
    age: number;
    weight: number;
  };
  advices?: string;
  diagnosticTests?: string;
  notes?: string;
  drugs?: Drug[];
  nextFollowUp: string;
  followUpDuration: string;
  activeClinic: Clinic | undefined;
}
interface Clinic {
  id: number;
  name: string;
  location: string;
  appointmentLimit: number;
  active: boolean;
  // Assuming your API response includes these fields
  imageLink?: string;
  department?: string; // Add department here if it's in your API response
  title?: string; // Add title here if it's in your API response
  address?: string; // Add address here if it's in your API response
}

const PrescriptionPreview: React.FC<PrescriptionPreviewProps> = ({
  setTogglePreview,
  doctorName,
  doctorSpecialization,
  doctorDegree,
  doctorEmail,
  signatureImage,
  patient,
  advices,
  diagnosticTests,
  notes,
  drugs,
  nextFollowUp,
  followUpDuration,
  activeClinic,
}) => {
  const prescriptionRef = useRef<HTMLDivElement>(null);

  // Fix for TypeScript issues
  const handlePrint = useReactToPrint({
    documentTitle: "Prescription",
    onAfterPrint: () => console.log("Printed successfully"),
    // This is the correct way to specify what to print
    contentRef: prescriptionRef,
  });

  return (
    <div className="prescription-container">
      {/* Control buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center my-4 gap-2 sm:gap-0">
        <h2 className="text-xl font-semibold">Prescription Preview</h2>
        <div className="flex">
          <button
            className="bg-gray-300 px-4 py-2 rounded shadow text-sm sm:text-base flex items-center gap-2 cursor-pointer"
            onClick={() => setTogglePreview((prev) => !prev)}
          >
            <FaArrowLeft /> Edit
          </button>
          <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded shadow text-sm sm:text-base flex items-center gap-2 cursor-pointer">
            <FaSave /> Save & Continue
          </button>
          {/* Fix for the onClick event handler */}
          <button
            onClick={() => handlePrint()}
            className="ml-2 bg-green-600 text-white px-4 py-2 rounded shadow text-sm sm:text-base flex items-center gap-2 cursor-pointer"
          >
            <FaPrint /> Print
          </button>
        </div>
      </div>

      {/* Preview banner */}
      <div className="flex justify-center px-2 sm:px-0 mb-4">
        <div className="w-full sm:w-[210mm] border border-blue-300 bg-blue-100 p-3 text-blue-700 rounded-md text-sm sm:text-base">
          ⚠ This is a preview of your prescription. Click the Print button to
          print or save as PDF.
        </div>
      </div>

      {/* Container wrapper */}
      <div className="flex justify-center p-2 sm:p-10 bg-gray-100 min-h-screen">
        {/* Prescription that's visible in preview */}
        <div className="bg-white p-4 sm:p-8 shadow-lg w-full sm:w-[210mm] sm:h-[297mm] border border-gray-300">
          {/* This div will be the only content printed */}
          <div ref={prescriptionRef} className="prescription-print-content">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-4 sm:gap-0">
              <div className="flex-1">
                <h3 className="text-lg font-bold">{doctorName}</h3>
                <p className="text-sm sm:text-base">{doctorSpecialization}</p>
                <p className="text-sm sm:text-base">{doctorDegree}</p>
                <p className="text-sm sm:text-base">{doctorEmail}</p>
              </div>
              <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                {activeClinic?.imageLink ? (
                  <img
                    src={activeClinic?.imageLink}
                    alt={activeClinic?.name || "Clinic Image"}
                    className="w-24 h-16 rounded-md object-cover mb-1"
                  />
                ) : (
                  <FaHospital className="text-green-500 text-4xl mb-1" />
                )}
                <p className="font-semibold text-sm sm:text-base">
                  {activeClinic?.name}
                </p>
                <p className="text-sm sm:text-base">{activeClinic?.address}</p>
              </div>
            </div>

            <hr className="my-4" />

            {/* Patient info section */}
            <div className="grid grid-cols-2 sm:flex justify-between text-sm mb-4 gap-2 sm:gap-0">
              <p>
                <span className="font-semibold">Name:</span> {patient?.name}
              </p>
              <p>
                <span className="font-semibold">Age:</span> {patient?.age} Years
              </p>
              <p>
                <span className="font-semibold">Weight:</span> {patient?.weight}{" "}
                Kg
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date().toLocaleDateString("en-GB", {
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
                    <h3 className="font-bold mb-2 text-sm sm:text-base">
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
                    <h3 className="font-bold mb-2 text-sm sm:text-base">
                      Advice:
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">{advices}</p>
                  </div>
                )}

                {/* Notes Section */}
                {notes && (
                  <div>
                    <h3 className="font-bold mb-2 text-sm sm:text-base">
                      Notes:
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">{notes}</p>
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
                          <strong>{drug.name}</strong>
                          <span className="text-sm">
                            {drug.type && `- ( ${drug.type} )`}
                          </span>
                        </p>

                        {drug.dosages.map((dosage, dosageIndex) => (
                          <div
                            key={`dosage-${index}-${dosageIndex}`}
                            className="text-sm"
                          >
                            {dosageIndex > 0 && (
                              <strong className="mr-2">then</strong>
                            )}
                            {dosage.morning} + {dosage.afternoon} +
                            {dosage.evening} + {dosage.night} ---
                            <em> {dosage.mealTime} </em>
                            <span>
                              --- ( {dosage.durationValue} {dosage.durationUnit}{" "}
                              )
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
                {nextFollowUp && (
                  <div className="mt-6 sm:mt-10">
                    <strong>Next Follow up:</strong>
                    <span className="text-md text-center">
                      {nextFollowUp} {followUpDuration} later
                    </span>
                  </div>
                )}
              </div>

              <></>
            </div>
            {/* Footer content */}
            <div className="mt-16 sm:mt-32 pt-8 border-t border-gray-200">
              <div className="text-right">
                {signatureImage ? (
                  <img
                    src={signatureImage}
                    alt={`${doctorName}'s signature`}
                    className="h-16 inline-block mb-2"
                    style={{ maxWidth: "200px", objectFit: "contain" }}
                  />
                ) : (
                  <p className="text-sm">Signature</p>
                )}
                <p className="font-semibold">{doctorName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add print-specific styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .prescription-print-content,
          .prescription-print-content * {
            visibility: visible;
          }
          .prescription-print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 1cm;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PrescriptionPreview;
