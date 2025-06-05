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

type TimeSlot = {
  from: string;
  to: string;
};

type AvailabilityData = {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  isActive: boolean;
  times: TimeSlot[];
};

type ApiResponse = {
  doctor: DoctorData;
  consultation: ConsultationData;
  educations: EducationData[];
  experience: ExperienceData[];
  times: AvailabilityData[];
};

// Booking form state type
type BookingFormData = {
  consultationMode: string;
  date: string;
  timeSlot: string;
};

export default function ProfilePage({ params }: PageProps) {
  const [profileData, setProfileData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking form state
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    consultationMode: "",
    date: "",
    timeSlot: "",
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);

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

  // Get active days for date picker
  const getActiveDays = () => {
    if (!profileData?.times) return [];
    return profileData.times.filter((day) => day.isActive);
  };

  // Check if a date is available for booking
  const isDateAvailable = (dateString: string) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const activeDays = getActiveDays();
    return activeDays.some((day) => day.dayOfWeek === dayName);
  };

  // Handle date change and update available time slots
  const handleDateChange = (selectedDate: string) => {
    setBookingForm((prev) => ({ ...prev, date: selectedDate, timeSlot: "" }));

    if (selectedDate && profileData?.times) {
      const date = new Date(selectedDate);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const dayAvailability = profileData.times.find(
        (day) => day.dayOfWeek === dayName
      );

      if (dayAvailability && dayAvailability.isActive) {
        setAvailableTimeSlots(dayAvailability.times);
      } else {
        setAvailableTimeSlots([]);
      }
    } else {
      setAvailableTimeSlots([]);
    }
  };

  // Format time from 24h to 12h format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !bookingForm.consultationMode ||
      !bookingForm.date ||
      !bookingForm.timeSlot
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Console log the booking data
    console.log("Booking Form Data:", {
      ...bookingForm,
      doctorId: profileData?.doctor.id,
      doctorName: profileData?.doctor.name,
      consultationFees: profileData?.consultation.consultationFees,
      selectedTimeSlot: availableTimeSlots.find(
        (slot) => `${slot.from}-${slot.to}` === bookingForm.timeSlot
      ),
    });
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const renderBookAppointmentSection = () => {
    if (!profileData?.times || !profileData?.consultation) {
      return null;
    }

    return (
      <div className="max-w-5xl mx-auto px-6 py-16 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Availability */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Before booked an appointment check the availability
            </h2>

            <div className="space-y-3">
              {profileData.times.map((dayAvailability) => (
                <div key={dayAvailability.id} className="flex items-center">
                  {dayAvailability.isActive ? (
                    <div className="flex items-center text-green-600">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="font-medium">
                        {dayAvailability.dayOfWeek}
                      </span>
                      <span className="ml-2 text-blue-600 text-sm">(Open)</span>
                      {dayAvailability.times.length > 0 && (
                        <span className="ml-2 text-gray-500 text-sm">
                          {dayAvailability.times
                            .map(
                              (slot) =>
                                `${formatTime(slot.from)}-${formatTime(slot.to)}`
                            )
                            .join(", ")}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <span className="text-red-500 mr-3">✗</span>
                      <span className="font-medium">
                        {dayAvailability.dayOfWeek}
                      </span>
                      <span className="ml-2 text-red-600 text-sm">(Close)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Book Appointment Form */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">📅</span>
              <h2 className="text-2xl font-bold text-gray-900">
                Book Appointment
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Consultation Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Mode <span className="text-red-500">*</span>
                </label>
                <select
                  value={bookingForm.consultationMode}
                  onChange={(e) =>
                    setBookingForm((prev) => ({
                      ...prev,
                      consultationMode: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Mode</option>
                  <option value="offline">Offline (In-person)</option>
                  {profileData.consultation.isLiveConsultationEnabled && (
                    <option value="online">Online (Video Call)</option>
                  )}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={bookingForm.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {bookingForm.date && !isDateAvailable(bookingForm.date) && (
                  <p className="text-red-500 text-sm mt-1">
                    Doctor is not available on this day. Please select from
                    available days.
                  </p>
                )}
              </div>

              {/* Time Slot */}
              {bookingForm.date &&
                isDateAvailable(bookingForm.date) &&
                availableTimeSlots.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Time Slots{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {availableTimeSlots.map((slot, index) => (
                        <label key={index} className="flex items-center">
                          <input
                            type="radio"
                            name="timeSlot"
                            value={`${slot.from}-${slot.to}`}
                            checked={
                              bookingForm.timeSlot === `${slot.from}-${slot.to}`
                            }
                            onChange={(e) =>
                              setBookingForm((prev) => ({
                                ...prev,
                                timeSlot: e.target.value,
                              }))
                            }
                            className="mr-3"
                          />
                          <span className="text-gray-700">
                            {formatTime(slot.from)} - {formatTime(slot.to)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

              {/* Consultation Fee */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">
                    Consultation Fee:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    ₹ {profileData.consultation.consultationFees}.00
                  </span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={
                  !bookingForm.consultationMode ||
                  !bookingForm.date ||
                  !bookingForm.timeSlot ||
                  !isDateAvailable(bookingForm.date)
                }
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

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

        {/* Book Appointment Section */}
        {renderBookAppointmentSection()}

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
