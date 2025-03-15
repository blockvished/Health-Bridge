import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ExperienceTable = () => {
  const experienceData = [
    {
      id: 1,
      title: "Cardiologist, Digambar Healthcare Center",
      details:
        "Introduced innovative preventive cardiology practices and managed complex cardiology...",
    },
    {
      id: 2,
      title: "Cardiologist, Max Hospital Delhi",
      details:
        "Developed and implemented advanced treatment protocols. He led a team of cardiologists...",
    },
    {
      id: 3,
      title: "Cardiologist, Surya Laxmi Hospital",
      details:
        "Established a comprehensive heart failure management program. He played a key role...",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Experiences</h2>
        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
          <FaPlus /> Create New
        </button>
      </div>

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
            {experienceData.map((exp, index) => (
              <tr key={exp.id} className="border-t">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{exp.title}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExperienceTable;
