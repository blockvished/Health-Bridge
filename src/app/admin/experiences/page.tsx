"use client";
import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Define the type for the experience data
interface Experience {
  id: number;
  doctorId: number;
  title: string;
  yearFrom: number;
  yearTo: number;
  details: string;
  sortOrder: number;
}

const ExperienceTable = ({ doctorId = 1 }: { doctorId?: number }) => {
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/doctor/experience/${doctorId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        setExperienceData(data);
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
        <h2 className="text-xl font-semibold">Experiences</h2>
        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
          <FaPlus /> Create New
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center">Loading experience data...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Duration</th>
                <th className="py-2 px-4 text-left">Details</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {experienceData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">No experience data available</td>
                </tr>
              ) : (
                experienceData.map((exp, index) => (
                  <tr key={exp.id} className="border-t">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{exp.title}</td>
                    <td className="py-2 px-4">{exp.yearFrom} - {exp.yearTo}</td>
                    <td className="py-2 px-4">{exp.details}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        <FaEdit />
                      </button>
                      <button className="bg-red-100 text-red-500 px-2 py-1 rounded">
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

// ✅ Fix: Ensure a valid default export in `page.tsx`
export default function Page() {
  return <ExperienceTable doctorId={1} />;
}
