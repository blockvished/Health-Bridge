"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type ProfileClientProps = {
  name: string
};

export default function ProfileClient({ name }: ProfileClientProps) {
  const nameFromSlug = decodeURIComponent(name).replace(/-/g, " ");

  useEffect(() => {
    fetch(`/api/public/doctors/${name}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
      });
  }, [name]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-100 shadow px-6 py-4 flex items-center justify-between">
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
            <Link href="/" className="hover:text-blue-500">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-blue-500">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-blue-500">
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/signin"
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
            >
              Sign In
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-grow flex items-center justify-center text-3xl font-semibold text-gray-800">
        Hello {nameFromSlug}
      </main>

      <footer className="bg-white border-t py-4 text-center relative">
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
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full bg-blue-100 hover:bg-blue-200 p-2"
          >
            <span className="text-blue-600">↑</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
