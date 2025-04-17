"use client"
import React, { useRef } from "react";
import { FaPrint, FaSave, FaEdit } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";

const PrescriptionPreview: React.FC = () => {
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
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow text-sm sm:text-base flex items-center gap-2">
            <FaSave /> Save & Continue
          </button>
          <button className="ml-2 bg-gray-300 px-4 py-2 rounded shadow text-sm sm:text-base flex items-center gap-2">
            <FaEdit /> Edit
          </button>
          {/* Fix for the onClick event handler */}
          <button 
            onClick={() => handlePrint()}
            className="ml-2 bg-green-600 text-white px-4 py-2 rounded shadow text-sm sm:text-base flex items-center gap-2"
          >
            <FaPrint /> Print
          </button>
        </div>
      </div>

      {/* Preview banner */}
      <div className="flex justify-center px-2 sm:px-0 mb-4">
        <div className="w-full sm:w-[210mm] border border-blue-300 bg-blue-100 p-3 text-blue-700 rounded-md text-sm sm:text-base">
          ⚠ This is a preview of your prescription. Click the Print button to print or save as PDF.
        </div>
      </div>

      {/* Container wrapper */}
      <div className="flex justify-center p-2 sm:p-10 bg-gray-100 min-h-screen">
        {/* Prescription that's visible in preview */}
        <div className="bg-white p-4 sm:p-8 shadow-lg w-full sm:w-[210mm] sm:h-[297mm] border border-gray-300">
          {/* This div will be the only content printed */}
          <div ref={prescriptionRef} className="prescription-print-content">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
              <div>
                <h3 className="text-lg font-bold">Dr. Dheeraj Singh</h3>
                <p className="text-sm sm:text-base">Cardiology</p>
                <p className="text-sm sm:text-base">MBBS, MD</p>
                <p className="text-sm sm:text-base">doctor1@livedoctors.in</p>
              </div>
              <div className="text-left sm:text-right">
                <img
                  src="/hospital_logo.png"
                  alt="Digambar Healthcare Center"
                  className="w-24 sm:w-32 h-auto"
                />
                <p className="font-semibold text-sm sm:text-base">Digambar Healthcare Center</p>
                <p className="text-sm sm:text-base">Gorakhpur, U.P. India</p>
              </div>
            </div>

            <hr className="my-4" />

            {/* Patient info section */}
            <div className="grid grid-cols-2 sm:flex justify-between text-sm mb-4 gap-2 sm:gap-0">
              <p>
                <span className="font-semibold">Name:</span> jhf
              </p>
              <p>
                <span className="font-semibold">Age:</span> 22 Years
              </p>
              <p>
                <span className="font-semibold">Weight:</span> 0 Kg
              </p>
              <p>
                <span className="font-semibold">Date:</span> 25 Mar 2025
              </p>
            </div>

            <hr className="my-4" />

            {/* Prescription content */}
            <div className="text-center mt-6 sm:mt-10">
              <p className="text-2xl font-serif">Rx</p>
              <p className="text-lg mt-4">Avil</p>
            </div>

            {/* Footer content */}
            <div className="mt-16 sm:mt-32 pt-8 border-t border-gray-200">
              <div className="text-right">
                <p className="font-semibold">Dr. Dheeraj Singh</p>
                <p className="text-sm">Signature</p>
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