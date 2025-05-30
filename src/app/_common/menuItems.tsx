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
  { name: "Dashboard", link: "/doctor/dashboard", svg: <MdDashboard /> },
  {
    name: "Subscription",
    link: "/doctor/subscription",
    svg: <MdSubscriptions />,
  },
  {
    name: "Settings",
    svg: <AiFillSetting />,
    dropdown: [      
      { name: "Verification", link: "/doctor/settings/verification", svg: <FiFileText /> },
      { name: "Departments", link: "/doctor/settings/department", svg: <FaBuilding /> },
      {
        name: "Set Schedule",
        link: "/doctor/settings/set-schedule",
        svg: <FaCalendarCheck />,
      },
      {
        name: "Consultation Settings",
        link: "/doctor/settings/live_consults",
        svg: <FaSlidersH />,
      },
      { name: "QR Code", link: "/doctor/settings/qr_code", svg: <FaQrcode /> },
    ],
  },
  {
    name: "Patient Transactions",
    link: "/doctor/payments",
    svg: <MdPayment />,
  },
  { name: "Custom Domain", link: "/doctor/domain", svg: <MdDomain /> },
  {
    name: "Payouts",
    svg: <FaWallet />,
    dropdown: [
      { name: "Set Payout Account", link: "/doctor/payouts/set_account" },
      { name: "Payouts", link: "/doctor/payouts/user" },
    ],
  },
  {
    name: "Social Channels",
    svg: <FaListUl />,
    dropdown: [
      {
        name: "Report",
        link: "/doctor/posts/report",
        svg: <FaSlidersH />,
      },
      {
        name: "All Posts",
        link: "/doctor/posts/all",
        svg: <FiBarChart2  />,
      },
      { name: "Connections", link: "/doctor/posts/connections",svg: <FaCog /> },
    ],
  },
  { name: "Staff", link: "/doctor/staff", svg: <FaUsers /> },
  { name: "Patients", link: "/doctor/patients", svg: <FaUserInjured /> },
  {
    name: "Appointments",
    svg: <FaCalendarAlt />,
    dropdown: [
      { name: "Create New", link: "/doctor/appointment" },
      { name: "List by Date", link: "/doctor/appointment/all_list" },
    ],
  },
  {
    name: "Profile",
    svg: <FaUserMd />,
    dropdown: [
      { name: "Personal Info", link: "/doctor/profile" },
      { name: "Manage Education", link: "/doctor/educations" },
      { name: "Manage Experiences", link: "/doctor/experiences" },
    ],
  },
  {
    name: "Prescription",
    svg: <FaFileAlt />,
    dropdown: [
      { name: "Create New", link: "/doctor/prescription" },
      { name: "Prescriptions", link: "/doctor/prescription/all_prescription" },
    ],
  },
  {
    name: "Rating & Reviews",
    link: "/doctor/rating",
    svg: <FaStar />,
  },
  { name: "Contact", link: "/doctor/contact/user", svg: <FaEnvelope /> },
];

export const menuItemsPatient: MenuItem[] = [
  { name: "Dashboard", link: "/patient/dashboard", svg: <MdDashboard /> },
  {
    name: "Rating & Reviews",
    link: "/patient/doctors",
    svg: <FaStar />,
  },
  {
    name: "Appointments",
    link: "/patient/appointments",
    svg: <FaCalendarAlt />,
  },

  {
    name: "Prescriptions",
    link: "/patient/prescriptions",
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