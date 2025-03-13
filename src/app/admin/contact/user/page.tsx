import React from "react";

const contacts = [
  {
    id: 1,
    name: "Manoj Kumar Manohar",
    email: "admin@abhavault.com",
    message: "doctor mail to check",
    date: "20 Jul 2024 08:41 PM",
  },
];

const ContactTable = () => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-4xl mx-auto w-full p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Contact</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-0">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left p-3 font-medium">#</th>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Message</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr
                key={contact.id}
                className="hover:bg-gray-50 transition border-b border-gray-200"
              >
                <td className="p-3 text-gray-700">{index + 1}</td>
                <td className="p-3 text-gray-900 font-semibold">{contact.name}</td>
                <td className="p-3 text-gray-500">{contact.email}</td>
                <td className="p-3 text-gray-500">{contact.message}</td>
                <td className="p-3 text-gray-500">{contact.date}</td>
                <td className="p-3">
                  <button className="p-1.5 border rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center justify-center w-8 h-8">
                    🔒
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;
