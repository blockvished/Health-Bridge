"use client";
import React, { useState, useEffect } from "react";
import { FiEdit, FiEye, FiSave, FiTrash2, FiX } from "react-icons/fi";
import { LuMenu, LuPlus } from "react-icons/lu";
import Cookies from "js-cookie";

// Define the Patient interface
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

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">{label}</label>
    <input
      className="w-full border border-gray-300 rounded-lg p-2 h-10 focus:outline-blue-500"
      {...props}
    />
  </div>
);

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">{label}</label>
    <textarea
      className="w-full border border-gray-300 rounded-lg p-2 h-28 focus:outline-blue-500"
      {...props}
    ></textarea>
  </div>
);

interface GenderInputProps {
  onChange: (gender: string) => void;
  value: string | null;
}

const GenderInput: React.FC<GenderInputProps> = ({ onChange, value }) => (
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">Gender</label>
    <div className="flex items-center space-x-6">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="gender"
          className="text-blue-600 focus:ring-blue-500 cursor-pointer"
          value="male"
          checked={value === "male"}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>Male</span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="gender"
          className="text-blue-600 focus:ring-blue-500 cursor-pointer"
          value="female"
          checked={value === "female"}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>Female</span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="gender"
          className="text-blue-600 focus:ring-blue-500 cursor-pointer"
          value="other"
          checked={value === "other"}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>Other</span>
      </label>
    </div>
  </div>
);

