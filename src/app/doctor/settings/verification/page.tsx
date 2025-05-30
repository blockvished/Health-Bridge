"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { UploadCloud, Loader2, X } from "lucide-react";
import Image from "next/image";

export default function DoctorVerification() {
  const [documents, setDocuments] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [loadingUploadedDocs, setLoadingUploadedDocs] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const [modalImageSrcName, setModalImageSrcName] = useState<string | null>(
    null
  ); // filename for type check
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          "/api/admin/settings/doctor_verification"
        );
        if (response.data.success) {
          setDocuments(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch documents", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUploadedDocs = async () => {
      try {
        const response = await axios.get("/api/doctor/verification");
        if (response.data.files && Array.isArray(response.data.files)) {
          setUploadedDocs(response.data.files);
        }
      } catch (error) {
        console.error("Failed to fetch uploaded documents", error);
      } finally {
        setLoadingUploadedDocs(false);
      }
    };

    fetchDocuments();
    fetchUploadedDocs();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!uploadedFiles) return;

    const formData = new FormData();
    Array.from(uploadedFiles).forEach((file) => {
      formData.append("files", file);
    });

    setUploading(true);

    try {
      await axios.post("/api/doctor/verification", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Files uploaded successfully");
      setUploadedFiles(null);

      // Refresh the uploaded documents list after successful upload
      const response = await axios.get("/api/doctor/verification");
      if (response.data.files && Array.isArray(response.data.files)) {
        setUploadedDocs(response.data.files);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openModalWithImage = async (filename: string) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setModalImageSrc(null);
    setModalImageSrcName(filename);

    try {
      // Fetch the image/pdf as a blob from the API
      const response = await axios.get(
        `/api/doctor/verification/get_image?name=${encodeURIComponent(filename)}`,
        {
          responseType: "blob",
        }
      );

      // Create a local URL for the blob file
      const fileUrl = URL.createObjectURL(response.data);
      setModalImageSrc(fileUrl);
    } catch (error) {
      console.error("Failed to fetch document", error);
      setModalError("Failed to load document.");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    if (modalImageSrc) {
      URL.revokeObjectURL(modalImageSrc);
      setModalImageSrc(null);
    }
    setModalImageSrcName(null);
    setModalError(null);
  };

  // Helper to check if file is a PDF
  const isPdf = (filename: string) => filename.toLowerCase().endsWith(".pdf");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        Doctor Verification Documents
      </h2>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-medium mb-2">Required Documents.</h3>
        <span className="text-sm text-gray-600">
          {`If you've already uploaded the documents then please wait as admin will verify and update.`}
        </span>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700">
            {documents.map((doc) => (
              <li key={doc.id}>{doc.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <UploadCloud className="w-8 h-8 text-blue-600 mb-2" />
          <span className="text-gray-600 font-medium mb-1">
            Click to upload or drag files here
          </span>
          <span className="text-sm text-gray-400">
            You can upload multiple files
          </span>
          <span className="text-sm text-gray-600">
            Please upload only PDF or image files
          </span>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {uploadedFiles && uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-1">Selected Files:</h4>
            <ul className="list-disc list-inside text-gray-700 text-sm">
              {Array.from(uploadedFiles).map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!uploadedFiles || uploading}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg transition hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            Upload Documents
          </>
        )}
      </button>

      <div className="bg-white rounded-lg shadow-md p-4 mt-8">
        <h3 className="text-lg font-medium mb-2">Uploaded Documents</h3>
        {loadingUploadedDocs ? (
          <p className="text-gray-500">Loading uploaded documents...</p>
        ) : uploadedDocs.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700">
            {uploadedDocs.map((filename, idx) => (
              <li
                key={idx}
                onClick={() => openModalWithImage(filename)}
                className="cursor-pointer hover:text-blue-600 transition-colors"
                title="Click to view"
              >
                {filename}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-lg p-6 max-w-[90vw] max-h-[95vh] w-[90vw] h-[95vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {modalLoading && (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}

            {modalError && (
              <p className="text-red-600 text-center py-6">{modalError}</p>
            )}

            {modalImageSrc &&
              !modalLoading &&
              !modalError &&
              (isPdf(modalImageSrcName || "") ? (
                <embed
                  src={modalImageSrc}
                  type="application/pdf"
                  className="w-full h-full rounded"
                />
              ) : (
                <div className="relative max-w-full max-h-full">
                  <Image
                    src={modalImageSrc}
                    alt="Uploaded document"
                    fill
                    className="object-contain rounded"
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
