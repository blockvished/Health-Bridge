"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaHospital, FaPlus, FaPrint, FaTimes } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import DrugEntry from "./DrugEntry";
import { Drug } from "./DrugEntry";

export interface Doctor {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  degree: string;
}

interface Patient {
  id: number;
  userId: string;
  name: string;
  age: string;
  phone: string;
  abha_id: string | null;
  email?: string;
  height?: string;
  weight?: string;
  address?: string;
  gender?: string | null;
}

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

export default function CreatePrescription() {
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [prescription, setPrescription] = useState<PrescriptionState>({
    patient: "",
    clinicalDiagnosis: "",
    additionalAdvice: "",
    advice: "",
    diagnosisTests: "",
    nextFollowUp: "",
    followUpDuration: "Days",
    notes: "",
    drugs: [
      {
        id: 0,
        name: "",
        dosages: [
          {
            id: 0,
            morning: "0",
            afternoon: "0",
            evening: "0",
            night: "0",
            durationValue: "1",
            durationUnit: "Days",
            mealTime: "Before/After Meal",
            note: "",
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [userId]);

  const fetchPatients = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/doctor/patients/${userId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.Patients) {
          setPatients(data.Patients);
        } else {
          setPatients([]);
        }
      } else {
        console.error("Failed to fetch patients data");
      }
    } catch (err) {
      console.error("Error fetching patients data:", err);
    }
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/doctor/profile/info/get/${userId}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          let metemeta;
          if (data.metaTags) {
            if (Array.isArray(data.metaTags)) {
              const tags = data.metaTags.map(
                (tagObj: { tag: string }) => tagObj.tag
              );
              metemeta = tags;
            }
          }
          if (data.doctor) {
            setDoctorData({
              name: data.doctor.name || "",
              email: data.doctor.email || "",
              phone: data.doctor.phone || "",
              specialization: data.doctor.specialization || "",
              degree: data.doctor.degree || "",
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

  const addDrugEntry = () => {
    setPrescription((prev) => ({
      ...prev,
      drugs: [
        ...prev.drugs,
        {
          id: Date.now(),
          name: "",
          dosages: [
            {
              id: Date.now() + 1,
              morning: "0",
              afternoon: "0",
              evening: "0",
              night: "0",
              durationValue: "1",
              durationUnit: "Days",
              mealTime: "Before/After Meal",
              note: "",
            },
          ],
        },
      ],
    }));
  };

  const removeDrugEntry = (id: number) => {
    setPrescription((prev) => ({
      ...prev,
      drugs: prev.drugs.filter((d) => d.id !== id),
    }));
  };

  const updateDrug = (id: number, updatedDrug: Drug) => {
    setPrescription((prev) => ({
      ...prev,
      drugs: prev.drugs.map((drug) => (drug.id === id ? updatedDrug : drug)),
    }));
  };

  const handleInputChange = (field: keyof PrescriptionState, value: string) => {
    setPrescription((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    handleInputChange("patient", patient.id.toString());
    setSearchQuery(patient.name);
    setIsPatientDropdownOpen(false);
  };

  const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {doctorData?.name}
            </h3>
            <p className="text-gray-600 text-sm">{doctorData?.email}</p>
            <p className="text-gray-600 text-sm">
              {doctorData?.specialization}
            </p>
            <p className="text-gray-600 text-sm">{doctorData?.degree}</p>
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
                  onChange={(e) =>
                    handleInputChange("clinicalDiagnosis", e.target.value)
                  }
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
                onChange={(e) =>
                  handleInputChange("additionalAdvice", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advice
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={prescription.advice}
                onChange={(e) => handleInputChange("advice", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis Tests
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={prescription.diagnosisTests}
                onChange={(e) =>
                  handleInputChange("diagnosisTests", e.target.value)
                }
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
                  onChange={(e) =>
                    handleInputChange("nextFollowUp", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={prescription.followUpDuration}
                  onChange={(e) =>
                    handleInputChange("followUpDuration", e.target.value)
                  }
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
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>
          </div>

          {/* Right Column - Drugs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <div className="flex flex-col md:flex-row gap-2 relative">
                <div className="w-full md:w-1/2 relative">
                  <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={handlePatientSearch}
                      className="w-full p-2 pl-9 border border-gray-300 rounded-md"
                      autoFocus
                    />
                  </div>

                  {isPatientDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      <div className="max-h-60 overflow-y-auto">
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map((patient) => (
                            <div
                              key={patient.id}
                              className="p-2 hover:bg-blue-50 cursor-pointer"
                              onClick={() => selectPatient(patient)}
                            >
                              {patient.name} - {patient.id}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-gray-500">
                            No patients found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

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
                  onDrugChange={(updatedDrug) =>
                    updateDrug(drug.id, updatedDrug)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Preview Button */}
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6">
          <button
            onClick={() => {
              console.log("Prescription data:", prescription);
            }}
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
