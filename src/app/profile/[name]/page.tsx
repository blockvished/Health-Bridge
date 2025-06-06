// app/profile/[name]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import DoctorHeader from "./DoctorHeader";
import BookingAppointment from "./BookingAppointment";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import { LoadingSpinner, ErrorMessage, NotFound } from "./LoadingErrorComponents";
import { ApiResponse, PageProps } from "./doctor";

export default function ProfilePage({ params }: PageProps) {
  const [profileData, setProfileData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
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
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [resolvedParams.name]);

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
        />
        
        <EducationSection educations={educations} />
        
        <ExperienceSection experience={experience} />
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