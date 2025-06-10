"use client";
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiAlertTriangle, FiX } from "react-icons/fi";
import { FiUploadCloud } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import Cookies from "js-cookie";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clinicName: string;
  clinicId: number;
  isDeleting: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  clinicName,
  clinicId,
  isDeleting,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <FiAlertTriangle className="text-red-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Clinic
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isDeleting}
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this clinic?
            </p>
            <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-red-400">
              <p className="font-medium text-gray-900">{clinicName}</p>
              <p className="text-sm text-gray-500">ID: {clinicId}</p>
            </div>
            <p className="text-sm text-red-600 mt-3 font-medium">
              This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete Clinic"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const departments = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "General Medicine",
];

const ClinicList = () => {
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [clinicsData, setClinicsData] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    clinic: null as Clinic | null,
    isDeleting: false,
  });

  useEffect(() => {
    const fetchClinics = async () => {
      if (userId) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/doctor/clinic/`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `Failed to fetch clinics: ${response.status}`
            );
          }
          const data = await response.json();
          console.log(data);
          setClinicsData(data);
        } catch (err: unknown) {
          console.error("Error fetching clinics:", err);
          if (err instanceof Error) {
            setError(err.message);
            toast.error(err.message);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClinics();
  }, [userId]);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  const handleEditClick = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setShowForm(true);
  };

  const handleCloseForm = (success: boolean = false, message: string | null = null) => {
    setShowForm(false);
    setEditingClinic(null);
    if (success) {
      fetchClinics();
    }
    if (message) {
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  };

  const handleDeleteClick = (clinic: Clinic) => {
    setDeleteModal({
      isOpen: true,
      clinic: clinic,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.clinic || !userId) {
      toast.error("Unable to delete clinic.");
      return;
    }

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      const response = await fetch(`/api/doctor/clinic/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteModal.clinic.id }),
      });

      if (response.ok) {
        console.log(`Clinic with ID ${deleteModal.clinic.id} deleted successfully!`);
        toast.success("Clinic deleted successfully!");
        fetchClinics();
        setDeleteModal({ isOpen: false, clinic: null, isDeleting: false });
      } else {
        const errorData = await response.json();
        console.error(
          `Failed to delete clinic with ID ${deleteModal.clinic.id}:`,
          errorData
        );
        const errorMessage = errorData.error || errorData.message || "Failed to delete clinic.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      console.error("An error occurred while deleting the clinic:", error);
      let errorMessage = "An unexpected error occurred during deletion.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDeleteModal({ isOpen: false, clinic: null, isDeleting: false });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, clinic: null, isDeleting: false });
  };

  const fetchClinics = async () => {
    if (userId) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/doctor/clinic/`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to fetch clinics: ${response.status}`
          );
        }
        const data = await response.json();
        console.log(data);
        setClinicsData(data);
      } catch (err: unknown) {
        console.error("Error fetching clinics:", err);
        let errorMessage = "Failed to fetch clinics due to an unknown error.";
        if (err instanceof Error) {
          errorMessage = err.message || errorMessage;
        }
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {showForm
            ? editingClinic
              ? "Edit Clinic"
              : "Add New Clinic"
            : "All Clinics"}
        </h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition active:scale-95"
          onClick={() => {
            setShowForm(!showForm);
            setEditingClinic(null);
          }}
        >
          {showForm ? "All Clinics" : "+ Add New Clinic"}
        </button>
      </div>
      
      {showForm ? (
        <ClinicForm
          onClose={handleCloseForm}
          userId={userId}
          editClinic={editingClinic}
        />
      ) : (
        <ClinicTable
          clinics={clinicsData}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading && <p>Loading clinics...</p>}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        clinicName={deleteModal.clinic?.name || ""}
        clinicId={deleteModal.clinic?.id || 0}
        isDeleting={deleteModal.isDeleting}
      />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ 
          zIndex: 999999,
        }}
        toastStyle={{
          zIndex: 999999,
        }}
        limit={3}
      />
    </div>
  );
};

interface ClinicTableProps {
  clinics: Clinic[];
  onEdit: (clinic: Clinic) => void;
  onDelete: (clinic: Clinic) => void;
}

