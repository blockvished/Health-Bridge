import { AiFillHome, AiFillSetting, AiFillSchedule } from "react-icons/ai";
import { BsFillPaletteFill } from "react-icons/bs";
import { RiFileListFill, RiPagesFill } from "react-icons/ri";
import {
  FaUserMd,
  FaMoneyBillWave,
  FaUsers,
  FaLanguage,
  FaMoneyCheckAlt,
  FaPills,
  FaPrescription,
  FaStar,
  FaShareAlt,
  FaPhone,
  FaLock,
  FaSignOutAlt,
  FaEnvelope,
  FaFileAlt,
  FaCalendarAlt,
  FaWallet,
  FaUserInjured,
  FaQrcode,
  FaSlidersH,
  FaCalendarCheck,
  FaBuilding,
  FaDollarSign,
  FaBlog,
  FaProjectDiagram,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  MdDashboard,
  MdSubscriptions,
  MdPayment,
  MdDomain,
  MdLiveTv,
  MdPeople,
  MdMedicalServices,
  MdRateReview,
  MdBusiness,
  MdAttachMoney,
  MdMiscellaneousServices,
} from "react-icons/md";
import { JSX } from "react";
import { GiPill } from "react-icons/gi";

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
  { name: "Transactions", link: "/admin/payment/lists", svg: <MdPayment /> },
  { name: "Custom Domain", link: "/admin/domain", svg: <MdDomain /> },
  {
    name: "Payouts",
    svg: <FaWallet />,
    dropdown: [
      { name: "Set Payout Account", link: "/admin/payouts/setup_account" },
      { name: "Payouts", link: "/admin/payouts/user" },
    ],
  },
  { name: "Consultations", link: "/admin/live_consults", svg: <MdLiveTv /> },
  { name: "Staff", link: "/admin/staff", svg: <FaUsers /> },
  {
    name: "Prescription Settings",
    svg: <FaPrescription />,
    dropdown: [
      { name: "Additional Advices", link: "/admin/additional_advises" },
      { name: "Diagnosis Tests", link: "/admin/advise_investigation" },
    ],
  },
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
    name: "Drugs",
    svg: <FaPills />,
    dropdown: [
      { name: "Drugs", link: "/admin/drugs" },
      { name: "Bulk Import Drugs", link: "/admin/drugs/import" },
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
  { name: "Change Password", link: "/admin/change_password", svg: <FaLock /> },
  { name: "Logout", link: "#", svg: <FaSignOutAlt /> },
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
  { name: "Change Password", link: "/admin/change_password", svg: <FaLock /> },
  { name: "Logout", link: "#", svg: <FaSignOutAlt /> },
];

export const menuItemsAdmin: MenuItem[] = [
  { name: "Dashboard", link: "/admin/dashboard", svg: <MdDashboard /> },
  { name: "Settings", link: "/admin/settings", svg: <AiFillSetting /> },
  {
    name: "Payment Settings",
    svg: <FaDollarSign />,
    dropdown: [
      {
        name: "Online Payments",
        link: "/admin/payment/settings/online",
      },
      {
        name: "Offline Payments",
        link: "/admin/payment/settings/offline",
      },
    ],
  },
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
    name: "Affiliate",
    svg: <FaShareAlt />,
    dropdown: [
      { name: "Affiliate Settings", link: "/admin/referral/settings" },
      { name: "Payout Requests", link: "/admin/referral/payout_request" },
      { name: "Completed", link: "/admin/referral/completed_payout" },
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
  { name: "Appearance", link: "/admin/settings/appearance", svg: <BsFillPaletteFill /> },
  { name: "Language", link: "/admin/language", svg: <FaLanguage /> },
  { name: "Plans", link: "/admin/package", svg: <RiFileListFill /> },
  { name: "Transactions", link: "/admin/payment/transactions", svg: <MdAttachMoney /> },
  { name: "Departments", link: "/admin/department", svg: <MdBusiness /> },
  { name: "Users", link: "/admin/users", svg: <FaUsers /> },

  {
    name: "Drugs",
    svg: <GiPill />,
    dropdown: [
      { name: "Drugs", link: "/admin/drugs" },
      { name: "Bulk Import Drugs", link: "/admin/drugs/import" },
    ],
  },
  {
    name: "Blog",
    svg: <FaBlog />,
    dropdown: [
      { name: "Add Category", link: "/admin/blog_category" },
      { name: "Blog Posts", link: "/admin/blog" },
    ],
  },

  { name: "Workflow", link: "/admin/workflow", svg: <FaProjectDiagram  /> },
  { name: "Services", link: "/admin/services", svg: <MdMiscellaneousServices  /> },
  { name: "Pages", link: "/admin/pages", svg: <RiPagesFill  /> },
  { name: "FAQs", link: "/admin/faq", svg: <FaQuestionCircle   /> },
  { name: "Contact", link: "/admin/contact", svg: <FaEnvelope /> },
  { name: "Change Password", link: "/change_password", svg: <FaLock /> },
  { name: "Logout", link: "#", svg: <FaSignOutAlt /> },
];
