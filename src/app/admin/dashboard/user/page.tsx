"use client";

import React from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-60 flex-1 p-6">
        <Topbar />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <IncomeChart />
          <AppointmentsTable />
        </div>
        <NetIncomeTable />
      </div>
    </div>
  );
};

export default Dashboard;
