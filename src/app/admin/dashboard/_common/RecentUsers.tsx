"use client";
import Link from 'next/link';

interface User {
  name: string;
  email: string;
  status: "verified" | "pending";
  plan: string;
  joined: string;
}

const users: User[] = [
  {
    name: "lmao",
    email: "postpostman123@gmail.com",
    status: "pending",
    plan: "Basic",
    joined: "4 days ago",
  },
  {
    name: "Dr Sabir Ali",
    email: "sabirali735536@gmail.com",
    status: "verified",
    plan: "Basic",
    joined: "2 months ago",
  },
  {
    name: "Dr Ganesh Hambarde",
    email: "ganeshhambarde1114@gmail.com",
    status: "verified",
    plan: "Basic",
    joined: "2 months ago",
  },
  {
    name: "Dr Sheetal Rangrao Jagtap",
    email: "jagtagsheetali2@gmail.com",
    status: "verified",
    plan: "Basic",
    joined: "2 months ago",
  },
  {
    name: "DR ANEEL KUMAR vaswani",
    email: "draneelvaswani480@gmail.com",
    status: "verified",
    plan: "Basic",
    joined: "2 months ago",
  },
  {
    name: "Shravan Kumar Ratcha",
    email: "itsratcha@gmail.com",
    status: "pending",
    plan: "Basic",
    joined: "2 months ago",
  }
];

const UserIcon = () => (
  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-blue-500 fill-current">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
    </svg>
  </div>
);

const RecentUsers = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Recently joined Users</h2>
      </div>
      <ul>
        {users.map((user, index) => (
          <li key={index} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-none hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <UserIcon />
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {user.status === "verified" ? (
                    <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Verified
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      Pending
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{user.plan}</span>
                </div>
              </div>
            </div>
            <span className="text-gray-500 text-sm">{user.joined}</span>
          </li>
        ))}
      </ul>
      <Link href="/admin/users" className="block text-center p-4 border-t border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
        <span className="text-blue-600 text-sm">See all Users →</span>
      </Link>
    </div>
  );
};

export default RecentUsers;