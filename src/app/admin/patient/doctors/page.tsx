"use client";

import { useState, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface Doctor {
  id: number;
  name: string;
  thumb: string;
  email: string;
  rating: boolean; // Indicates if a rating exists
  ratingId: number;
  stars: number; // The actual star rating
  text: string; // The feedback text
}

interface RatingState {
  ratingid: number; // Add ratingid
  doctorId: number; // Add doctorId
  rating: number | null;
  feedback: string;
}

interface RatingStates {
  [key: string]: RatingState;
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [ratingStates, setRatingStates] = useState<RatingStates>({});
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/patient/doctors");

        if (!response.ok) {
          throw new Error(`Failed to fetch doctors: ${response.status}`);
        }

        const fetchedDoctors: Doctor[] = await response.json();

        const initialRatingStates = fetchedDoctors.reduce<RatingStates>(
          (acc, doctor) => {
            acc[doctor.email] = {
              ratingid: doctor.rating ? doctor.ratingId : 0, // Set ratingId
              doctorId: doctor.id, // Set doctorId
              rating: doctor.rating ? doctor.stars : null,
              feedback: doctor.text,
            };
            return acc;
          },
          {}
        );

        setRatingStates(initialRatingStates);
        setDoctors(fetchedDoctors);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching doctors"
        );
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleStarClick = (doctorId: string, rating: number) => {
    setRatingStates((prevStates) => ({
      ...prevStates,
      [doctorId]: {
        ratingid: prevStates[doctorId]?.ratingid || 0, // Keep existing or default to 0
        doctorId: prevStates[doctorId]?.doctorId, // Keep existing doctorId
        rating,
        feedback: prevStates[doctorId]?.feedback || "",
      },
    }));
  };

  const handleFeedbackChange = (
    doctorId: string,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRatingStates((prevStates) => ({
      ...prevStates,
      [doctorId]: {
        ratingid: prevStates[doctorId]?.ratingid || 0, // Keep existing or default to 0
        doctorId: prevStates[doctorId]?.doctorId, // Keep existing doctorId
        rating: prevStates[doctorId]?.rating || null,
        feedback: event.target.value,
      },
    }));
  };

  const handleRateDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
  };

  const handleRatingSubmit = async (doctorId: string) => {
    const ratingData = ratingStates[doctorId];
    const doctorEmail = Object.keys(ratingStates).find(
      (key) => ratingStates[key]?.doctorId === ratingData.doctorId
    );

    try {
      const response = await fetch(`/api/patient/doctors/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to submit rating:", errorData);
        return;
      }

      console.log("Rating submitted successfully!");
      setSelectedDoctorId(null);

      // Optimistic update
      if (doctorEmail) {
        setDoctors((prevDoctors) =>
          prevDoctors.map((doc) =>
            doc.email === doctorEmail ? { ...doc, rating: true } : doc
          )
        );
      }
    } catch (error) {
      console.error("An error occurred while submitting rating:", error);
    }
  };

  const renderRatingStars = (doctorId: string) => {
    const currentRating = ratingStates[doctorId]?.rating || 0;
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={`${doctorId}-star-${starValue}`}
          type="button"
          onClick={() => handleStarClick(doctorId, starValue)}
          className={
            starValue <= currentRating ? "text-orange-500 cursor-pointer" : "text-gray-300 cursor-pointer"
          }
        >
          {starValue <= currentRating ? <AiFillStar /> : <AiOutlineStar />}
        </button>
      );
    });
  };

  if (error) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-blue-500 text-white rounded py-2 px-4 text-sm cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

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
            {doctors.length > 0 ? (
              doctors.map((doctor, index) => (
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
                        {[...Array(5)].map((_, i) =>
                          i < (ratingStates[doctor.email]?.rating || 0) ? (
                            <AiFillStar key={i} />
                          ) : (
                            <AiOutlineStar key={i} />
                          )
                        )}
                      </div>
                    )}
                    {ratingStates[doctor.email]?.feedback && (
                      <p className="text-sm text-gray-600">
                        {ratingStates[doctor.email]?.feedback}
                      </p>
                    )}
                    {!ratingStates[doctor.email]?.rating && (
                      <p className="text-gray-400">Not yet rated</p>
                    )}
                  </td>
                  <td className="p-4">
                    {selectedDoctorId === doctor.email ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center">
                          {renderRatingStars(doctor.email)}
                        </div>
                        <textarea
                          value={ratingStates[doctor.email]?.feedback || ""}
                          onChange={(e) =>
                            handleFeedbackChange(doctor.email, e)
                          }
                          placeholder="Your feedback..."
                          className="border rounded p-2 text-sm w-full"
                        />
                        <button
                          onClick={() => handleRatingSubmit(doctor.email)}
                          className="bg-blue-500 text-white rounded py-2 px-4 text-sm cursor-pointer"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => setSelectedDoctorId(null)}
                          className="text-gray-500 text-sm cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRateDoctor(doctor.email)}
                        className={
                          doctor.rating
                            ? "bg-green-400 text-white rounded py-2 px-4 text-sm cursor-pointer"
                            : "bg-green-500 text-white rounded py-2 px-4 text-sm cursor-pointer"
                        }
                      >
                        {doctor.rating ? "Edit" : "Rate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      <p className="text-gray-500">Loading doctors...</p>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No doctors found.
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
