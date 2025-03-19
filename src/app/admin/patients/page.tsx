"use client";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FiEdit, FiEye, FiSave } from "react-icons/fi";

const patients = [
  {
    id: 1,
    mrNo: "45826",
    name: "Patient",
    age: "0",
    phone: "924062456",
    address: "",
  },
  {
    id: 2,
    mrNo: "28705",
    name: "Raj Kumar",
    age: "35",
    phone: "9650561756",
    address: "",
  },
];

const PatientForm = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Input label="Name *" type="text" required />
          <Input label="Email *" type="email" required />
          <Input label="Phone *" type="text" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Age" type="number" />
          <Input label="Weight" type="text" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Textarea label="Present Address" />
          <Textarea label="Permanent Address" />
        </div>
        <GenderInput />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center justify-center gap-2">
          <FiSave size={18} /> Save
        </button>
      </form>
    </div>
  );
};

const Input = ({
  label,
  ...props
}: {
  label: string;
  type: string;
  required?: boolean;
}) => (
  <div>
    <label className="block text-gray-700 font-medium">{label}</label>
    <input
      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-blue-500"
      {...props}
    />
  </div>
);

const Textarea = ({ label }: { label: string }) => (
  <div>
    <label className="block text-gray-700 font-medium">{label}</label>
    <textarea className="w-full border border-gray-300 rounded-lg p-2 h-20 focus:outline-blue-500"></textarea>
  </div>
);

const GenderInput = () => (
  <div>
    <label className="block text-gray-700 font-medium">Gender</label>
    <div className="flex items-center space-x-6">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="gender"
          className="text-blue-600 focus:ring-blue-500"
        />{" "}
        <span>Male</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="gender"
          className="text-blue-600 focus:ring-blue-500"
        />{" "}
        <span>Female</span>
      </label>
    </div>
  </div>
);

const PatientsTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse border-0">
      <thead>
        <tr className="bg-gray-50 text-gray-600">
          <th className="p-3 font-medium text-left">#</th>
          <th className="p-3 font-medium text-left">Mr. No</th>
          <th className="p-3 font-medium text-left">Name</th>
          <th className="p-3 font-medium text-left">Age</th>
          <th className="p-3 font-medium text-left">Phone</th>
          <th className="p-3 font-medium text-left">Address</th>
          <th className="p-3 font-medium text-left">Prescriptions</th>
          <th className="p-3 font-medium text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient, index) => (
          <tr
            key={patient.id}
            className="border-b border-gray-200 hover:bg-gray-50 transition"
          >
            <td className="p-3 text-gray-700">{index + 1}</td>
            <td className="p-3 text-gray-700">{patient.mrNo}</td>
            <td className="p-3 text-gray-700">{patient.name}</td>
            <td className="p-3 text-gray-700">{patient.age}</td>
            <td className="p-3 text-gray-700">{patient.phone}</td>
            <td className="p-3 text-gray-700">{patient.address || "-"}</td>
            <td className="p-3">
              <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                <FiEye /> View
              </button>
            </td>
            <td className="p-3 flex gap-2">
              <button className="p-2 border rounded-md bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center w-8 h-8">
                <FiEdit />
              </button>
              <button className="p-2 border rounded-md bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center w-8 h-8">
                <MdDelete />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Patients: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-5xl mx-auto w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          {showForm ? "Create New Patient" : "All Patients"}
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 text-sm rounded-lg shadow-sm"
        >
          {showForm ? "← Back to Patients" : "+ Add new Patient"}
        </button>
      </div>
      {showForm ? (
        <PatientForm onBack={() => setShowForm(false)} />
      ) : (
        <PatientsTable />
      )}
    </div>
  );
};

export default Patients;
