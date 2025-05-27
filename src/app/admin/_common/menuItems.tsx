import { AiFillSetting } from "react-icons/ai";
import { RiFileListFill } from "react-icons/ri";
import { FaListUl, FaCog } from "react-icons/fa";
import { FiBarChart2, FiFileText } from "react-icons/fi";
import {
  FaUserMd,
  FaUsers,
  FaStar,
  FaEnvelope,
  FaFileAlt,
  FaCalendarAlt,
  FaWallet,
  FaUserInjured,
  FaQrcode,
  FaSlidersH,
  FaCalendarCheck,
  FaBuilding,
} from "react-icons/fa";
import {
  MdDashboard,
  MdSubscriptions,
  MdPayment,
  MdDomain,
  MdAttachMoney,
} from "react-icons/md";
import { JSX } from "react";

export interface MenuItem {
  name: string;
  link?: string;
  svg: JSX.Element;
  dropdown?: { name: string; link: string; svg?: JSX.Element }[];
}

export const menuItemsDoctor: MenuItem[] = [
  { name: "Dashboard", link: "/admin/dashboard/user", svg: <MdDashboard /> },
  {
    name: "Subscription",
    link: "/admin/subscription",
    svg: <MdSubscriptions />,
  },
  {
    name: "Settings",
    svg: <AiFillSetting />,
    dropdown: [      
      { name: "Verification", link: "/admin/dashboard/verification", svg: <FiFileText /> },
      { name: "Departments", link: "/admin/department", svg: <FaBuilding /> },
      {
        name: "Set Schedule",
        link: "/admin/appointment/assign",
        svg: <FaCalendarCheck />,
      },
      {
        name: "Consultation Settings",
        link: "/admin/live_consults/settings",
        svg: <FaSlidersH />,
      },
      { name: "QR Code", link: "/admin/profile/qr_code", svg: <FaQrcode /> },
    ],
  },
  {
    name: "Patient Transactions",
    link: "/admin/payment/lists",
    svg: <MdPayment />,
  },
  { name: "Custom Domain", link: "/admin/domain", svg: <MdDomain /> },
  {
    name: "Payouts",
    svg: <FaWallet />,
    dropdown: [
      { name: "Set Payout Account", link: "/admin/payouts/setup_account" },
      { name: "Payouts", link: "/admin/payouts/user" },
    ],
  },
  {
    name: "Social Channels",
    svg: <FaListUl />,
    dropdown: [
      {
        name: "Report",
        link: "/admin/posts/report",
        svg: <FaSlidersH />,
      },
      {
        name: "All Posts",
        link: "/admin/posts/all",
        svg: <FiBarChart2  />,
      },
      { name: "Connections", link: "/admin/posts/connections",svg: <FaCog /> },
    ],
  },
  { name: "Staff", link: "/admin/staff", svg: <FaUsers /> },
  { name: "Patients", link: "/admin/patients", svg: <FaUserInjured /> },
  {
    name: "Appointments",
    svg: <FaCalendarAlt />,
    dropdown: [
      { name: "Create New", link: "/admin/appointment" },
      { name: "List by Date", link: "/admin/appointment/all_list" },
    ],
  },
  {
    name: "Profile",
    svg: <FaUserMd />,
    dropdown: [
      { name: "Personal Info", link: "/admin/profile" },
      { name: "Manage Education", link: "/admin/educations" },
      { name: "Manage Experiences", link: "/admin/experiences" },
    ],
  },
  {
    name: "Prescription",
    svg: <FaFileAlt />,
    dropdown: [
      { name: "Create New", link: "/admin/prescription" },
      { name: "Prescriptions", link: "/admin/prescription/all_prescription" },
    ],
  },
  {
    name: "Rating & Reviews",
    link: "/admin/dashboard/rating",
    svg: <FaStar />,
  },
  { name: "Contact", link: "/admin/contact/user", svg: <FaEnvelope /> },
];

export const menuItemsPatient: MenuItem[] = [
  { name: "Dashboard", link: "/admin/dashboard/patient", svg: <MdDashboard /> },
  {
    name: "Rating & Reviews",
    link: "/admin/patient/doctors",
    svg: <FaStar />,
  },
  {
    name: "Appointments",
    link: "/admin/patient/appointments",
    svg: <FaCalendarAlt />,
  },

  {
    name: "Prescriptions",
    link: "/admin/patient/prescriptions",
    svg: <FaFileAlt />,
  },
];

export const menuItemsAdmin: MenuItem[] = [
  { name: "Dashboard", link: "/admin/dashboard", svg: <MdDashboard /> },
  { name: "Settings", link: "/admin/settings", svg: <AiFillSetting /> },
  {
    name: "Payouts",
    svg: <FaWallet />,
    dropdown: [
      { name: "Payout Settings", link: "/admin/payouts/settings" },
      { name: "Add Payout", link: "/admin/payouts/add" },
      { name: "Payout Requests", link: "/admin/payouts/requests" },
      { name: "Completed", link: "/admin/payouts/completed" },
    ],
  },
  {
    name: "Custom Domain",
    svg: <MdDomain />,
    dropdown: [
      { name: "Requests", link: "/admin/domain/request" },
      { name: "Settings", link: "/admin/domain/settings" },
    ],
  },
  { name: "Plans", link: "/admin/package", svg: <RiFileListFill /> },
  {
    name: "Transactions",
    link: "/admin/payment/transactions",
    svg: <MdAttachMoney />,
  },
  { name: "Users", link: "/admin/users", svg: <FaUsers /> },
  { name: "Contact", link: "/admin/contact", svg: <FaEnvelope /> },
];