const ClinicTable = ({ clinics, onEdit, onDelete }: ClinicTableProps) => {
  return (
    <>
      {/* Mobile View */}
      <div className="space-y-4 md:hidden">
        {clinics.map((clinic) => (
          <div
            key={clinic.id}
            className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="font-semibold text-gray-800">{clinic.name}</div>
                <div className="text-sm text-gray-500">{clinic.address}</div>
                {clinic.location && (
                  <div className="text-sm text-gray-500">{clinic.location}</div>
                )}
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-700">
              Appointment Limit: {clinic.appointmentLimit}
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span
                className={`px-3 py-1 text-sm rounded-full flex items-center ${
                  clinic.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <BsCheckCircle className="mr-1" />{" "}
                {clinic.active ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-2">
                <button
                  className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition active:scale-95"
                  onClick={() => onEdit(clinic)}
                  aria-label="Edit clinic"
                >
                  <FiEdit />
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition active:scale-95"
                  onClick={() => onDelete(clinic)}
                  aria-label="Delete clinic"
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm table-fixed">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="p-3 text-left font-medium w-16">#</th>
              <th className="p-3 text-left font-medium w-24">Thumb</th>
              <th className="p-3 text-left font-medium">Information</th>
              <th className="p-3 text-center font-medium w-36">
                Appointment Limit
              </th>
              <th className="p-3 text-center font-medium w-32">Status</th>
              <th className="p-3 text-center font-medium w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic, index) => (
              <tr
                key={clinic.id}
                className="border-t border-gray-300 hover:bg-gray-50 transition"
              >
                <td className="p-4 text-gray-700">{index + 1}</td>
                <td className="p-4 text-gray-700">
                  {clinic.imageLink ? (
                    <div className="w-16 h-16 flex items-center justify-center rounded-md border border-gray-300 shadow-sm">
                      <Image
                        src={clinic.imageLink}
                        alt={`${clinic.name} thumbnail`}
                        width={64}
                        height={64}
                        className="object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm border border-gray-300 shadow-sm">
                      No Image
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-800">
                    {clinic.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {clinic.address}
                  </div>
                  {clinic.location && (
                    <div className="text-sm text-gray-500 mt-1">
                      {clinic.location}
                    </div>
                  )}
                </td>
                <td className="p-4 text-gray-700 text-center">
                  {clinic.appointmentLimit}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center">
                    <span
                      className={`px-3 py-1 text-sm rounded-full inline-flex items-center ${
                        clinic.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <BsCheckCircle className="mr-1" />
                      {clinic.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition active:scale-95"
                      onClick={() => onEdit(clinic)}
                      aria-label="Edit clinic"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition active:scale-95"
                      onClick={() => onDelete(clinic)}
                      aria-label="Delete clinic"
                    >
                      <FiTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

interface ClinicFormProps {
  onClose: (success: boolean, message: string | null) => void;
  userId: string | null;
  editClinic: Clinic | null;
}

const ClinicForm = ({ onClose, userId, editClinic }: ClinicFormProps) => {
  const [formData, setFormData] = useState({
    logo: null as File | null,
    department: editClinic?.department || "",
    name: editClinic?.name || "",
    title: editClinic?.title || "",
    appointmentLimit: editClinic?.appointmentLimit?.toString() || "",
    address: editClinic?.address || "",
    active: editClinic?.active ?? true,
    id: editClinic?.id,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editClinic) {
      setFormData({
        logo: null,
        department: editClinic.department || "",
        name: editClinic.name || "",
        title: editClinic.title || "",
        appointmentLimit: editClinic.appointmentLimit?.toString() || "",
        address: editClinic.address || "",
        active: editClinic.active,
        id: editClinic.id,
      });
    } else {
      setFormData({
        logo: null,
        department: "",
        name: "",
        title: "",
        appointmentLimit: "",
        address: "",
        active: true,
        id: undefined,
      });
    }
  }, [editClinic]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      if (type === "checkbox" && e.target instanceof HTMLInputElement) {
        return { ...prev, [name]: e.target.checked };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.department.trim()) {
      toast.error("Please select a department.");
      return;
    }
    
    if (!formData.name.trim()) {
      toast.error("Please enter clinic name.");
      return;
    }
    
    if (!formData.appointmentLimit || parseInt(formData.appointmentLimit) <= 0) {
      toast.error("Please enter a valid appointment limit.");
      return;
    }
    
    if (!formData.address.trim()) {
      toast.error("Please enter clinic address.");
      return;
    }
    
    if (!userId) {
      toast.error("User ID not found.");
      return;
    }

    setUploading(true);

    const apiUrl = `/api/doctor/clinic/`;
    const form = new FormData();
    if (formData.logo) {
      form.append("logo", formData.logo);
    }
    form.append("department", formData.department);
    form.append("name", formData.name);
    form.append("title", formData.title);
    form.append("appointmentLimit", formData.appointmentLimit);
    form.append("address", formData.address);
    form.append("active", formData.active.toString());
    if (formData.id) {
      form.append("id", formData.id.toString());
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        console.log(
          `Clinic data ${formData.id ? "updated" : "submitted"} successfully!`
        );
        const successMessage = `Clinic data ${formData.id ? "updated" : "submitted"} successfully!`;
        onClose(true, successMessage);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.message || 
          `Failed to ${formData.id ? "update" : "submit"} clinic data.`;
        onClose(false, errorMessage);
      }
    } catch (error: unknown) {
      console.error("An error occurred while submitting:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      onClose(false, errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Logo Upload */}
        <div className="flex justify-center">
          <div className="relative w-full lg:w-4/5 max-w-xs lg:max-w-none h-32 border-dashed border-2 border-gray-200 flex items-center justify-center rounded-lg cursor-pointer mx-auto">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            {formData.logo ? (
              <Image
                src={URL.createObjectURL(formData.logo)}
                alt="Clinic Logo"
                width={300}
                height={300}
                unoptimized
                className="w-full h-full object-cover rounded-lg"
              />
            ) : editClinic?.imageLink ? (
              <Image
                src={editClinic.imageLink}
                alt="Clinic Logo"
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <FiUploadCloud size={24} />
                <span className="text-sm">Upload Clinic Picture</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Department Dropdown */}
        <div>
          <label className="block text-gray-700">Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-lg mt-1"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        
        {/* Clinic Name */}
        <div>
          <label className="block text-gray-700">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-lg mt-1"
            required
          />
        </div>
        
        {/* Appointment Limit */}
        <div>
          <label className="block text-gray-700">Appointment Limit *</label>
          <input
            type="number"
            name="appointmentLimit"
            value={formData.appointmentLimit}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-lg mt-1"
            min="1"
            required
          />
        </div>
        
        {/* Address */}
        <div>
          <label className="block text-gray-700">Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-lg mt-1 h-24 resize-none"
            required
          />
        </div>
        
        {/* Active/Inactive Switch */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="active" className="ml-2 text-gray-700">
            Active
          </label>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition w-1/2 mr-2"
            onClick={() => onClose(false, null)}
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-1/2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            {uploading ? "Saving..." : editClinic ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClinicList;