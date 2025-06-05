// /app/profile/[name]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    name: string;
  }>;
};

type ConsultationData = {
  id: number;
  doctorId: number;
  consultationFees: number;
  consultationLink: string;
  isLiveConsultationEnabled: boolean;
  mode: string;
};

type DoctorData = {
  id: number;
  name: string;
  specialization: string;
  degree: string;
  experience: number;
  aboutSelf: string;
  image: string;
};

type EducationData = {
  id: number;
  doctorId: number;
  title: string;
  institution: string;
  yearFrom: number;
  yearTo: number;
  details: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  doctor: DoctorData;
  consultation: ConsultationData;
  educations: EducationData[];
};

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

  const renderEducationSection = () => {
    if (!profileData?.educations || profileData.educations.length === 0) {
      return null;
    }

    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-3">
              <span className="text-2xl">🎓</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Education</h2>
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 bg-blue-200 h-full"></div>

          {profileData.educations
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((education, index) => (
              <div key={education.id} className="relative mb-12 last:mb-0">
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Education card */}
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "mr-auto pr-8" : "ml-auto pl-8"
                  }`}
                >
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    {/* Year badge */}
                    <div className="text-right mb-3">
                      <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {education.yearFrom} to {education.yearTo}
                      </span>
                    </div>

                    {/* Degree title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {education.title}
                    </h3>

                    {/* Institution */}
                    <p className="text-gray-600 font-medium mb-3">
                      {education.institution}
                    </p>

                    {/* Details if available */}
                    {education.details && (
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {education.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderProfileContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-lg text-gray-600">
            Loading doctor profile...
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Profile
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      );
    }

    if (!profileData) {
      return (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Profile Not Found
            </h2>
            <p className="text-yellow-700">
              No doctor information found for "{nameFromSlug}"
            </p>
          </div>
        </div>
      );
    }

    const { doctor, consultation } = profileData;

    return (
      <>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center">
            {/* Doctor Image */}
            <div className="flex-shrink-0 mr-12">
              {doctor.image ? (
                <div className="relative w-80 h-80">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-80 h-80 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-8xl text-gray-400">👨‍⚕️</span>
                </div>
              )}
            </div>

            {/* Doctor Information */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {doctor.name}
                </h1>
                <p className="text-xl text-blue-600 font-semibold mb-2">
                  {doctor.specialization}
                </p>
                {doctor.degree && (
                  <p className="text-lg text-gray-600 font-medium mb-4">
                    {doctor.degree}
                  </p>
                )}
              </div>

              {/* About Section */}
              {doctor.aboutSelf && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {doctor.aboutSelf}
                  </p>
                </div>
              )}

              {/* Experience Badge */}
              <div>
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-full">
                  <span className="text-2xl font-bold text-blue-600 mr-2">
                    {doctor.experience}+
                  </span>
                  <span className="font-semibold text-base">
                    Years Experience
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        {renderEducationSection()}
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo_live_doctors.png"
            alt="Live Doctors Logo"
            width={120}
            height={40}
            className="h-auto"
          />
        </Link>
        <ul className="flex space-x-6 text-gray-700">
          <li>
            <Link href="/" className="hover:text-blue-500 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:text-blue-500 transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:text-blue-500 transition-colors"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/signin"
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium"
            >
              Sign In
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-grow">{renderProfileContent()}</main>

      <footer className="bg-white border-t py-6 text-center relative">
        <div className="flex justify-center items-center space-x-2">
          <span className="text-gray-600">Powered by</span>
          <Image
            src="/logo_live_doctors.png"
            alt="Live Doctors Logo"
            width={100}
            height={32}
            className="h-auto"
          />
        </div>
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full bg-blue-100 hover:bg-blue-200 p-3 transition-colors shadow-md"
          >
            <span className="text-blue-600 font-bold">↑</span>
          </button>
        </div>
      </footer>
    </div>
  );
}