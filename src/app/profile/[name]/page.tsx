// app/profile/[name]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import DoctorHeader from "./DoctorHeader";
import BookingAppointment from "./BookingAppointment";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import {
  LoadingSpinner,
  ErrorMessage,
  NotFound,
} from "./LoadingErrorComponents";
import { ApiResponse, PageProps } from "./doctor";

type RatingData = {
  id: number;
  rating: number;
  text: string | null;
  createdAt: Date;
  patientName: string;
};

type EnableRatingData = {
  doctorid: number;
  enable: boolean;
};

export default function ProfilePage({ params }: PageProps) {
  const [profileData, setProfileData] = useState<ApiResponse | null>(null);
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [isRatingEnabled, setIsRatingEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unwrap the params Promise
  const resolvedParams = use(params);
  const nameFromSlug = decodeURIComponent(resolvedParams.name).replace(
    /-/g,
    " "
  );

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Send the name parameter to backend
        const response = await fetch(
          `/api/public/doctors/${resolvedParams.name}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch doctor data: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        setProfileData(data);
        console.log(data.doctor.id);
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [resolvedParams.name]);

  // Fetch ratings when profile data is loaded
  useEffect(() => {
    const fetchRatingsData = async () => {
      if (!profileData?.doctor?.id) return;

      try {
        setRatingsLoading(true);

        // Check if ratings are enabled for this doctor
        console.log(profileData.doctor.id);
        const enableResponse = await fetch(
          `/api/doctor/enable_ratings/${profileData.doctor.id}`
        );

        if (enableResponse.ok) {
          const enableData: EnableRatingData[] = await enableResponse.json();
          const isEnabled = enableData.length > 0 && enableData[0].enable;
          setIsRatingEnabled(isEnabled);

          // If ratings are enabled, fetch the ratings
          if (isEnabled) {
            const ratingsResponse = await fetch(
              `/api/doctor/ratings/${profileData.doctor.id}`
            );
            if (ratingsResponse.ok) {
              const ratingsData: RatingData[] = await ratingsResponse.json();
              setRatings(ratingsData);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching ratings data:", err);
      } finally {
        setRatingsLoading(false);
      }
    };

    fetchRatingsData();
  }, [profileData]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAverageRating = (): number => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal place
  };

  const ReviewsSection = () => {
    if (!isRatingEnabled || ratingsLoading || ratings.length === 0) {
      return null;
    }

    const averageRating = calculateAverageRating();

    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full mr-3">
              <span className="text-2xl">⭐</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Patient Reviews
            </h2>
          </div>
          <div className="flex items-center justify-center mb-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <p className="text-gray-600">
            Average rating: {averageRating.toFixed(1)} out of 5 (
            {ratings.length} review{ratings.length !== 1 ? "s" : ""})
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ratings.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Patient name and date */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">
                  {review.patientName}
                </h4>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              {/* Rating stars */}
              <div className="mb-3">{renderStars(review.rating)}</div>

              {/* Review text */}
              {review.text && (
                <p className="text-gray-700 text-sm leading-relaxed">
                  "{review.text}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProfileContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (!profileData) {
      return <NotFound doctorName={nameFromSlug} />;
    }

    const { doctor, consultation, educations, experience, times } = profileData;

    return (
      <>
        <DoctorHeader doctor={doctor} />

        <BookingAppointment
          times={times}
          consultation={consultation}
          doctorId={doctor.id}
          doctorName={doctor.name}
          clinics={profileData.clinics} // Add this
        />

        <EducationSection educations={educations} />

        <ExperienceSection experience={experience} />

        <ReviewsSection />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-grow">{renderProfileContent()}</main>
      <Footer />
    </div>
  );
}
