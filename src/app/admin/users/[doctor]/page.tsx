"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

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

type DoctorDataResponse = {
  doctor: Doctor;
  education: Education[];
  experience: Experience[];
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

  const { doctor, education, experience, verificationFiles } = doctorData;

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-md flex gap-8">
        {/* Left side: Doctor info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-6">Doctor Profile</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
            <p>
              <strong>Name:</strong> {doctor.name}
            </p>
            <p>
              <strong>Email:</strong> {doctor.email}
            </p>
            <p>
              <strong>Phone:</strong> {doctor.phone}
            </p>
            <p>
              <strong>City:</strong> {doctor.city || "-"}
            </p>
            <p>
              <strong>Pincode:</strong> {doctor.pincode || "-"}
            </p>
            <p>
              <strong>Specialization:</strong> {doctor.specialization || "-"}
            </p>
            <p>
              <strong>Degree:</strong> {doctor.degree || "-"}
            </p>
            <p>
              <strong>Practice Type:</strong> {doctor.practiceType || "-"}
            </p>
            <p>
              <strong>Experience:</strong> {doctor.experience ?? "-"} years
            </p>
            <p>
              <strong>Account Verified:</strong>{" "}
              {doctor.accountVerified ? "Yes" : "No"}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Education</h2>
            {education.length === 0 ? (
              <p>No education records found.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {education.map((edu) => (
                  <li key={edu.id}>
                    <strong>{edu.title}</strong>{" "}
                    {edu.institution && `- ${edu.institution}`} (
                    {edu.yearFrom ?? "?"} - {edu.yearTo ?? "?"})
                    {edu.details && (
                      <div className="text-sm text-gray-600">{edu.details}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Experience</h2>
            {experience.length === 0 ? (
              <p>No experience records found.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {experience.map((exp) => (
                  <li key={exp.id}>
                    <strong>{exp.title}</strong>{" "}
                    {exp.organization && `- ${exp.organization}`} (
                    {exp.yearFrom ?? "?"} - {exp.yearTo ?? "Present"})
                    {exp.details && (
                      <div className="text-sm text-gray-600">{exp.details}</div>
                    )}
                  </li>
                ))}
              </ul>
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
                    className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
                    onClick={() => openModal(file)}
                    type="button"
                  >
                    {file}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mb-4">
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
            onClick={(e) => e.stopPropagation()} // prevent closing modal on clicking inside
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
              aria-label="Close modal"
            >
              &#x2715;
            </button>
            <h3 id="modal-title" className="text-lg font-semibold mb-4 break-all">
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
              modalFileName &&
              modalFileName.toLowerCase().endsWith(".pdf") ? (
                <embed
                  src={modalImageSrc}
                  type="application/pdf"
                  className="w-full h-[85vh] rounded"
                />
              ) : (
                <img
                  src={modalImageSrc}
                  alt={`Verification file ${modalFileName}`}
                  className="max-w-full max-h-[85vh] object-contain rounded"
                />
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorData;
