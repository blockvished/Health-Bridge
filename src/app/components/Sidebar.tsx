import Link from "next/link";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", link: "/dashboard", svg: "🏠" },
  { name: "Subscription", link: "#", svg: "📜" },
  {
    name: "Settings",
    link: "#",
    svg: "⚙️",
    dropdown: [
      { name: "Departments", link: "#" },
      { name: "Set Schedule", link: "#" },
      { name: "Consultation Settings", link: "#" },
      { name: "QR Code", link: "#" },
    ],
  },
  { name: "Transactions", link: "#", svg: "💳" },
  { name: "Custom Domain", link: "#", svg: "🌐" },
  {
    name: "Payouts",
    link: "#",
    svg: "💰",
    dropdown: [
      { name: "Set Payout Account", link: "#" },
      { name: "Payouts", link: "#" },
    ],
  },
  { name: "Consultations", link: "#", svg: "🩺" },
  { name: "Staff", link: "#", svg: "👨‍⚕️" },
  {
    name: "Prescription Settings",
    link: "#",
    svg: "📝",
    dropdown: [
      { name: "Additional Advices", link: "#" },
      { name: "Diagnosis Tests", link: "#" },
    ],
  },
  { name: "Patients", link: "#", svg: "🏥" },
  {
    name: "Appointments",
    link: "#",
    svg: "📅",
    dropdown: [
      { name: "Create New", link: "#" },
      { name: "List by Date", link: "#" },
    ],
  },
  {
    name: "Drugs",
    link: "#",
    svg: "💊",
    dropdown: [
      { name: "Drugs", link: "#" },
      { name: "Bulk Import Drugs", link: "#" },
    ],
  },
  {
    name: "Profile",
    link: "#",
    svg: "👤",
    dropdown: [
      { name: "Personal Info", link: "#" },
      { name: "Manage Education", link: "#" },
      { name: "Manage Experiences", link: "#" },
    ],
  },
  {
    name: "Prescription",
    link: "#",
    svg: "📜",
    dropdown: [
      { name: "Create New", link: "#" },
      { name: "Prescriptions", link: "#" },
    ],
  },
  { name: "Rating & Reviews", link: "#", svg: "⭐" },
  { name: "Contact", link: "#", svg: "📞" },
  { name: "Change Password", link: "#", svg: "🔒" },
  { name: "Logout", link: "#", svg: "🚪" },
];

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="w-60 bg-gray-800 text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-700 text-sm">
        <span className="text-lg">🏥</span>
        <span className="font-semibold">Digambar Healthcare</span>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
        {menuItems.map((item, index) => (
          <div key={index}>
            {/* Main Menu Item */}
            <div
              onClick={() => item.dropdown && toggleDropdown(index)}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm"
            >
              <span className="mr-2">{item.svg}</span>
              <span>{item.name}</span>
              {item.dropdown && (
                <span className="ml-auto">
                  {openDropdown === index ? "▾" : "▸"}
                </span>
              )}
            </div>

            {/* Dropdown Items */}
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
