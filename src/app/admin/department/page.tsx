"use client";

import React, { useState } from "react";
import { FaPen, FaTrash, FaPlus, FaCheck } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Department {
  id: number;
  name: string;
}

const DepartmentForm: React.FC<{
  onSave: (name: string, id?: number) => void;
  onCancel: () => void;
  initialName?: string;
  initialId?: number;
}> = ({ onSave, onCancel, initialName, initialId }) => {
  const [name, setName] = useState(initialName || "");

  return (
    <div className="w-full bg-white p-6 mx-auto">
      {/* Header with Back Button */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {initialId ? "Edit Department" : "Add New Department"}
        </h2>
      </div>

      {/* Input Field */}
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Title
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter department name"
      />

      {/* Buttons */}
      <div className="mt-4 flex justify-start">
        <button
          onClick={() => onSave(name, initialId)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          <FaCheck /> Save
        </button>
      </div>
    </div>
  );
};

// 🔹 Main Department Page Component
const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: "Physiotherapist" },
    { id: 2, name: "Ayurvedic doctors" },
    { id: 3, name: "Sexologist" },
    { id: 4, name: "Urologist" },
    { id: 5, name: "Allopathic doctor" },
    { id: 6, name: "Homoeopathic" },
    { id: 7, name: "Otolaryngologist" },
    { id: 8, name: "Veterinarian" },
    { id: 9, name: "Pulmonologist" },
    { id: 10, name: "Gastroenterologist" },
    { id: 11, name: "Gynaecologist" },
    { id: 12, name: "Hepatologist" },
    { id: 13, name: "Psychiatrist" },
    { id: 14, name: "Oncologist" },
    { id: 15, name: "Nephrologist" },
    { id: 16, name: "Dentist" },
    { id: 17, name: "Ophthalmologist" },
    { id: 18, name: "Paediatrician" },
    { id: 19, name: "Neurologist" },
    { id: 20, name: "Orthopedic" },
    { id: 21, name: "Dermatologist" },
    { id: 22, name: "Cardiologist" },
    { id: 23, name: "Psychology" },
    { id: 24, name: "Physiotherapy" },
    { id: 25, name: "Naturopathy" },
    { id: 26, name: "Allopathy" },
    { id: 27, name: "Ayurveda" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<number | null>(null);

  const addDepartment = (name: string, id?: number) => {
    if (name.trim() === "") return;
    if (id) {
      setDepartments(departments.map(dept => dept.id === id ? { ...dept, name } : dept));
    } else {
      setDepartments([...departments, { id: departments.length + 1, name }]);
    }
    setShowForm(false);
    setEditDepartment(null);
  };

  const handleDelete = (id: number) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    setDeleteDepartmentId(null);
  };

  const handleEdit = (dept: Department) => {
    setEditDepartment(dept);
    setShowForm(true);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-lg sm:max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-row justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Departments</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditDepartment(null);
          }}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 mt-2 sm:mt-0 rounded-lg shadow-sm hover:bg-gray-200 transition"
        >
          {showForm ? (
            <IoArrowBack className="text-gray-500" />
          ) : (
            <FaPlus className="text-gray-500" />
          )}
          {showForm ? "Back" : "Add New"}
        </button>
      </div>

      {/* Add New Department Form */}
      {showForm ? (
        <DepartmentForm
          onSave={addDepartment}
          onCancel={() => {
            setShowForm(false);
            setEditDepartment(null);
          }}
          initialName={editDepartment?.name}
          initialId={editDepartment?.id}
        />
      ) : (
        // Table
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-gray-600 font-medium">#</th>
                <th className="p-3 text-left text-gray-600 font-medium">
                  Name
                </th>
                <th className="p-3 text-left text-gray-600 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-900">{dept.id}</td>
                  <td className="p-3 text-gray-900">{dept.name}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      onClick={() => handleEdit(dept)}
                    >
                      <FaPen className="text-gray-600" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                          <FaTrash />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete {dept.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(dept.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DepartmentPage;