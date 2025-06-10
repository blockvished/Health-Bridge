"use client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [enableRating, setEnableRating] = useState<boolean>(false);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      if (userId) {
        setLoading(true);
        try {
          const response = await fetch(`/api/doctor/ratings/${userId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch ratings: ${response.status}`);
          }
          const data: Rating[] = await response.json();
          setRatings(data);
        } catch (err) {
          const errorMessage = err instanceof Error
            ? err.message
            : "An error occurred while fetching ratings";
          toast.error(errorMessage);
          console.error("Error fetching ratings:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRatings();
  }, [userId]);

  // Fetch enable rating status
  useEffect(() => {
    const fetchEnableRatingStatus = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/doctor/enable_ratings/${userId}`);
          if (!response.ok) {
            setEnableRating(false);
            return; // Exit the function early if the response is not ok
          }

          const data = await response.json();
          // Check if data is an array with at least one item
          if (Array.isArray(data) && data.length > 0) {
            setEnableRating(
              data[0].enable !== undefined ? data[0].enable : true
            );
          } else if (data.enable !== undefined) {
            // Direct object with enable property
            setEnableRating(data.enable);
          } else {
            // Default to false if no clear enable property
            setEnableRating(false);
          }
        } catch (err) {
          console.error("Error fetching rating status:", err);
          toast.error("Failed to fetch rating status");
          setEnableRating(false);
        }
      }
    };

    fetchEnableRatingStatus();
  }, [userId]);

  // Toggle function for the rating button
  const toggleRating = async () => {
    if (!userId || updatingStatus) return;

    const newValue = !enableRating;
    setUpdatingStatus(true);

    try {
      const response = await fetch(`/api/doctor/enable_ratings/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enable: newValue }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update rating status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Rating status updated:", result);

      // Update state after successful API call
      setEnableRating(newValue);
      
      // Show success toast
      toast.success(
        `Rating ${newValue ? "enabled" : "disabled"} successfully!`
      );
    } catch (err) {
      console.error("Error updating rating status:", err);
      // Revert the visual state if API call fails
      setEnableRating(enableRating);
      
      const errorMessage = err instanceof Error ? err.message : "Failed to update rating status";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          Rating & Reviews
        </h3>
        <label className="flex items-center gap-2 text-gray-600 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={enableRating}
            onChange={toggleRating}
            disabled={updatingStatus}
          />
          <div
            className={`w-10 h-5 ${
              enableRating ? "bg-green-500" : "bg-gray-300"
            } rounded-full relative transition-colors duration-300 ${
              updatingStatus ? "opacity-50" : ""
            }`}
          >
            <div
              className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
                enableRating ? "left-6" : "left-1"
              }`}
            ></div>
          </div>
          <span className="whitespace-nowrap">
            {updatingStatus ? "Updating..." : "Enable rating in frontend"}
          </span>
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
                  <td className="p-4 text-sm">
                    {rating.text || "No feedback given."}
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </td>
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ 
          zIndex: 999999,
        }}
        toastStyle={{
          zIndex: 999999,
        }}
        limit={3} // Limit number of toasts
      />
    </div>
  );
}