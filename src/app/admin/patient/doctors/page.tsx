"use client";
import { useState, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

// Define the Doctor interface to match your API response
interface Doctor {
  name: string;
  thumb: string;
  email: string;
}

interface DoctorWithRating extends Doctor {
  rating: number | null;
  feedback: string;
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<DoctorWithRating[]>([]);
  const [ratingStates, setRatingStates] = useState<{
    [key: string]: { rating: number | null; feedback: string };
  }>({});
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data from your API endpoint
    const fetchedDoctors: Doctor[] = [
      {
        name: "Dr. Dheeraj Singh",
        thumb: "/api/doctor/profile/info/images/1/1_picture.PNG",
        email: "vishal@agzfdx.jh",
      },
      {
        name: "Dr. Another One",
        thumb: "/doctor2.jpg",
        email: "another@example.com",
      },
    ];

    // Initialize the doctors state with null ratings and empty feedback
    const initialDoctorsWithRating = fetchedDoctors.map((doctor, index) => ({
      ...doctor,
      rating: ratingStates[doctor.email]?.rating || null,
      feedback: ratingStates[doctor.email]?.feedback || "",
    }));
    setDoctors(initialDoctorsWithRating);
  }, [ratingStates]);

  const handleStarClick = (doctorId: string, rating: number) => {
    setRatingStates((prevStates) => ({
      ...prevStates,
      [doctorId]: { ...prevStates[doctorId], rating },
    }));
  };

  const handleFeedbackChange = (
    doctorId: string,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRatingStates((prevStates) => ({
      ...prevStates,
      [doctorId]: { ...prevStates[doctorId], feedback: event.target.value },
    }));
  };

  const handleRateDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
  };

  const handleRatingSubmit = (doctorId: string) => {
    const updatedDoctors = doctors.map((doc) =>
      doc.email === doctorId
        ? { ...doc, rating: ratingStates[doctorId]?.rating, feedback: ratingStates[doctorId]?.feedback || "" }
        : doc
    );
    setDoctors(updatedDoctors);
    setSelectedDoctorId(null); // Close the form
  };

  const renderRatingStars = (doctorId: string) => {
    const currentRating = ratingStates[doctorId]?.rating || 0;
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={`${doctorId}-${starValue}`}
          type="button"
          onClick={() => handleStarClick(doctorId, starValue)}
          className={starValue <= currentRating ? "text-orange-500" : "text-gray-300"}
        >
          {starValue <= currentRating ? <AiFillStar /> : <AiOutlineStar />}
        </button>
      );
    });
  };

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
              <th className="p-4">Rate Doctor</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {doctors.map((doctor, index) => (
              <tr key={doctor.email} className="border-b last:border-none">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">
                  <img
                    src={doctor.thumb}
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
                <td className="p-4">
                  {ratingStates[doctor.email]?.rating !== null && (
                    <div className="flex items-center text-orange-500">
                      {[...Array(5)].map((_, i) => (
                        i < (ratingStates[doctor.email]?.rating || 0) ? (
                          <AiFillStar key={i} />
                        ) : (
                          <AiOutlineStar key={i} />
                        )
                      ))}
                    </div>
                  )}
                  {ratingStates[doctor.email]?.feedback && (
                    <p className="text-sm text-gray-600">
                      {ratingStates[doctor.email]?.feedback}
                    </p>
                  )}
                  {!ratingStates[doctor.email]?.rating && !ratingStates[doctor.email]?.feedback && (
                    <p className="text-gray-400">Not yet rated</p>
                  )}
                </td>
                <td className="p-4">
                  {selectedDoctorId === doctor.email ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">{renderRatingStars(doctor.email)}</div>
                      <textarea
                        value={ratingStates[doctor.email]?.feedback || ""}
                        onChange={(e) => handleFeedbackChange(doctor.email, e)}
                        placeholder="Your feedback..."
                        className="border rounded p-2 text-sm w-full"
                      />
                      <button
                        onClick={() => handleRatingSubmit(doctor.email)}
                        className="bg-blue-500 text-white rounded py-2 px-4 text-sm"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => setSelectedDoctorId(null)}
                        className="text-gray-500 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRateDoctor(doctor.email)}
                      className="bg-green-500 text-white rounded py-2 px-4 text-sm"
                    >
                      Rate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}