"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center px-4 md:px-8 lg:px-12">
      <Link href="/">
        <Image
          src="/logo_live_doctors.png"
          alt="Live Doctors"
          width={160}
          height={40}
        />
      </Link>
      <div className="hidden md:flex space-x-6 text-gray-700">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
        <Link href="/users" className="text-blue-600 font-semibold">Experts</Link>
        <Link href="/faqs" className="hover:text-blue-600">FAQs</Link>
        <Link href="/contact" className="hover:text-blue-600">Contact</Link>
      </div>
      <div className="flex space-x-2">
        <Link
          href="/"
          className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
        >
          Sign In
        </Link>
        <Link
          href="/get-started"
          className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
