"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

type Doctor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  pincode?: string;
  specialization?: string;
  degree?: string;
  practiceType?: string;
  experience?: number;
  accountVerified: boolean;
};

type Education = {
  id: string;
  title: string;
  institution?: string;
  yearFrom?: number;
  yearTo?: number;
  details?: string;
};

type Experience = {
  id: string;
  title: string;
  organization?: string;
  yearFrom?: number;
  yearTo?: number | "Present";
  details?: string;
};

type Bank = {
  id: number;
  doctorId: number;
  fullName: string;
  state: string;
  city: string;
  pincode: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
};

type DoctorDataResponse = {
  doctor: Doctor;
  education: Education[];
  experience: Experience[];
  bankDetail: Bank;
  verificationFiles: string[];
};

const DoctorData = () => {
  const params = useParams();
  const doctorId = params?.doctor;
  const [doctorData, setDoctorData] = useState<DoctorDataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalFileName, setModalFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctorData = async () => {
      try {
        const res = await fetch(`/api/admin/users/${doctorId}`);
        if (!res.ok) throw new Error("Failed to fetch doctor data");
        const data = await res.json();

        console.log(data);
        setDoctorData(data);
        setError(null);
      } catch (e) {
        setError((e as Error).message);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  // Open modal and fetch file blob, then create blob URL for img/pdf src
  const openModal = async (fileName: string) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setModalImageSrc(null);
    setModalFileName(fileName);

    try {
      const response = await axios.get(
        `/api/doctor/verification/get_image?name=${encodeURIComponent(
          fileName
        )}&doctorId=${doctorId}`,
        {
          responseType: "blob",
        }
      );
      const fileBlob = response.data;
      const fileUrl = URL.createObjectURL(fileBlob);
      setModalImageSrc(fileUrl);
    } catch (err) {
      console.error("Failed to fetch file", err);
      setModalError("Failed to load file.");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    if (modalImageSrc) {
      URL.revokeObjectURL(modalImageSrc);
    }
    setModalImageSrc(null);
    setModalError(null);
    setModalFileName(null);
  };

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!doctorData) {
    return <div className="p-4">Loading doctor data...</div>;
  }

  const { doctor, education, experience, bankDetail, verificationFiles } =
    doctorData;

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded-md flex gap-8">
        {/* Left side: Doctor info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Doctor Profile
          </h1>

          {/* Basic Information */}
          <section className="mb-8 bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="text-gray-800">{doctor.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-gray-800">{doctor.email}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span className="text-gray-800">{doctor.phone}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">City:</span>
                  <span className="text-gray-800">{doctor.city || "-"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">Pincode:</span>
                  <span className="text-gray-800">{doctor.pincode || "-"}</span>
                </p>
              </div>
              <div className="space-y-3">
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Specialization:
                  </span>
                  <span className="text-gray-800">
                    {doctor.specialization || "-"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">Degree:</span>
                  <span className="text-gray-800">{doctor.degree || "-"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Practice Type:
                  </span>
                  <span className="text-gray-800">
                    {doctor.practiceType || "-"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">Experience:</span>
                  <span className="text-gray-800">
                    {doctor.experience ?? "-"} years
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Account Verified:
                  </span>
                  <span
                    className={`font-semibold ${doctor.accountVerified ? "text-green-600" : "text-red-600"}`}
                  >
                    {doctor.accountVerified ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Bank Details */}
          <section className="mb-8 bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-xl font-semibold mb-4 text-purple-800 border-b border-purple-200 pb-2">
              Bank Details
            </h2>
            {!bankDetail ? (
              <p className="text-gray-500 italic">No bank details found.</p>
            ) : (
              <div className="space-y-4">
                <div
                  key={bankDetail.id}
                  className="bg-white p-4 rounded-md border border-purple-100 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Full Name:
                        </span>
                        <span className="text-gray-800">
                          {bankDetail.fullName}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Account Holder:
                        </span>
                        <span className="text-gray-800">
                          {bankDetail.accountHolderName}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Bank Name:
                        </span>
                        <span className="text-gray-800">
                          {bankDetail.bankName}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Account Number:
                        </span>
                        <span className="text-gray-800 font-mono">
                          {bankDetail.accountNumber}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          IFSC Code:
                        </span>
                        <span className="text-gray-800 font-mono">
                          {bankDetail.ifscCode}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          UPI ID:
                        </span>
                        <span className="text-gray-800">
                          {bankDetail.upiId}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          State:
                        </span>
                        <span className="text-gray-800">
                          {bankDetail.state}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">City:</span>
                        <span className="text-gray-800">{bankDetail.city}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Pincode:
                        </span>
                        <span className="text-gray-800">
                          {bankDetail.pincode}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Education */}
          <section className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b border-blue-200 pb-2">
              Education
            </h2>
            {education.length === 0 ? (
              <p className="text-gray-500 italic">
                No education records found.
              </p>
            ) : (
              <div className="space-y-4">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-white p-4 rounded-md border border-blue-100 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {edu.title}
                      </h3>
                      <span className="text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                        {edu.yearFrom ?? "?"} - {edu.yearTo ?? "?"}
                      </span>
                    </div>
                    {edu.institution && (
                      <p className="text-gray-600 mb-2 font-medium">
                        {edu.institution}
                      </p>
                    )}
                    {edu.details && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {edu.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Experience */}
          <section className="mb-8 bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold mb-4 text-green-800 border-b border-green-200 pb-2">
              Experience
            </h2>
            {experience.length === 0 ? (
              <p className="text-gray-500 italic">
                No experience records found.
              </p>
            ) : (
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white p-4 rounded-md border border-green-100 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {exp.title}
                      </h3>
                      <span className="text-sm text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                        {exp.yearFrom ?? "?"} - {exp.yearTo ?? "Present"}
                      </span>
                    </div>
                    {exp.organization && (
                      <p className="text-gray-600 mb-2 font-medium">
                        {exp.organization}
                      </p>
                    )}
                    {exp.details && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {exp.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right side: Verification files */}
        <aside className="w-80 sticky top-6 self-start p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Verification Files
          </h2>

          {verificationFiles.length === 0 ? (
            <p className="text-gray-500 italic mb-6">
              No verification files found.
            </p>
          ) : (
            <ul className="space-y-2 mb-6 max-h-48 overflow-y-auto">
              {verificationFiles.map((file, i) => (
                <li key={i}>
                  <button
                    className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 break-all text-left"
                    onClick={() => openModal(file)}
                    type="button"
                  >
                    {file}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mb-4 p-3 bg-white rounded border">
            <span className="font-medium text-gray-700">
              Doctor Verification Status:
            </span>{" "}
            <span
              className={`font-semibold ${
                doctor.accountVerified ? "text-green-700" : "text-yellow-700"
              }`}
            >
              {doctor.accountVerified ? "Verified" : "Pending"}
            </span>
          </div>

          <button
            type="button"
            className={`w-full py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              doctor.accountVerified
                ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
            }`}
            onClick={async () => {
              try {
                const response = await fetch(
                  `/api/admin/users/${doctorId}/verify`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                  }
                );
                if (!response.ok) {
                  throw new Error("Failed to update verification status");
                }
                const data = await response.json();
                setDoctorData((prev) =>
                  prev
                    ? {
                        ...prev,
                        doctor: {
                          ...prev.doctor,
                          accountVerified: data.accountVerified,
                        },
                      }
                    : prev
                );
              } catch (err) {
                alert((err as Error).message);
              }
            }}
          >
            {doctor.accountVerified ? "Mark as Pending" : "Mark as Verified"}
          </button>
        </aside>
      </div>
      {/* Modal for verification file image/pdf */}
      // Replace the modal section in your component with this updated version:
      {/* Modal for verification file image/pdf */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-md shadow-lg max-w-[90vw] max-h-[95vh] w-[90vw] h-[95vh] p-6 relative overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 z-10"
              onClick={closeModal}
              aria-label="Close modal"
            >
              &#x2715;
            </button>
            <h3
              id="modal-title"
              className="text-lg font-semibold mb-4 break-all"
            >
              {modalFileName}
            </h3>

            {modalLoading && (
              <div className="flex justify-center items-center h-full">
                <span className="text-gray-600">Loading file...</span>
              </div>
            )}

            {modalError && (
              <p className="text-red-600 text-center py-6">{modalError}</p>
            )}

            {!modalLoading && !modalError && modalImageSrc && (
              <div className="w-full h-[85vh] flex items-center justify-center">
                {modalFileName &&
                modalFileName.toLowerCase().endsWith(".pdf") ? (
                  <embed
                    src={modalImageSrc}
                    type="application/pdf"
                    className="w-full h-full rounded"
                  />
                ) : (
                  // Use regular img tag instead of Next.js Image for blob URLs
                  <img
                    src={modalImageSrc}
                    alt={`Verification file ${modalFileName}`}
                    className="max-w-full max-h-full object-contain rounded"
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", e);
                      setModalError("Failed to display image");
                    }}
                    onLoad={() => {
                      console.log("Image loaded successfully");
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorData;
