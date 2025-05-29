"use client";

import Cookies from "js-cookie";
import { useEffect, useState, useRef, useCallback } from "react";
import { FaHospital, FaPlus, FaPrint } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import DrugEntry from "./DrugEntry";

import { Drug } from "./DrugEntry";
import PrescriptionPreview from "./Preview";
import DocumentPreviewModal from "./DocumentPreviewModal";
import Image from "next/image";

export interface Doctor {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  degree: string;
  signatureImage: string;
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
  advice: string;
  diagnosisTests: string;
  nextFollowUp: string;
  followUpDuration: string;
  notes: string;
  drugs: Drug[];
};

interface Clinic {
  id: number;
  name: string;
  location: string;
  appointmentLimit: number;
  active: boolean;
  imageLink?: string;
  department?: string;
  title?: string;
  address?: string;
}

export default function CreatePrescription() {
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [togglePreview, setTogglePreview] = useState<boolean>(false);
  const [activeClinic, setActiveClinic] = useState<Clinic>();
  const [allClinics, setAllClinics] = useState<Clinic[]>([]);
  const [documentFilenames, setDocumentFilenames] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isDocumentDropdownOpen, setIsDocumentDropdownOpen] = useState(false);

  // Added state for document preview modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDocumentUrl, setPreviewDocumentUrl] = useState("");
  const [previewFilename, setPreviewFilename] = useState("");

  const [prescription, setPrescription] = useState<PrescriptionState>({
    patient: "",
    clinicalDiagnosis: "",
    advice: "",
    diagnosisTests: "",
    nextFollowUp: "",
    followUpDuration: "Days",
    notes: "",
    drugs: [
      {
        id: 0,
        name: "",
        type: "",
        dosages: [
          {
            id: 0,
            morning: "0",
            afternoon: "0",
            evening: "0",
            night: "0",
            durationValue: "1",
            durationUnit: "Days",
            mealTime: "after_before_meal",
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

  // Use useCallback to memoize the fetchPatients function
  const fetchPatients = useCallback(async () => {
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
  }, [userId]); // Only recreate when userId changes

  // Now fetchPatients is stable between renders as long as userId doesn't change
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]); // This dependency is now stable

  // Fetch patient documents when selectedPatient changes
  useEffect(() => {
    const fetchPatientDocuments = async () => {
      if (selectedPatient?.id) {
        try {
          const response = await fetch(
            `/api/doctor/patients/documents/${selectedPatient.id}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch documents: ${response.status}`);
          }
          const data: string[] = await response.json();
          setDocumentFilenames(data);
        } catch (err: unknown) {
          console.log(err);
        }
      } else {
        setDocumentFilenames([]);
      }
    };
    fetchPatientDocuments();
  }, [selectedPatient?.id]);

  // Fetch clinics when userId changes
  useEffect(() => {
    const fetchClinic = async () => {
      try {
        if (!userId) return;

        const response = await fetch(`/api/doctor/clinic/`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to fetch clinics: ${response.status}`
          );
        }

        const data: Clinic[] = await response.json();
        setAllClinics(data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };

    fetchClinic();
  }, [userId]);

  // Update active clinic when allClinics or userId changes
  useEffect(() => {
    if (!userId || allClinics.length === 0) return;

    const updateActiveClinic = () => {
      const storedClinicId = Cookies.get("currentClinicId");

      if (storedClinicId) {
        const currentId = parseInt(storedClinicId, 10);
        const matchedClinic = allClinics.find((clinic) => clinic.id === currentId);

        if (matchedClinic) {
          setActiveClinic(matchedClinic);
          console.log("Active clinic updated:", matchedClinic.name);
        } else {
          // If stored clinic ID doesn't match any clinic, fallback to first one
          setActiveClinic(allClinics[0]);
          Cookies.set("currentClinicId", String(allClinics[0].id));
          console.log(
            "Stored clinic not found, using default:",
            allClinics[0].name
          );
        }
      } else if (allClinics.length > 0) {
        // No stored clinic ID, use first one
        setActiveClinic(allClinics[0]);
        Cookies.set("currentClinicId", String(allClinics[0].id));
        console.log("No stored clinic, using default:", allClinics[0].name);
      }
    };

    // Initial update
    updateActiveClinic();

    // Set up polling for changes
    const intervalId = setInterval(() => {
      const storedClinicId = Cookies.get("currentClinicId");
      const currentActiveId = activeClinic?.id;

      // Only update if the cookie value changed
      if (storedClinicId && parseInt(storedClinicId, 10) !== currentActiveId) {
        updateActiveClinic();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [userId, allClinics, activeClinic?.id]);

  useEffect(() => {
    console.log(prescription.drugs);
  }, [prescription]);

  useEffect(() => {
    // Handle clicks outside of the patient dropdown
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsPatientDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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

  const addDrugEntry = () => {
    setPrescription((prev) => ({
      ...prev,
      drugs: [
        ...prev.drugs,
        {
          id: Date.now(),
          name: "",
          type: "",
          dosages: [
            {
              id: Date.now() + 1,
              morning: "0",
              afternoon: "0",
              evening: "0",
              night: "0",
              durationValue: "1",
              durationUnit: "Days",
              mealTime: "after_before_meal",
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
    setIsPatientDropdownOpen(true); // Always open dropdown when typing
  };

  const handleInputFocus = () => {
    setIsPatientDropdownOpen(true);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modified to show preview modal instead of direct download
  const handleDocumentSelect = (filename: string) => {
    if (selectedPatient?.id) {
      // Set the selected document as the clinical diagnosis
      handleInputChange("clinicalDiagnosis", filename);
      setIsDocumentDropdownOpen(false);

      // Set up the preview modal
      const documentUrl = `/api/doctor/patients/documents/document/${selectedPatient.id}/${filename}`;
      setPreviewDocumentUrl(documentUrl);
      setPreviewFilename(filename);
      setIsPreviewModalOpen(true);
    }
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  return togglePreview ? (
    <PrescriptionPreview
      setTogglePreview={setTogglePreview}
      userId={userId}
      doctorName={doctorData?.name}
      doctorSpecialization={doctorData?.specialization}
      doctorDegree={doctorData?.degree}
      doctorEmail={doctorData?.email}
      signatureImage={doctorData?.signatureImage}
      patient={{
        id: selectedPatient?.id || 0,
        name: selectedPatient?.name || "",
        age: Number(selectedPatient?.age) || 0,
        weight: Number(selectedPatient?.weight) || 0,
      }}
      advices={prescription.advice}
      diagnosticTests={prescription.diagnosisTests}
      notes={prescription.notes}
      drugs={prescription.drugs}
      nextFollowUp={prescription.nextFollowUp}
      followUpDuration={prescription.followUpDuration}
      activeClinic={activeClinic}
    />
  ) : (
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
            <p className="text-gray-600 text-sm">
              {doctorData?.email} {doctorData?.signatureImage}
            </p>
            <p className="text-gray-600 text-sm">
              {doctorData?.specialization}
            </p>
            <p className="text-gray-600 text-sm">{doctorData?.degree}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            {activeClinic?.imageLink ? (
              <Image
                src={activeClinic.imageLink || "/path/to/default-image.jpg"} 
                alt={activeClinic.name || "Clinic Image"}
                width={96}
                height={64}
                className="rounded-md object-cover mb-1"
              />
            ) : (
              <FaHospital className="text-green-500 text-4xl mb-1" />
            )}
            <p className="text-sm font-semibold">{activeClinic?.name}</p>
            <p className="text-gray-600 text-sm">{activeClinic?.address}</p>
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
                <div className="relative">
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    value={prescription.clinicalDiagnosis}
                    readOnly
                    onClick={() =>
                      setIsDocumentDropdownOpen(!isDocumentDropdownOpen)
                    }
                  />
                  {isDocumentDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      <div className="max-h-60 overflow-y-auto">
                        {documentFilenames.length > 0 ? (
                          documentFilenames.map((filename, index) => (
                            <div
                              key={index}
                              className="p-2 hover:bg-blue-50 cursor-pointer"
                              onClick={() => handleDocumentSelect(filename)}
                            >
                              {filename}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-gray-500">
                            No documents found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                <div className="w-full md:w-1/2 relative" ref={searchRef}>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={handlePatientSearch}
                      onFocus={handleInputFocus}
                      className="w-full p-2 pl-9 border border-gray-300 rounded-md"
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
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Medications
              </h3>
              <button
                onClick={addDrugEntry}
                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
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
                  onDrugChange={(updatedDrug) =>
                    updateDrug(drug.id, updatedDrug)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Document Preview Modal */}
        <DocumentPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={closePreviewModal}
          documentUrl={previewDocumentUrl}
          filename={previewFilename}
        />

        {/* Preview Button */}
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6">
          <button
            onClick={() => setTogglePreview((prev) => !prev)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
          >
            <FaPrint className="text-white" />
            <span className="hidden md:inline">Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}