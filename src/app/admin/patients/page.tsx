"use client";

import React from "react";
import Sidebar from "../_common/Sidebar";
import Footer from "../_common/Footer";
import Topbar from "../_common/Topbar";

const Patients: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 mb-8">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col p-2">
        <Topbar />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        Patients
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Patients;
