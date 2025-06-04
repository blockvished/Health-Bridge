"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8 text-sm text-gray-700">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8 lg:px-12">
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
          <div className="flex justify-center md:justify-start gap-3 mt-4 text-gray-600 text-lg">
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

        <div className="text-center md:text-left">
          <h3 className="font-semibold mb-3 text-gray-800">Pages</h3>
          <ul className="space-y-2">
            <li>
              <Link href="https://app.livedoctors.in/page/terms-of-service" className="hover:text-blue-600">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="https://app.livedoctors.in/page/privacy-policy" className="hover:text-blue-600">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="https://app.livedoctors.in/page/refund-policy" className="hover:text-blue-600">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="font-semibold mb-3 text-gray-800">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link href="https://app.livedoctors.in/pricing" className="hover:text-blue-600">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="https://app.livedoctors.in/faqs" className="hover:text-blue-600">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="https://app.livedoctors.in/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center py-4 border-t text-xs text-gray-500 px-4 md:px-8 lg:px-12">
        Copyright © 2025. Live Doctors. All Rights Reserved. An Initiative of{" "}
        <Link href="#" className="text-blue-600 font-medium">Prgenix</Link>.
      </div>
    </footer>
  );
}
