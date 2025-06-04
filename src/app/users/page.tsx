"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import '@fortawesome/fontawesome-free/css/all.min.css';

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navigation */}
      <nav className="bg-white shadow p-4 flex justify-between items-center px-4 md:px-8 lg:px-12"> {/* Added horizontal padding */}
        <Link href="/">
          <Image
            src="/logo_live_doctors.png"
            alt="Live Doctors"
            width={160}
            height={40}
          />
        </Link>
        <div className="hidden md:flex space-x-6 text-gray-700">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/pricing" className="hover:text-blue-600">
            Pricing
          </Link>
          <Link href="/experts" className="text-blue-600 font-semibold">
            {" "}
            Experts
          </Link>
          <Link href="/faqs" className="hover:text-blue-600">
            FAQs
          </Link>
          <Link href="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </div>
        <div className="flex space-x-2"> {/* Reduced space-x to space-x-2 */}
          <Link
            href="/sign-in"
            className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm" // Smaller padding and text size
          >
            Sign In
          </Link>
          <Link
            href="/get-started"
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm" // Smaller padding and text size
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section with Title and Description */}
      <div className="bg-white shadow-md py-8 px-4 md:px-8 lg:px-12 text-center"> {/* Added horizontal padding */}
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
      <div className="px-4 md:px-8 lg:px-12 py-4 flex flex-wrap gap-4 items-center bg-white shadow-md"> {/* Added horizontal padding */}
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border p-2 rounded text-sm" // Smaller text size
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
          className="border p-2 rounded text-sm" // Smaller text size
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
          className="border p-2 rounded w-48 text-sm" // Smaller text size
        />
      </div>

      <div className="p-4 md:p-8 lg:p-12 grow grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> {/* Added horizontal padding */}
        {paginated.length > 0 ? (
          paginated.map((doc) => (
            <div
              key={doc.id}
              className="bg-white shadow rounded-2xl overflow-hidden p-4 flex flex-col items-center"
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
                <button className="mt-3 inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200"> {/* Smaller padding and text size */}
                  Book Appointment
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 px-4 md:px-8 lg:px-12">No doctors match the filters.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center my-4 gap-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-2.5 py-1 border rounded disabled:opacity-40 text-sm" // Slightly smaller button
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-2.5 py-1 rounded border text-sm ${page === i + 1 ? "bg-blue-500 text-white" : "bg-white text-black"}`} // Slightly smaller button
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-2.5 py-1 border rounded disabled:opacity-40 text-sm" // Slightly smaller button
          >
            Next
          </button>
        </div>
      )}

      <footer className="bg-white border-t mt-8 text-sm text-gray-700">
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8 lg:px-12"> {/* Added horizontal padding */}
          {/* Column 1 */}
          <div className="text-center md:text-left">
            <Image
              src="/logo_live_doctors.png"
              alt="Live Doctors"
              width={160}
              height={40}
              className="mx-auto md:mx-0"
            />
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              Live Doctors is an all-in-one encompassing healthcare practice
              management system designed & managed by Prgenix Consultants LLP to
              streamline clinical operations and enhance marketing efforts for
              all the doctors and medical practitioners.
            </p>
            <div className="flex justify-center md:justify-start gap-3 mt-4 text-gray-600 text-lg"> {/* Slightly reduced gap and icon size */}
              <Link href="https://www.facebook.com/livedoctors.in">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link href="http://x.com/LiveDoctors24/">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link href="https://www.linkedin.com/company/livedoctorsofficial/">
                <i className="fab fa-linkedin-in"></i>
              </Link>
              <Link href="https://www.instagram.com/livedoctors/">
                <i className="fab fa-instagram"></i>
              </Link>
            </div>
          </div>

          {/* Column 2 */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3 text-gray-800">Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://app.livedoctors.in/page/terms-of-service"
                  className="hover:text-blue-600"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="https://app.livedoctors.in/page/privacy-policy"
                  className="hover:text-blue-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="https://app.livedoctors.in/page/refund-policy"
                  className="hover:text-blue-600"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3 text-gray-800">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://app.livedoctors.in/pricing"
                  className="hover:text-blue-600"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="https://app.livedoctors.in/faqs"
                  className="hover:text-blue-600"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="https://app.livedoctors.in/contact"
                  className="hover:text-blue-600"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="text-center py-4 border-t text-xs text-gray-500 px-4 md:px-8 lg:px-12"> {/* Added horizontal padding */}
          Copyright © 2025. Live Doctors. All Rights Reserved. An Initiative of{" "}
          <Link href="#" className="text-blue-600 font-medium">
            Prgenix
          </Link>
          .
        </div>
      </footer>
    </div>
  );
}