interface PatientFormProps {
  onBack: () => void;
  onPatientAdded: () => void;
  editingPatient?: Patient | null;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  onBack,
  onPatientAdded,
  editingPatient = null,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  // Populate form when editing a patient
  useEffect(() => {
    if (editingPatient) {
      setName(editingPatient.name || "");
      setEmail(editingPatient.email || "");
      setPhone(editingPatient.phone || "");
      setAbhaId(editingPatient.abha_id || "");
      setAge(editingPatient.age || "");
      setWeight(editingPatient.weight || "");
      setHeight(editingPatient.height || "");
      setAddress(editingPatient.address || "");
      setGender(editingPatient.gender || null);
    }
  }, [editingPatient]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate age, weight, and height are not negative
    if (parseInt(age) < 0) {
      setError("Age cannot be negative");
      return;
    }

    if (weight && parseFloat(weight) < 0) {
      setError("Weight cannot be negative");
      return;
    }

    if (height && parseFloat(height) < 10) {
      setError("Height cannot be that low");
      return;
    }

    if (!userId) {
      setError("User ID not found.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create JSON payload
      const patientData = {
        name,
        email,
        phone,
        abha_id: abhaId,
        age,
        weight,
        height,
        address,
        gender,
      };

      console.log(
        `${editingPatient ? "Updating" : "Submitting"} patient data:`,
        patientData
      );

      let url = `/api/doctor/patients/${userId}`;
      let method = "POST";

      // If editing, use the edit endpoint and PUT method
      if (editingPatient) {
        url = `/api/doctor/patients/${userId}/edit/${editingPatient.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        console.log(
          `Patient ${editingPatient ? "updated" : "created"} successfully`
        );
        onPatientAdded(); // Refresh the patient list
        onBack(); // Go back to the patient list after submission
      } else {
        const errorData = await response.json();
        console.error(
          `Failed to ${editingPatient ? "update" : "create"} patient:`,
          errorData
        );
        setError(
          errorData.message ||
            `Failed to ${editingPatient ? "update" : "create"} patient`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-md">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
      <Input
          label="Abha Id"
          type="text"
          name="abha_id"
          value={abhaId}
          onChange={(e) => setAbhaId(e.target.value)}
        />
        <Input
          label="Name *"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email *"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Phone *"
          type="number"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          label="Age"
          type="number"
          name="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min="0"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Height (cm)"
            type="number"
            name="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="0"
            step="0.01"
          />
          <Input
            label="Weight (kg)"
            type="number"
            name="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        <Textarea
          label="Address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <GenderInput onChange={setGender} value={gender} />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow flex items-center justify-center gap-2 cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center justify-center gap-2 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <FiSave size={18} /> {editingPatient ? "Update" : "Save"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Confirmation Modal component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-30 cursor-pointer"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full z-10 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const PatientsTable: React.FC<{
  onRefresh: () => void;
  onEditPatient: (patient: Patient) => void;
}> = ({ onRefresh, onEditPatient }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [userId]);

  const fetchPatients = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/doctor/patients/${userId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.Patients) {
          setPatients(data.Patients);
          setError(null);
        } else {
          setPatients([]);
          setError("No patients found for this doctor.");
        }
      } else {
        console.error("Failed to fetch patients data");
        setError("Failed to fetch patients data.");
      }
    } catch (err) {
      console.error("Error fetching patients data:", err);
      setError("Error fetching patients data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (patient: Patient) => {
    setPatientToDelete(patient);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete || !userId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/doctor/patients/${userId}/delete/${patientToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Patient deleted successfully");
        fetchPatients(); // Refresh the list after deletion
      } else {
        const errorData = await response.json();
        console.error("Failed to delete patient:", errorData);
        setError(errorData.message || "Failed to delete patient");
      }
    } catch (err) {
      console.error("Error deleting patient:", err);
      setError("Error deleting patient");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading patients...</div>;
  }

  if (patients.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No patients found. Add your first patient by clicking "Add New Patient".
      </div>
    );
  }

  if (error && patients.length === 0) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <table className="w-full border-collapse border-0">
        <thead>
          <tr className="bg-gray-50 text-gray-600">
            <th className="p-3 font-medium text-left">#</th>
            <th className="p-3 font-medium text-left">Patient Id</th>
            <th className="p-3 font-medium text-left">Name</th>
            <th className="p-3 font-medium text-left">Age</th>
            <th className="p-3 font-medium text-left">Phone</th>
            <th className="p-3 font-medium text-left">Abha Id</th>
            <th className="p-3 font-medium text-left">Prescriptions</th>
            <th className="p-3 font-medium text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr
              key={patient.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="p-3 text-gray-700">{index + 1}</td>
              <td className="p-3 text-gray-700">{patient.id}</td>
              <td className="p-3 text-gray-700">{patient.name}</td>
              <td className="p-3 text-gray-700">{patient.age}</td>
              <td className="p-3 text-gray-700">{patient.phone}</td>
              <td className="p-3 text-gray-700">{patient.abha_id || "-"}</td>
              <td className="p-3">
                <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm flex items-center gap-1 cursor-pointer">
                  <FiEye /> View
                </button>
              </td>
              <td className="p-3 flex gap-2">
                <button
                  className="p-2 border rounded-md bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center w-8 h-8 cursor-pointer"
                  aria-label="Edit patient"
                  onClick={() => onEditPatient(patient)}
                >
                  <FiEdit />
                </button>
                <button
                  className="p-2 border rounded-md bg-red-100 hover:bg-red-200 transition flex items-center justify-center w-8 h-8 cursor-pointer text-red-600"
                  aria-label="Delete patient"
                  onClick={() => handleDeleteClick(patient)}
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        message={`Are you sure you want to delete ${patientToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

const Patients: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-5xl mx-auto w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          {showForm
            ? editingPatient
              ? "Edit Patient"
              : "Create New Patient"
            : "All Patients"}
        </h1>
        <button
          onClick={() => (showForm ? handleBack() : setShowForm(true))}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 text-sm rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
        >
          {showForm ? (
            <>
              <LuMenu size={18} /> All Patients
            </>
          ) : (
            <>
              <LuPlus size={18} /> Add New Patient
            </>
          )}
        </button>
      </div>
      {showForm ? (
        <PatientForm
          onBack={handleBack}
          onPatientAdded={handleRefresh}
          editingPatient={editingPatient}
        />
      ) : (
        <PatientsTable
          onRefresh={handleRefresh}
          onEditPatient={handleEditPatient}
          key={refreshCounter}
        />
      )}
    </div>
  );
};

export default Patients;
