"use client";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

interface DeleteConfirmation {
  show: boolean;
  id: number | null;
}

const ContactTable: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Mike Hugo Jones",
      email: "mike@monkeydigital.co",
      message:
        "Hi there, I wanted to check in with something that could seriously help your website's visitor count. We work with a trusted ad network that allows us to deliver authentic, geo-targeted social ads traffic for just $10 per 10,000 visits. This isn't fake traffic—it's engaged traffic, tailored to your chosen market and niche. What you get: 10,000+ real visitors for just $10 Localized traffic for any country Scalability available based on your needs Used by marketers—we even use this for our SEO clients! Interested? Check out the details here: https://www.monkeydigital.co/product/country-targeted-traffic/ Or connect instantly on WhatsApp: https://monkeydigital.co/whatsapp-us/ Let's get started today! Best, Mike Hugo Jones Phone/whatsapp: +1 (775) 314-7914",
      date: "10 Mar 2025 07:05 PM",
    },
    {
      id: 2,
      name: "Oliviatring",
      email: "ebojajuje04@gmail.com",
      message:
        "Salut, ech wollt Äre Präis wëssen. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      date: "03 Mar 2025 12:55 AM",
    },
    {
      id: 3,
      name: "Jo Riggs",
      email: "joannariggs01@gmail.com",
      message:
        "Hi, I just visited livedoctors.in and wondered if you'd ever thought about having an engaging video to explain what you do? Our prices start from just $195 USD. We have produced over 500 videos to date and work with both non-animated and animated formats. Non-animated example: https://www.youtube.com/watch?v=bA2DyCbM4Oc Animated example: https://www.youtube.com/watch?v=JG33_Mg5jJc Let me know if you're interested in learning more and/or have any questions. Regards, Jo",
      date: "28 Feb 2025 06:12 PM",
    },
    {
      id: 4,
      name: "Matring",
      email: "ebojajuje04@gmail.com",
      message:
        "Hej, jeg ønskede at kende din pris.  Long line to test wrapping.  And another one to see how it looks.",
      date: "19 Feb 2025 12:20 PM",
    },
    {
      id: 5,
      name: "Johntring",
      email: "anepivepa038@gmail.com",
      message: "Sawubona, bengifuna ukwazi intengo yakho.",
      date: "11 Feb 2025 02:15 PM",
    },
  ]);

  const [expandedMessages, setExpandedMessages] = useState<{
    [id: number]: boolean;
  }>({});
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmation>({ show: false, id: null });

  const toggleExpand = (id: number) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const confirmDelete = (id: number) => {
    setDeleteConfirmation({ show: true, id });
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    setDeleteConfirmation({ show: false, id: null });
  };

  const MAX_LINES = 3;
  const MAX_CHARS = 150;

  const getTruncatedMessage = (message: string): string => {
    const lines = message.split("\n");
    if (lines.length <= MAX_LINES && message.length <= MAX_CHARS) {
      return message;
    }

    const truncatedLines = lines.slice(0, MAX_LINES);
    let truncated = truncatedLines.join("\n");

    if (truncated.length > MAX_CHARS) {
      truncated = truncated.substring(0, MAX_CHARS) + "...";
    }
    return truncated;
  };

  const needsTruncation = (message: string): boolean => {
    return message.split("\n").length > MAX_LINES || message.length > MAX_CHARS;
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {contact.id}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {contact.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {contact.email}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div
                    className={
                      needsTruncation(contact.message) &&
                      !expandedMessages[contact.id]
                        ? "line-clamp-3"
                        : ""
                    }
                  >
                    {expandedMessages[contact.id]
                      ? contact.message
                      : getTruncatedMessage(contact.message)}
                  </div>
                  {needsTruncation(contact.message) && (
                    <button
                      onClick={() => toggleExpand(contact.id)}
                      className="text-blue-500 hover:text-blue-700 text-sm mt-2 focus:outline-none cursor-pointer"
                    >
                      {expandedMessages[contact.id] ? "Read less" : "Read more"}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {contact.date}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <button
                    onClick={() => confirmDelete(contact.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 relative border border-gray-300 max-w-md w-full">
            {" "}
            {/* Added max-w-md w-full */}
            <p className="text-lg font-semibold mb-4">Confirm Deletion</p>
            <p className="mb-4">
              Are you sure you want to delete this contact?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setDeleteConfirmation({ show: false, id: null })}
                className="px-4 py-2 bg-gray-200 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteContact(deleteConfirmation.id!)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactTable;
