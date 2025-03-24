"use client";
import { useState } from "react";
import { FaPlus, FaPrint, FaHospital } from "react-icons/fa";

export default function CreatePrescription() {
  const [patient, setPatient] = useState("");
  const [drug, setDrug] = useState("");

  return (
    <div className="p-4 min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Create New Prescription</h2>
        </div>

        {/* Doctor & Hospital Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Dr. Dheeraj Singh</h3>
            <p className="text-gray-600 text-sm">doctor1@livedoctors.in</p>
            <p className="text-gray-600 text-sm">Cardiology</p>
            <p className="text-gray-600 text-sm">MBBS, MD</p>
          </div>
          <div className="text-left md:text-right flex flex-col items-start md:items-end mt-4 md:mt-0">
            <FaHospital className="text-green-500 text-3xl md:text-4xl" />
            <p className="text-sm font-semibold">Digambar Healthcare Center</p>
            <p className="text-xs text-gray-500">Gorakhpur, U.P. India</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Clinical Diagnosis</label>
              <input className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Enter diagnosis" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Patient Name *</label>
              <div className="flex gap-3">
                <select className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={patient} onChange={(e) => setPatient(e.target.value)}>
                  <option>Select Patient</option>
                </select>
                <button className="bg-gray-200 px-3 py-2 rounded-md text-sm flex items-center gap-1 hover:bg-gray-300 transition">
                  <FaPlus /> Add
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Additional Advice</label>
              <input className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Enter advice" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Drug *</label>
              <div className="flex gap-3">
                <select className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={drug} onChange={(e) => setDrug(e.target.value)}>
                  <option>Select Drug</option>
                </select>
                <button className="bg-gray-200 px-3 py-2 rounded-md text-sm flex items-center gap-1 hover:bg-gray-300 transition">
                  <FaPlus /> Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <label className="block text-sm font-semibold text-gray-700 md:w-24">Advice</label>
            <input className="border border-gray-300 p-3 rounded-md flex-grow bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Enter advice" />
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md text-sm flex items-center gap-1 hover:bg-blue-600 transition">
              <FaPlus /> Add
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Diagnosis Tests</label>
            <input className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Enter tests" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Next Follow Up</label>
              <select className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Time</label>
              <select className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select time</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Notes</label>
            <textarea className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} placeholder="Enter notes"></textarea>
          </div>
        </div>
      </div>

      {/* Preview Button */}
      <div className="fixed bottom-6 right-6 md:top-1/4 md:right-0 md:transform md:-translate-y-1/2 md:mr-6">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-blue-600 transition duration-300">
          <FaPrint /> Preview
        </button>
      </div>
    </div>
  );
}
