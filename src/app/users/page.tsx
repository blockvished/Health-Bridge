"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

type Doctor = {
  id: number;
  name: string;
  specialization: string;
  image_link: string;
  experience: number;
};

const ITEMS_PER_PAGE = 8;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/public/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data.doctors))
      .catch((err) => console.error(err));
  }, []);

  const specializations = Array.from(
    new Set(doctors.map((d) => d.specialization))
  ).sort();

  const filtered = doctors.filter((doc) => {
    const matchesSpecialization = specialization
      ? doc.specialization === specialization
      : true;
    const matchesExperience = experience
      ? doc.experience === parseInt(experience)
      : true;
    const matchesName = name
      ? doc.name.toLowerCase().includes(name.toLowerCase())
      : true;
    return matchesSpecialization && matchesExperience && matchesName;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const generateDoctorSlug = (doctorName: string) => {
    return doctorName.replace(/ /g, "-");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navigation */}
      <Navbar />

      {/* Hero Section with Title and Description */}
      <div className="bg-white shadow-md py-8 px-4 md:px-8 lg:px-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Our Expert Medical Practitioners and Specialists
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          The home to 1500+ eminent doctors in the world, most of whom are
          pioneers in their respective fields. The highest quality of care
          through a team-based, doctor-led model.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-4 md:px-8 lg:px-12 py-4 flex flex-wrap gap-4 items-center bg-white shadow-md">
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="">General Physician and Surgeon</option>{" "}
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="">Select Experience</option>{" "}
          {[...Array(50)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} years
            </option>
          ))}
        </select>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name"
          className="border p-2 rounded w-48 text-sm"
        />
      </div>

      <div className="p-4 md:p-8 lg:p-12 grow grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {paginated.length > 0 ? (
          paginated.map((doc) => (
            <Link
              key={doc.id}
              href={`/profile/${generateDoctorSlug(doc.name)}`}
              className="bg-white shadow rounded-2xl overflow-hidden p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-200" // Added cursor-pointer and hover effect
            >
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={doc.image_link}
                  alt={doc.name}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-1">
                  <span className="text-blue-600">✔</span> {doc.name}
                </h2>
                <p className="text-gray-500">{doc.specialization}</p>
                <p className="text-sm text-gray-600">
                  {doc.experience} years experience
                </p>
                {/* Removed the individual Link for "Book Appointment" */}
                <div className="mt-3 inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200">
                  Book Appointment
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-600 px-4 md:px-8 lg:px-12">
            No doctors match the filters.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center my-4 gap-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-2.5 py-1 border rounded disabled:opacity-40 text-sm"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-2.5 py-1 rounded border text-sm ${
                page === i + 1 ? "bg-blue-500 text-white" : "bg-white text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-2.5 py-1 border rounded disabled:opacity-40 text-sm"
          >
            Next
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}