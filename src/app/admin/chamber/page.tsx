"use client";
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FiUploadCloud } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import Cookies from "js-cookie";

interface Clinic {
  id: number;
  name: string;
  location: string;
  appointmentLimit: number;
  active: boolean;
  // Assuming your API response includes these fields
  imageLink?: string;
  department?: string; // Add department here if it's in your API response
  title?: string; // Add title here if it's in your API response
  address?: string; // Add address here if it's in your API response
}

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

  useEffect(() => {
    const fetchClinics = async () => {
      if (userId) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/doctor/clinic/${userId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `Failed to fetch clinics: ${response.status}`
            );
          }
          const data = await response.json();
          console.log(data);
          setClinicsData(data);
        } catch (err: any) {
          console.error("Error fetching clinics:", err);
          setError(err.message);
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

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClinic(null);
  };

  const handleDeleteClick = async (clinicId: number) => {
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete clinic with ID: ${clinicId}?`)) {
      try {
        const response = await fetch(`/api/doctor/clinic/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: clinicId }),
        });

        if (response.ok) {
          console.log(`Clinic with ID ${clinicId} deleted successfully!`);
          // Refetch the clinic list to update the UI
          fetchClinics();
        } else {
          const errorData = await response.json();
          console.error(`Failed to delete clinic with ID ${clinicId}:`, errorData);
          setError(errorData.message || `Failed to delete clinic.`);
        }
      } catch (error: any) {
        console.error("An error occurred while deleting the clinic:", error);
        setError(error.message || "An unexpected error occurred during deletion.");
      }
    }
  };

  const fetchClinics = async () => {
    if (userId) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/doctor/clinic/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to fetch clinics: ${response.status}`
          );
        }
        const data = await response.json();
        console.log(data);
        setClinicsData(data);
      } catch (err: any) {
        console.error("Error fetching clinics:", err);
        setError(err.message);
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
            setEditingClinic(null); // Reset editing when toggling to add form
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
        <ClinicTable clinics={clinicsData} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading && <p>Loading clinics...</p>}
    </div>
  );
};

interface ClinicTableProps {
  clinics: Clinic[];
  onEdit: (clinic: Clinic) => void;
  onDelete: (clinicId: number) => void;
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
                <div className="text-sm text-gray-500">{clinic.location}</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-700">
              Appointment Limit: {clinic.appointmentLimit}
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span
                className={`px-3 py-1 text-sm rounded-full flex items-center ${
                  clinic.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                <BsCheckCircle className="mr-1" /> {clinic.active ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-2">
                <button
                  className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition active:scale-95"
                  onClick={() => onEdit(clinic)}
                >
                  <FiEdit />
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition active:scale-95"
                  onClick={() => onDelete(clinic.id)}
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop View */}
      <table className="hidden md:table w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="p-3 text-left font-medium">#</th>
            <th className="p-3 text-left font-medium">Thumb</th>
            <th className="p-3 text-left font-medium">Information</th>
            <th className="p-3 text-left font-medium">Appointment Limit</th>
            <th className="p-3 text-left font-medium">Status</th>
            <th className="p-3 text-left font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map((clinic) => (
            <tr
              key={clinic.id}
              className="border-t border-gray-300 hover:bg-gray-50 transition"
            >
              <td className="p-4 text-gray-700">{clinic.id}</td>
              <td className="p-4 text-gray-700">
                {clinic.imageLink ? (
                  <img
                    src={clinic.imageLink}
                    alt="Clinic Thumb"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="p-4">
                <div className="font-semibold text-gray-800">{clinic.name}</div>
                <div className="text-sm text-gray-500">{clinic.address}</div> {/* Displaying address here */}
                <div className="text-sm text-gray-500">{clinic.location}</div>
              </td>
              <td className="p-4 text-gray-700">{clinic.appointmentLimit}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full flex items-center ${
                    clinic.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  <BsCheckCircle className="mr-1" /> {clinic.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-4 flex justify-end gap-2">
                <button
                  className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition active:scale-95"
                  onClick={() => onEdit(clinic)}
                >
                  <FiEdit />
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition active:scale-95"
                  onClick={() => onDelete(clinic.id)}
                >
                  <FiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

interface ClinicFormProps {
  onClose: () => void;
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
    active: editClinic?.active ?? true, // Default to true for new clinics
    id: editClinic?.id, // Include ID in the form data for editing
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill the form if editClinic prop is provided
    if (editClinic) {
      setFormData({
        logo: null, // Keep logo as null initially, handle separately if needed
        department: editClinic.department || "",
        name: editClinic.name || "",
        title: editClinic.title || "",
        appointmentLimit: editClinic.appointmentLimit?.toString() || "",
        address: editClinic.address || "",
        active: editClinic.active,
        id: editClinic.id,
      });
    } else {
      // Reset form data when not editing
      setFormData({
        logo: null,
        department: "",
        name: "",
        title: "",
        appointmentLimit: "",
        address: "",
        active: true, // Default active state for new clinics
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
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const apiUrl = `/api/doctor/clinic/${userId}`; // Endpoint is the same
    const method = "POST"; // Use PUT for edit

    const form = new FormData();
    if (formData.logo) {
      form.append("logo", formData.logo);
    }
    form.append("department", formData.department);
    form.append("name", formData.name);
    form.append("title", formData.title);
    form.append("appointmentLimit", formData.appointmentLimit);
    form.append("address", formData.address);
    form.append("active", formData.active.toString()); // Send active as string
    if (formData.id) {
      form.append("id", formData.id.toString());
    }

    try {
      const response = await fetch(apiUrl, {
        method: method,
        body: form,
      });

      if (response.ok) {
        console.log(
          `Clinic data ${formData.id ? "updated" : "submitted"} successfully!`
        );
        onClose();
        // Optionally, you might want to trigger a refetch of the clinic list here
        window.location.reload(); // Simple way to refresh the data
      } else {
        const errorData = await response.json();
        console.error(
          `Failed to ${formData.id ? "update" : "submit"} clinic data:`,
          errorData
        );
        setUploadError(
          errorData.message ||
            `Failed to ${formData.id ? "update" : "submit"} clinic data.`
        );
      }
    } catch (error: any) {
      console.error("An error occurred while submitting:", error);
      setUploadError(error.message || "An unexpected error occurred.");
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
              <img
                src={URL.createObjectURL(formData.logo)}
                alt="Clinic Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : editClinic?.imageLink ? (
              <img
                src={editClinic.imageLink}
                alt="Clinic Logo"
                className="w-full h-full object-cover rounded-lg"
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
          <label className="block text-gray-700">Appointment Limit</label>
          <input
            type="number"
            name="appointmentLimit"
            value={formData.appointmentLimit}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-lg mt-1"
            required
          />
        </div>
        {/* Address */}
        <div>
          <label className="block text-gray-700">Address</label>
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
        {/* Buttons and Error Message */}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition w-1/2 mr-2"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-1/2"
            disabled={uploading}
          >
            {uploading ? "Saving..." : editClinic ? "Update" : "Save"}
          </button>
        </div>
        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      </form>
    </div>
  );
};

export default ClinicList;