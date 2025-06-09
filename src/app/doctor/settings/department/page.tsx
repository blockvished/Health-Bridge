"use client";

import React, { useEffect, useState } from "react";
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
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleSave = () => {
    if (name.trim() === "") {
      toast.error("Department name cannot be empty");
      return;
    }
    onSave(name, initialId);
  };

  return (
    <div className="w-full bg-white p-6 mx-auto">
      {/* Header with Back Button */}
      <div className="flex justify-between mb-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 ml-3 text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition cursor-pointer"
        >
          <IoArrowBack /> Back
        </button>
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
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSave();
          }
        }}
      />

      {/* Buttons */}
      <div className="mt-4 flex justify-start">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 transition cursor-pointer"
        >
          <FaCheck /> Save
        </button>
        <button
          onClick={onCancel}
          className="ml-3 text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// 🔹 Main Department Page Component
const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (userId) {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/doctor/departments/${userId}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to fetch departments");
          }
          const data = await res.json();
          // **Access the departments array from data.departments**
          console.log(data);
          if (data && Array.isArray(data.departments)) {
            setDepartments(data.departments);
          } else {
            console.error(
              "Received incorrect data format for departments:",
              data
            );
            setError("Failed to load departments: Invalid data format.");
            toast.error("Failed to load departments: Invalid data format.");
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
            toast.error(`Failed to load departments: ${err.message}`);
          } else {
            setError(
              "An unexpected error occurred while fetching departments."
            );
            toast.error("An unexpected error occurred while fetching departments.");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDepartments();
  }, [userId]);

  const addOrUpdateDepartment = async (name: string, id?: number) => {
    if (!userId) {
      setError("User ID not found.");
      toast.error("User ID not found.");
      return;
    }
    if (name.trim() === "") {
      toast.error("Department name cannot be empty");
      return;
    }

    // Show loading toast
    const toastId = toast.loading(id ? "Updating department..." : "Creating department...");

    try {
      const method = "POST"; // API uses POST for both create and update, with id in body for update
      const body = JSON.stringify({ name, id });
      const res = await fetch(`/api/doctor/departments/${userId}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Failed to ${id ? "update" : "add"} department`
        );
      }

      const response = await res.json();
      const data: Department = response.department;

      if (id) {
        setDepartments(
          departments.map((dept) =>
            dept.id === id ? { ...dept, name: data.name, id: data.id } : dept
          )
        );
        toast.update(toastId, {
          render: "Department updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        setDepartments([...departments, data]);
        toast.update(toastId, {
          render: "Department created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }

      setShowForm(false);
      setEditDepartment(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.update(toastId, {
          render: `Error: ${err.message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        setError("An unexpected error occurred.");
        toast.update(toastId, {
          render: "An unexpected error occurred.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  const handleDeleteDepartment = async (id: number, name: string) => {
    if (!userId) {
      setError("User ID not found.");
      toast.error("User ID not found.");
      return;
    }

    // Show loading toast
    const toastId = toast.loading("Deleting department...");

    try {
      const res = await fetch(`/api/doctor/departments/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete department");
      }

      setDepartments(departments.filter((dept) => dept.id !== id));
      toast.update(toastId, {
        render: `Department "${name}" deleted successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.update(toastId, {
          render: `Error: ${err.message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        setError("An unexpected error occurred.");
        toast.update(toastId, {
          render: "An unexpected error occurred.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
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
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 mt-2 sm:mt-0 rounded-lg shadow-sm hover:bg-gray-200 transition cursor-pointer"
        >
          {showForm ? (
            <IoArrowBack className="text-gray-500" />
          ) : (
            <FaPlus className="text-gray-500" />
          )}
          {showForm ? "Back" : "Add New"}
        </button>
      </div>

      {loading && (
        <p className="mt-4 text-center text-gray-500">Loading departments...</p>
      )}
      {error && <p className="mt-4 text-center text-red-500">Error: {error}</p>}

      {/* Add New Department Form */}
      {showForm && (
        <div className="mt-4">
          <DepartmentForm
            onSave={addOrUpdateDepartment}
            onCancel={() => {
              setShowForm(false);
              setEditDepartment(null);
            }}
            initialName={editDepartment?.name}
            initialId={editDepartment?.id}
          />
        </div>
      )}

      {!showForm && !loading && !error && (
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
              {/* **Ensure departments is an array before mapping** */}
              {Array.isArray(departments) &&
                departments.map((dept, index) => (
                  <tr
                    key={dept.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-gray-900">{index + 1}</td>
                    <td className="p-3 text-gray-900">{dept.name}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer"
                        onClick={() => handleEdit(dept)}
                      >
                        <FaPen className="text-gray-600" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition cursor-pointer">
                            <FaTrash />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete {dept.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="cursor-pointer"
                              onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                            >
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

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default DepartmentPage;