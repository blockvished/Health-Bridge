"use client";

import React from "react";
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
  Legend,
);

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <IncomeChart />
      <AppointmentsTable />
      <NetIncomeTable />
    </div>
  );
};

export default Dashboard;
