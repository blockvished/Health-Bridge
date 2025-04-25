"use client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface Rating {
  id: number;
  rating: number;
  text: string | null;
  createdAt: string;
  patientName: string;
}

export default function RatingReviews() {
  const [userId, setUserId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      if (userId) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/doctor/ratings/${userId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch ratings: ${response.status}`);
          }
          const data: Rating[] = await response.json();
          setRatings(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "An error occurred while fetching ratings"
          );
          console.error("Error fetching ratings:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRatings();
  }, [userId]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={index}
          className={starValue <= rating ? "text-orange-500" : "text-gray-300"}
        >
          {starValue <= rating ? <AiFillStar /> : <AiOutlineStar />}
        </span>
      );
    });
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg m-8 shadow-md w-full max-w-3xl">
      {/* Future Active Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          Rating & Reviews
        </h3>
        <label className="flex items-center gap-2 text-gray-600 text-sm">
          <input type="checkbox" className="hidden" />
          <div className="w-10 h-5 bg-gray-300 rounded-full relative cursor-pointer">
            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300"></div>
          </div>
          <span className="whitespace-nowrap">Enable rating in frontend</span>
        </label>
      </div>

      {ratings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-4 font-semibold text-sm w-10">#</th>
                <th className="p-4 font-semibold text-sm w-40">Patient Name</th>
                <th className="p-4 font-semibold text-sm w-24">Rating</th>
                <th className="p-4 font-semibold text-sm w-auto">Review</th>
                <th className="p-4 font-semibold text-sm w-32">Rated On</th>
                {/* Future Active Column */}
                {/* <th className="p-4 font-semibold text-sm">Active</th> */}
              </tr>
            </thead>
            <tbody className="bg-white">
              {ratings.map((rating, index) => (
                <tr key={rating.id} className="border-b last:border-b-0">
                  <td className="p-4 text-sm">{index + 1}</td>
                  <td className="p-4 text-sm">{rating.patientName}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center">
                      {renderStars(rating.rating)}
                    </div>
                  </td>
                  <td className="p-4 text-sm">{rating.text || "No feedback given."}</td>
                  <td className="p-4 text-sm">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </td>
                  {/* Future Active Column */}
                  {/* <td className="p-4 text-sm">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs">
                      Active
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-t border-gray-200 pt-4 text-center text-gray-500 text-sm">
          {loading ? "Loading ratings..." : "No ratings or reviews yet."}
        </div>
      )}
    </div>
  );
}