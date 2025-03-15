
"use client";
import { useState } from "react";
import { FaPlus, FaPrint, FaHospital } from "react-icons/fa";

export default function CreatePrescription() {
  const [patient, setPatient] = useState("");
  const [drug, setDrug] = useState("");

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div
        className="bg-white p-8 rounded-lg shadow-lg border"
        style={{
          width: "794px", // A4 width
          height: "1123px", // A4 height
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Create New Prescription</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition">
            <FaPrint /> Preview
          </button>
        </div>

        {/* Doctor & Hospital Info */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold">Dr. Dheeraj Singh</h3>
            <p className="text-gray-600 text-sm">doctor1@livedoctors.in</p>
            <p className="text-gray-600 text-sm">Cardiology</p>
            <p className="text-gray-600 text-sm">MBBS, MD</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <FaHospital className="text-green-500 text-3xl" />
            <p className="text-sm font-semibold">Digambar Healthcare Center</p>
            <p className="text-xs text-gray-500">Gorakhpur, U.P. India</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-4">
          {/* Clinical Diagnosis & Patient Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Clinical Diagnosis</label>
              <input className="border p-2 rounded-md w-full" type="text" placeholder="Enter diagnosis" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Patient Name *</label>
              <div className="flex gap-2">
                <select className="border p-2 rounded-md w-full" value={patient} onChange={(e) => setPatient(e.target.value)}>
                  <option>Select Patient</option>
                </select>
                <button className="bg-gray-200 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                  <FaPlus /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Additional Advice & Drug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Additional Advice</label>
              <input className="border p-2 rounded-md w-full" type="text" placeholder="Enter advice" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Drug *</label>
              <div className="flex gap-2">
                <select className="border p-2 rounded-md w-full" value={drug} onChange={(e) => setDrug(e.target.value)}>
                  <option>Select Drug</option>
                </select>
                <button className="bg-gray-200 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                  <FaPlus /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Advice */}
          <div className="flex items-center gap-2">
            <label className="block text-sm font-semibold text-gray-700 w-20">Advice</label>
            <input className="border p-2 rounded-md flex-grow" type="text" placeholder="Enter advice" />
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-blue-600 transition">
              <FaPlus /> Add
            </button>
          </div>

          {/* Diagnosis Tests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Diagnosis Tests</label>
            <input className="border p-2 rounded-md w-full" type="text" placeholder="Enter tests" />
          </div>

          {/* Next Follow Up */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Next Follow Up</label>
              <select className="border p-2 rounded-md w-full">
                <option>Select days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">&nbsp;</label>
              <select className="border p-2 rounded-md w-full">
                <option>Select time</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Notes</label>
            <textarea className="border p-2 rounded-md w-full" rows={3} placeholder="Enter notes"></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition">
            <FaPrint /> Preview
          </button>
        </div>
      </div>
    </div>
  );
}
