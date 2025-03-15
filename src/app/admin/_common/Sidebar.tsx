"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaHospital,
  FaClinicMedical,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", link: "/admin/dashboard/user", svg: "🏠" },
  { name: "Subscription", link: "/admin/subscription", svg: "📜" },
  {
    name: "Settings",
    svg: "⚙️",
    dropdown: [
      { name: "Departments", link: "/admin/department" },
      { name: "Set Schedule", link: "/admin/appointment/assign" },
      { name: "Consultation Settings", link: "/admin/live_consults/settings" },
      { name: "QR Code", link: "/admin/profile/qr_code" },
    ],
  },
  { name: "Transactions", link: "/admin/payment/lists", svg: "💳" },
  { name: "Custom Domain", link: "/admin/domain/", svg: "🌐" },
  {
    name: "Payouts",
    svg: "💰",
    dropdown: [
      { name: "Set Payout Account", link: "/admin/payouts/setup_account" },
      { name: "Payouts", link: "/admin/payouts/user" },
    ],
  },
  { name: "Consultations", link: "/admin/live_consults", svg: "🩺" },
  { name: "Staff", link: "/admin/staff", svg: "👨‍⚕️" },
  {
    name: "Prescription Settings",
    svg: "📝",
    dropdown: [
      { name: "Additional Advices", link: "/admin/additional_advises" },
      { name: "Diagnosis Tests", link: "/admin/advise_investigation" },
    ],
  },
  { name: "Patients", link: "/admin/patients", svg: "🏥" },
  {
    name: "Appointments",
    svg: "📅",
    dropdown: [
      { name: "Create New", link: "/admin/appointment" },
      { name: "List by Date", link: "/admin/appointment/all_list" },
    ],
  },
  {
    name: "Drugs",
    svg: "💊",
    dropdown: [
      { name: "Drugs", link: "/admin/drugs" },
      { name: "Bulk Import Drugs", link: "/admin/drugs/import" },
    ],
  },
  {
    name: "Profile",
    svg: "👤",
    dropdown: [
      { name: "Personal Info", link: "/admin/profile" },
      { name: "Manage Education", link: "/admin/educations" },
      { name: "Manage Experiences", link: "/admin/experiences" },
    ],
  },
  {
    name: "Prescription",
    svg: "📜",
    dropdown: [
      { name: "Create New", link: "/admin/prescription" },
      { name: "Prescriptions", link: "/admin/prescription/all_prescription" },
    ],
  },
  { name: "Rating & Reviews", link: "/admin/dashboard/rating", svg: "⭐" },
  { name: "Contact", link: "/admin/contact/user", svg: "📞" },
  { name: "Change Password", link: "/admin/change_password", svg: "🔒" },
  { name: "Logout", link: "#", svg: "🚪" },
];

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="w-60 bg-gray-800 text-white flex flex-col h-screen fixed left-0 top-0">
      <div
        className="flex items-center gap-3 px-4 py-4 border-b border-gray-700 text-sm cursor-pointer hover:bg-gray-700"
        onClick={() => setIsModalOpen(true)}
      >
        <FaHospital className="text-lg" />
        <span className="font-semibold">Digambar Healthcare</span>
      </div>

      {isModalOpen && (
        <div className="absolute top-14 left-4 bg-white p-4 rounded-lg shadow-lg w-80 border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-700 font-semibold">
              Your Live Doctors Accounts
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>

          <div className="bg-blue-100 text-blue-600 p-3 rounded-md flex items-center justify-between">
            <span>Digambar Healthcare Center</span>
            <span>✔</span>
          </div>

          <div className="mt-4 space-y-2">
            <Link
              href="/admin/chamber"
              className="flex items-center text-blue-600 hover:underline"
            >
              <FaClinicMedical className="mr-2" /> Manage Clinics
            </Link>
            <Link
              href="/admin/profile"
              className="flex items-center text-gray-700 hover:underline"
            >
              <FaUser className="mr-2" /> Manage Profile
            </Link>
            <button className="flex items-center text-red-600 hover:underline">
              <FaSignOutAlt className="mr-2" /> Sign Out
            </button>
          </div>
        </div>
      )}

      <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.dropdown ? (
              <div
                onClick={() => toggleDropdown(index)}
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm"
              >
                <span className="mr-2">{item.svg}</span>
                <span>{item.name}</span>
                <span className="ml-auto">
                  {openDropdown === index ? "▾" : "▸"}
                </span>
              </div>
            ) : (
              <Link
                href={item.link}
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm"
              >
                <span className="mr-2">{item.svg}</span>
                <span>{item.name}</span>
              </Link>
            )}

            {item.dropdown && openDropdown === index && (
              <div className="ml-6">
                {item.dropdown.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.link}
                    className="block px-4 py-1 text-gray-400 hover:bg-gray-700 text-sm"
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
