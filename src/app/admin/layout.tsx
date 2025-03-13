// export default function Page({ children }: { children: React.ReactNode }) {
//   return <div className="p-6 bg-gray-50 min-h-screen">{children}</div>;
// }

"use client";

import React from "react";
import Sidebar from "./_common/Sidebar";
import Topbar from "./_common/Topbar";
import Footer from "./_common/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col p-6">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
