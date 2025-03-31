"use client";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const doctors = [
  {
    id: 1,
    name: "Dr. Dheeraj Singh",
    email: "doctor1@livedoctors.in",
    image: "/doctor1.jpg", // Replace with the actual image URL
    rating: 3, // Example rating out of 5
    feedback: "huh",
  },
];

export default function DoctorList() {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-lg font-semibold mb-4">Doctors</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-4">#</th>
              <th className="p-4">Thumb</th>
              <th className="p-4">Doctor Info</th>
              <th className="p-4">Your Feedback</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="border-b last:border-none">
                <td className="p-4">{doctor.id}</td>
                <td className="p-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                </td>
                <td className="p-4">
                  <p className="font-semibold">{doctor.name}</p>
                  <p className="text-sm text-gray-500">{doctor.email}</p>
                </td>
                <td className="p-4 flex flex-col">
                  <div className="flex items-center text-orange-500">
                    {[...Array(5)].map((_, index) => (
                      index < doctor.rating ? (
                        <AiFillStar key={index} />
                      ) : (
                        <AiOutlineStar key={index} />
                      )
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{doctor.feedback}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
