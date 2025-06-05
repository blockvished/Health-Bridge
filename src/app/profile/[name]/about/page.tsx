// /app/profile/[name]/about/page.tsx
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
  clinic: string;
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

type ExperienceData = {
  id: number;
  doctorId: number;
  title: string;
  organization: string;
  yearFrom: number;
  yearTo: number | null;
  details: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  doctor: DoctorData;
  consultation: ConsultationData;
  educations: EducationData[];
  experience: ExperienceData[];
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

  const renderExperienceSection = () => {
    if (!profileData?.experience || profileData.experience.length === 0) {
      return null;
    }

    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-3">
              <span className="text-2xl">💡</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Experiences</h2>
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 bg-green-200 h-full"></div>

          {profileData.experience
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((exp, index) => (
              <div key={exp.id} className="relative mb-12 last:mb-0">
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Experience card */}
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "mr-auto pr-8" : "ml-auto pl-8"
                  }`}
                >
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    {/* Year badge */}
                    <div className="text-right mb-3">
                      <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {exp.yearFrom}-{exp.yearTo ? exp.yearTo : "Present"}
                      </span>
                    </div>

                    {/* Position title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {exp.title}, {exp.organization}
                    </h3>

                    {/* Details */}
                    {exp.details && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {exp.details}
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {`Clinic & Medical Practice`}
            </h1>
          </div>
          <div className="text-justify">
            <p className="text-lg text-gray-600 leading-relaxed">
              {doctor.clinic}
            </p>
          </div>
        </div>

        {/* Education Section */}
        {renderEducationSection()}

        {/* Experience Section */}
        {renderExperienceSection()}
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
              href="/"
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
