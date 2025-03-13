"use client";

import React from "react";
import Sidebar from "../../_common/Sidebar";
import Topbar from "../../_common/Topbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import NetIncomeTable from "./components/NetIncomeTable";
import AppointmentsTable from "./components/AppointmentsTable";
import IncomeChart from "./components/Chart";
import Footer from "../../_common/Footer";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 mb-8">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col p-2">
        <Topbar />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <IncomeChart />
          <AppointmentsTable />
        </div>
        <NetIncomeTable />
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
