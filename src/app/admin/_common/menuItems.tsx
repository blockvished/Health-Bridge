import { AiFillHome, AiFillSetting, AiFillSchedule } from "react-icons/ai";
import { FaUserMd, FaMoneyBillWave, FaUsers, FaPills, FaPrescription, FaStar, FaPhone, FaLock, FaSignOutAlt, FaEnvelope, FaFileAlt, FaCalendarAlt, FaWallet } from "react-icons/fa";
import { MdDashboard, MdSubscriptions, MdPayment, MdDomain, MdLiveTv, MdPeople, MdMedicalServices, MdRateReview } from "react-icons/md";
import { JSX } from "react";

export interface MenuItem {
    name: string;
    link?: string;
    svg: JSX.Element;
    dropdown?: { name: string; link: string }[];
  }
  
  export const menuItems: MenuItem[] = [
    { name: "Dashboard", link: "/admin/dashboard/user", svg: <MdDashboard /> },
    { name: "Subscription", link: "/admin/subscription", svg: <MdSubscriptions /> },
    {
      name: "Settings",
      svg: <AiFillSetting />,
      dropdown: [
        { name: "Departments", link: "/admin/department" },
        { name: "Set Schedule", link: "/admin/appointment/assign" },
        { name: "Consultation Settings", link: "/admin/live_consults/settings" },
        { name: "QR Code", link: "/admin/profile/qr_code" },
      ],
    },
    { name: "Transactions", link: "/admin/payment/lists", svg: <MdPayment /> },
    { name: "Custom Domain", link: "/admin/domain/", svg: <MdDomain />  },
    {
      name: "Payouts",
      svg: <FaWallet  />,
      dropdown: [
        { name: "Set Payout Account", link: "/admin/payouts/setup_account" },
        { name: "Payouts", link: "/admin/payouts/user" },
      ],
    },
    { name: "Consultations", link: "/admin/live_consults", svg: <MdLiveTv /> },
    { name: "Staff", link: "/admin/staff", svg: <FaUsers  /> },
    {
      name: "Prescription Settings",
      svg: <FaFileAlt  />,
      dropdown: [
        { name: "Additional Advices", link: "/admin/additional_advises" },
        { name: "Diagnosis Tests", link: "/admin/advise_investigation" },
      ],
    },
    { name: "Patients", link: "/admin/patients", svg: <FaUsers /> },
    {
      name: "Appointments",
      svg: <FaCalendarAlt  />,
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
      svg:  <FaUserMd />,
      dropdown: [
        { name: "Personal Info", link: "/admin/profile" },
        { name: "Manage Education", link: "/admin/educations" },
        { name: "Manage Experiences", link: "/admin/experiences" },
      ],
    },
    {
      name: "Prescription",
      svg: <FaPrescription />,
      dropdown: [
        { name: "Create New", link: "/admin/prescription" },
        { name: "Prescriptions", link: "/admin/prescription/all_prescription" },
      ],
    },
    { name: "Rating & Reviews", link: "/admin/dashboard/rating", svg:  <FaStar /> },
    { name: "Contact", link: "/admin/contact/user", svg: <FaEnvelope /> },
    { name: "Change Password", link: "/admin/change_password", svg: <FaLock /> },
    { name: "Logout", link: "#", svg: <FaSignOutAlt /> },
  ];
  