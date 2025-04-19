"use client";
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FiUploadCloud } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import Cookies from "js-cookie";

const clinics = [
  {
    id: 1,
    name: "Digambar Healthcare Center",
    location: "Gorakhpur, U.P. India",
    appointmentLimit: 30,
    status: "Active",
  },
];

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

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {showForm ? "Add New Clinic" : "All Clinics"}
        </h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition active:scale-95"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "All Clinics" : "+ Add New Clinic"}
        </button>
      </div>
      {showForm ? (
        <ClinicForm onClose={() => setShowForm(false)} userId={userId} />
      ) : (
        <ClinicTable />
      )}
    </div>
  );
};

const ClinicTable = () => {
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
              <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full flex items-center">
                <BsCheckCircle className="mr-1" /> Active
              </span>
              <div className="flex gap-2">
                <button className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition active:scale-95">
                  <FiEdit />
                </button>
                <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition active:scale-95">
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
              <td className="p-4 text-gray-700">image</td>
              <td className="p-4">
                <div className="font-semibold text-gray-800">{clinic.name}</div>
                <div className="text-sm text-gray-500">{clinic.location}</div>
              </td>
              <td className="p-4 text-gray-700">{clinic.appointmentLimit}</td>
              <td className="p-4">
                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full flex items-center">
                  <BsCheckCircle className="mr-1" /> Active
                </span>
              </td>
              <td className="p-4 flex justify-end gap-2">
                <button className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition active:scale-95">
                  <FiEdit />
                </button>
                <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition active:scale-95">
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
}

const ClinicForm = ({ onClose, userId }: ClinicFormProps) => {
  const [formData, setFormData] = useState({
    logo: null as File | null,
    department: "",
    name: "",
    title: "",
    appointmentLimit: "",
    address: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const apiUrl = `/api/doctor/clinic/${userId}`;
    const form = new FormData();
    if (formData.logo) {
      form.append("logo", formData.logo);
    }
    form.append("department", formData.department);
    form.append("name", formData.name);
    form.append("title", formData.title);
    form.append("appointmentLimit", formData.appointmentLimit);
    form.append("address", formData.address);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        console.log("Clinic data submitted successfully!");
        onClose();
        // Optionally, you can refetch the clinic list here to update the UI
      } else {
        const errorData = await response.json();
        console.error("Failed to submit clinic data:", errorData);
        setUploadError(errorData.message || "Failed to submit clinic data.");
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

        {/* Title */}
        <div>
          <label className="block text-gray-700">Clinic Details *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
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
            {uploading ? "Saving..." : "Save"}
          </button>
        </div>
        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      </form>
    </div>
  );
};

export default ClinicList;