export interface MenuItem {
    name: string;
    link?: string;
    svg: string;
    dropdown?: { name: string; link: string }[];
  }
  
  export const menuItems: MenuItem[] = [
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
  