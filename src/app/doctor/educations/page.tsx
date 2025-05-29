"use client";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

interface Education {
  id: number;
  doctorId: number;
  title: string;
  institution: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  details: string | null;
  sortOrder: number | null;
}

const EducationTable = () => {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    institution: "",
    yearFrom: "",
    yearTo: "",
    details: "",
    sortOrder: "",
  });
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  const fetchEducationData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/doctor/profile/education/${userId}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch education data: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("API Response (GET):", result);
      setEducationData(Array.isArray(result?.Educations) ? result.Educations : []);
    } catch (error) {
      console.error("Error fetching education data:", error);
      setEducationData([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchEducationData();
  }, [fetchEducationData]);
  
  useEffect(() => {
    // Set default sort order to next available number for new entries
    if (showForm && !editMode) {
      setFormData((prev) => ({
        ...prev,
        sortOrder: (educationData.length + 1).toString(),
      }));
    }
  }, [showForm, educationData.length, editMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      institution: "",
      yearFrom: "",
      yearTo: "",
      details: "",
      sortOrder: "",
    });
    setEditMode(false);
    setCurrentId(null);
    setShowForm(false);
  };

  const handleEdit = (edu: Education) => {
    setFormData({
      title: edu.title,
      institution: edu.institution || "",
      yearFrom: edu.yearFrom?.toString() || "",
      yearTo: edu.yearTo?.toString() || "",
      details: edu.details || "",
      sortOrder: edu.sortOrder?.toString() || "",
    });
    setEditMode(true);
    setCurrentId(edu.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!userId) return;
    const payload = {
      ...formData,
      yearFrom: formData.yearFrom ? parseInt(formData.yearFrom) : null,
      yearTo: formData.yearTo ? parseInt(formData.yearTo) : null,
      sortOrder: formData.sortOrder
        ? parseInt(formData.sortOrder)
        : educationData.length + 1,
    };

    try {
      let response;
      if (editMode && currentId) {
        // Update existing education
        response = await fetch(`/api/doctor/profile/education/${userId}`, {
          // Use userId in the URL for update as well
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentId, ...payload }), // Include the ID for update
        });
      } else {
        // Create new education
        response = await fetch(`/api/doctor/profile/education/${userId}`, {
          // Use userId in the URL for create
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        resetForm();
        fetchEducationData(); // Refresh data
      } else {
        const errorData = await response.json();
        console.error("Failed to save/update education:", errorData);
        // Optionally display an error message to the user
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education?")) return;

    try {
      const response = await fetch(
        `/api/doctor/profile/education/${userId}?id=${id}`, // Include id as a query parameter for delete
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setEducationData(educationData.filter((edu) => edu.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete education:", errorData);
        // Optionally display an error message to the user
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Educations</h2>
        <button
          onClick={() => {
            if (showForm && editMode) {
              resetForm();
            } else {
              setShowForm(!showForm);
              if (editMode) resetForm();
            }
          }}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer"
        >
          {showForm ? "Cancel" : (
            <>
              <FaPlus /> Create New
            </>
          )}
        </button>
      </div>

      {showForm ? (
        <div className="border rounded-xl p-4 mb-6">
          <h3 className="text-lg font-medium mb-4">
            {editMode ? "Edit Education" : "Add New Education"}
          </h3>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-red-400 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Institution</label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Year to years</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="yearFrom"
                value={formData.yearFrom}
                onChange={handleInputChange}
                className="w-1/2 border rounded px-3 py-2"
                placeholder="From"
              />
              <input
                type="number"
                name="yearTo"
                value={formData.yearTo}
                onChange={handleInputChange}
                className="w-1/2 border rounded px-3 py-2"
                placeholder="To"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 h-24"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Sort Order</label>
            <input
              type="number"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Order in list"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
          >
            {editMode ? "✓ Update" : "✓ Save"}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Institution</th>
                <th className="py-2 px-4 text-left">Years</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    <FaSpinner className="animate-spin inline-block mr-2" />
                    Loading education data...
                  </td>
                </tr>
              ) : educationData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    {`No education records found. Click "Create New" to add one.`}
                  </td>
                </tr>
              ) : (
                educationData.map((edu, index) => (
                  <tr key={edu.id} className="border-t">
                    <td className="py-2 px-4">{edu.sortOrder || index + 1}</td>
                    <td className="py-2 px-4">{edu.title}</td>
                    <td className="py-2 px-4">{edu.institution}</td>
                    <td className="py-2 px-4">
                      {edu.yearFrom && edu.yearTo
                        ? `${edu.yearFrom} - ${edu.yearTo}`
                        : edu.yearFrom
                        ? `${edu.yearFrom} -`
                        : edu.yearTo
                        ? `- ${edu.yearTo}`
                        : ""}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(edu)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-500 px-2 py-1 rounded cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default function Page() {
  return <EducationTable />;
}