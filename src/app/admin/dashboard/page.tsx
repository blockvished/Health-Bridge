"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import IncomeChart from "./_common/Chart";
import NetIncomeTable from "./_common/NetIncomeTable";
import PlansByUserChart from "./_common/PlansByUserChart"
import RecentUsers from "./_common/RecentUsers";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Define interface for SummaryCard props
interface SummaryCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  bgColor: string;
  iconColor: string;
  route: string;
}

// Summary Card Component
const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, icon, bgColor, iconColor, route }) => {
  const router = useRouter();

  return (
    <div 
      className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(route)}
    >
      <div className={`p-3 rounded-full ${bgColor} flex-shrink-0`}>
        <div className={`${iconColor}`}>{icon}</div>
      </div>
      <div className="flex-grow">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{count}</p>
      </div>
    </div>
  );
};

// Dashboard Summary Cards Component
const DashboardSummaryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <SummaryCard 
        title="Doctors" 
        count={35} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        bgColor="bg-blue-100"
        iconColor="text-blue-500"
        route="/admin/users"
      />
      <SummaryCard 
        title="Verified Doctors" 
        count={2} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        bgColor="bg-green-100"
        iconColor="text-green-500"
        route="#"
      />
      <SummaryCard 
        title="Pending Verification" 
        count={2} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
        bgColor="bg-red-100"
        iconColor="text-red-500"
        route="#"
      />
      <SummaryCard 
        title="Expired Accounts" 
        count={2} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        }
        bgColor="bg-yellow-100"
        iconColor="text-yellow-500"
        route="#"
      />
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-screen-xl">
      <DashboardSummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* <IncomeChart /> */}
        <RecentUsers />
        <PlansByUserChart />
        {/* <NetIncomeTable /> */}
      </div>
    </div>
  );
};

export default Dashboard      