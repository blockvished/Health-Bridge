"use client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";

interface Experience {
  id: number;
  doctorId: number;
  title: string;
  organization: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  details: string | null;
  sortOrder: number | null;
}

const ExperienceTable = () => {
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
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

  useEffect(() => {
    fetchExperienceData();
  }, [userId]);

  const fetchExperienceData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch(`/api/doctor/profile/experience/${userId}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      console.log("API Response (GET):", result);
      setExperienceData(
        Array.isArray(result?.Experiences) ? result.Experiences : []
      );
    } catch (error) {
      console.error("Error fetching experience data:", error);
      setExperienceData([]);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    // Set default sort order for new entries
    if (showForm && !editMode) {
      setFormData((prev) => ({
        ...prev,
        sortOrder: (experienceData.length + 1).toString(),
      }));
    }
  }, [showForm, experienceData.length, editMode]);

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
      organization: "",
      yearFrom: "",
      yearTo: "",
      details: "",
      sortOrder: "",
    });
    setEditMode(false);
    setCurrentId(null);
    setShowForm(false);
  };

  const handleEdit = (exp: Experience) => {
    setFormData({
      title: exp.title,
      organization: exp.organization || "",
      yearFrom: exp.yearFrom?.toString() || "",
      yearTo: exp.yearTo?.toString() || "",
      details: exp.details || "",
      sortOrder: exp.sortOrder?.toString() || "",
    });
    setEditMode(true);
    setCurrentId(exp.id);
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
        : experienceData.length + 1,
    };

    try {
      let response;
      if (editMode && currentId) {
        // Update existing experience
        response = await fetch(`/api/doctor/profile/experience/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentId, ...payload }),
        });
      } else {
        // Create new experience
        response = await fetch(`/api/doctor/profile/experience/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        resetForm();
        fetchExperienceData(); // Refresh data
      } else {
        const errorData = await response.json();
        // Optionally display an error message to the user
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const response = await fetch(
        `/api/doctor/profile/experience/${userId}?id=${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setExperienceData(experienceData.filter((exp) => exp.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete experience:", errorData);
        // Optionally display an error message to the user
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Experiences</h2>
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
            {editMode ? "Edit Experience" : "Add New Experience"}
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
            <label className="block mb-1 font-medium">Organization</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
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
                <th className="py-2 px-4 text-left">Organization</th>
                <th className="py-2 px-4 text-left">Years</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    <FaSpinner className="animate-spin inline-block mr-2" />
                    Loading experience data...
                  </td>
                </tr>
              ) : experienceData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No experience records found. Click "Create New" to add one.
                  </td>
                </tr>
              ) : (
                experienceData.map((exp, index) => (
                  <tr key={exp.id} className="border-t">
                    <td className="py-2 px-4">{exp.sortOrder || index + 1}</td>
                    <td className="py-2 px-4">{exp.title}</td>
                    <td className="py-2 px-4">{exp.organization}</td>
                    <td className="py-2 px-4">
                      {exp.yearFrom && exp.yearTo
                        ? `${exp.yearFrom} - ${exp.yearTo}`
                        : exp.yearFrom
                        ? `${exp.yearFrom} -`
                        : exp.yearTo
                        ? `- ${exp.yearTo}`
                        : ""}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
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
  return <ExperienceTable />;
}