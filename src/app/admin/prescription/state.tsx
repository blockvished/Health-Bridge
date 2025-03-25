"use client";

import { useState } from "react";
import { FaHospital, FaPlus, FaPrint, FaTimes } from "react-icons/fa";

// Define types for our state
type Dosage = {
  id: number;
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
  durationValue: string;
  durationUnit: string;
  mealTime: string;
  note: string;
};

type Drug = {
  id: number;
  name: string;
  dosages: Dosage[];
};

type PrescriptionState = {
  patient: string;
  clinicalDiagnosis: string;
  additionalAdvice: string;
  advice: string;
  diagnosisTests: string;
  nextFollowUp: string;
  followUpDuration: string;
  notes: string;
  drugs: Drug[];
};

function DrugEntry({ 
  drug, 
  onRemove, 
  isRemovable, 
  bgColor, 
  onDrugChange 
}: { 
  drug: Drug;
  onRemove: () => void; 
  isRemovable: boolean; 
  bgColor: string;
  onDrugChange: (updatedDrug: Drug) => void;
}) {
  const addDosage = () => {
    const newDosage: Dosage = {
      id: Date.now(),
      morning: "0",
      afternoon: "0",
      evening: "0",
      night: "0",
      durationValue: "1",
      durationUnit: "Days",
      mealTime: "Before/After Meal",
      note: ""
    };
    onDrugChange({
      ...drug,
      dosages: [...drug.dosages, newDosage]
    });
  };

  const removeDosage = (id: number) => {
    onDrugChange({
      ...drug,
      dosages: drug.dosages.filter(d => d.id !== id)
    });
  };

  const updateDosage = (id: number, field: keyof Dosage, value: string) => {
    onDrugChange({
      ...drug,
      dosages: drug.dosages.map(dosage => 
        dosage.id === id ? { ...dosage, [field]: value } : dosage
      )
    });
  };

  return (
    <div className={`p-2 flex flex-col gap-3 relative ${bgColor}`}>
      {isRemovable && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <FaTimes />
        </button>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        <select 
          className="border border-gray-300 p-2 w-1/3 min-w-[200px]"
          value={drug.name}
          onChange={(e) => onDrugChange({ ...drug, name: e.target.value })}
        >
          <option value="">Select Drug</option>
          <option value="Avil">Avil</option>
          {/* Add more drug options here */}
        </select>
      </div>

      {drug.dosages.map((dosage, index) => (
        <div key={dosage.id} className="flex flex-col gap-2 rounded">
          <div className="flex flex-nowrap gap-2">
            {["morning", "afternoon", "evening", "night"].map((time) => (
              <select
                key={time}
                className="border border-gray-300 p-2 rounded-md w-1/4"
                value={dosage[time as keyof Dosage]}
                onChange={(e) => updateDosage(dosage.id, time as keyof Dosage, e.target.value)}
              >
                {[
                  "0",
                  "½",
                  "1",
                  "2",
                  "3",
                  "4",
                  "0.5 ml",
                  "1 ml",
                  "2 ml",
                  "3 ml",
                  "4 ml",
                  "5 ml",
                ].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <div className="flex w-full md:w-auto gap-2">
              <select 
                className="border border-gray-300 p-2 rounded-md flex-1"
                value={dosage.durationValue}
                onChange={(e) => updateDosage(dosage.id, 'durationValue', e.target.value)}
              >
                {[...Array(31).keys()].map((num) => (
                  <option key={num} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>

              <select 
                className="border border-gray-300 p-2 rounded-md flex-1"
                value={dosage.durationUnit}
                onChange={(e) => updateDosage(dosage.id, 'durationUnit', e.target.value)}
              >
                <option value="Days">Days</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </select>
            </div>

            <select 
              className="border border-gray-300 p-2 rounded-md flex-1 w-full md:w-auto"
              value={dosage.mealTime}
              onChange={(e) => updateDosage(dosage.id, 'mealTime', e.target.value)}
            >
              <option value="Before/After Meal">Before/After Meal</option>
              <option value="Before Meal">Before Meal</option>
              <option value="After Meal">After Meal</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter Note"
              className="border border-gray-300 p-2 rounded-md flex-1"
              value={dosage.note}
              onChange={(e) => updateDosage(dosage.id, 'note', e.target.value)}
            />

            {index !== 0 && (
              <button
                onClick={() => removeDosage(dosage.id)}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-red-100 text-red-700 hover:bg-red-200"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={addDosage}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
      >
        <FaPlus /> Add Dosage
      </button>
    </div>
  );
}

export default function CreatePrescription() {
  const [prescription, setPrescription] = useState<PrescriptionState>({
    patient: "",
    clinicalDiagnosis: "",
    additionalAdvice: "",
    advice: "",
    diagnosisTests: "",
    nextFollowUp: "",
    followUpDuration: "Days",
    notes: "",
    drugs: [{
      id: 0,
      name: "",
      dosages: [{
        id: 0,
        morning: "0",
        afternoon: "0",
        evening: "0",
        night: "0",
        durationValue: "1",
        durationUnit: "Days",
        mealTime: "Before/After Meal",
        note: ""
      }]
    }]
  });

  const addDrugEntry = () => {
    setPrescription(prev => ({
      ...prev,
      drugs: [
        ...prev.drugs,
        {
          id: Date.now(),
          name: "",
          dosages: [{
            id: Date.now() + 1,
            morning: "0",
            afternoon: "0",
            evening: "0",
            night: "0",
            durationValue: "1",
            durationUnit: "Days",
            mealTime: "Before/After Meal",
            note: ""
          }]
        }
      ]
    }));
  };

  const removeDrugEntry = (id: number) => {
    setPrescription(prev => ({
      ...prev,
      drugs: prev.drugs.filter(d => d.id !== id)
    }));
  };

  const updateDrug = (id: number, updatedDrug: Drug) => {
    setPrescription(prev => ({
      ...prev,
      drugs: prev.drugs.map(drug => drug.id === id ? updatedDrug : drug)
    }));
  };

  const handleInputChange = (field: keyof PrescriptionState, value: string) => {
    setPrescription(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreview = () => {
    console.log("Prescription data:", prescription);
    // Here you would typically send the data to an API or open a preview modal
  };

  return (
    <div className="p-4 min-h-screen md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Create New Prescription
        </h2>
      </div>
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-6xl">
        {/* Doctor Info */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Dr. Dheeraj Singh
            </h3>
            <p className="text-gray-600 text-sm">doctor1@livedoctors.in</p>
            <p className="text-gray-600 text-sm">Cardiology</p>
            <p className="text-gray-600 text-sm">MBBS, MD</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <FaHospital className="text-green-500 text-4xl" />
            <p className="text-sm font-semibold">Digambar Healthcare Center</p>
            <p className="text-xs text-gray-500">Gorakhpur, U.P. India</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-6">
          <div className="space-y-4">
            <div className="block text-sm font-medium text-gray-700 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Diagnosis
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={prescription.clinicalDiagnosis}
                  onChange={(e) => handleInputChange('clinicalDiagnosis', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Advice
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={prescription.additionalAdvice}
                onChange={(e) => handleInputChange('additionalAdvice', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advice
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={prescription.advice}
                onChange={(e) => handleInputChange('advice', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis Tests
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={prescription.diagnosisTests}
                onChange={(e) => handleInputChange('diagnosisTests', e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Follow Up
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={prescription.nextFollowUp}
                  onChange={(e) => handleInputChange('nextFollowUp', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={prescription.followUpDuration}
                  onChange={(e) => handleInputChange('followUpDuration', e.target.value)}
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500"
                value={prescription.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Right Column - Drugs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <div className="flex flex-col md:flex-row gap-2">
                <select
                  className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
                  value={prescription.patient}
                  onChange={(e) => handleInputChange('patient', e.target.value)}
                >
                  <option value="">Select Patient</option>
                </select>

                <div className="flex w-full md:w-1/2 gap-2">
                  <button className="w-1/2 bg-blue-100 text-blue-600 px-3 py-2 rounded-md text-sm hover:bg-blue-200 flex items-center justify-center gap-1">
                    <FaPlus /> New Patient
                  </button>
                  <button className="w-1/2 bg-blue-100 text-blue-600 px-3 py-2 rounded-md text-sm hover:bg-blue-200 flex items-center justify-center gap-1">
                    <FaPlus /> New Drug
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Medications
              </h3>
              <button
                onClick={addDrugEntry}
                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
              >
                <FaPlus /> Add Item
              </button>
            </div>
            <div className="space-y-4">
              {prescription.drugs.map((drug, index) => (
                <DrugEntry
                  key={drug.id}
                  drug={drug}
                  isRemovable={index !== 0}
                  onRemove={() => removeDrugEntry(drug.id)}
                  bgColor={index === 0 ? "bg-white" : "bg-[#f4f6f9]"}
                  onDrugChange={(updatedDrug) => updateDrug(drug.id, updatedDrug)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Preview Button */}
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6">
          <button 
            onClick={handlePreview}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPrint className="text-white" />
            <span className="hidden md:inline">Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}