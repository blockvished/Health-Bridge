"use client";
import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

interface Education {
  id: number;
  doctorId: number;
  title: string;
  yearFrom: number;
  yearTo: number;
  details: string;
  sortOrder: number;
}

const EducationTable = ({ doctorId = 1 }) => {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/education/${doctorId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        setEducationData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching experience data:", err);
        setError("Failed to load experience data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperienceData();
  }, [doctorId]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Educations</h2>
        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
          <FaPlus /> Create New
        </button>
      </div>
      {loading ? (
        <div className="py-8 text-center">Loading education data...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Details</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {educationData.map((edu, index) => (
                <tr key={edu.id} className="border-t">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{edu.title}</td>
                  <td className="py-2 px-4">{edu.details}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      <FaEdit />
                    </button>
                    <button className="bg-red-100 text-red-500 px-2 py-1 rounded">
                      <FaTrash />
                    </button>
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

export default EducationTable;
