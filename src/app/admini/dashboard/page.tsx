"use client";

import React, { useState, useEffect, ReactNode } from "react";
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
import PlansByUserChart from "./PlansByUserChart";
import RecentUsers from "./RecentUsers";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Define interface for API data
interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  paymentStatus: boolean;
  accountStatus: boolean;
  image_link: string | null;
  planId: number;
  planName: string;
  createdAt: string;
}

interface ApiResponse {
  doctors: Doctor[];
  counts: {
    totalDoctors: number;
    verifiedDoctorsCount: number;
    pendingVerifications: number;
    expiredAccounts: number;
  };
}

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
const DashboardSummaryCards: React.FC<{
  totalDoctors: number;
  verifiedDoctors: number;
  pendingVerifications: number;
  expiredAccounts: number;
}> = ({ totalDoctors, verifiedDoctors, pendingVerifications, expiredAccounts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <SummaryCard 
        title="Doctors" 
        count={totalDoctors} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        bgColor="bg-blue-100"
        iconColor="text-blue-500"
        route="/admini/users"
      />
      <SummaryCard 
        title="Verified Doctors" 
        count={verifiedDoctors} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        bgColor="bg-green-100"
        iconColor="text-green-500"
        route="/admini/users"
      />
      <SummaryCard 
        title="Pending Verification" 
        count={pendingVerifications} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
        bgColor="bg-red-100"
        iconColor="text-red-500"
        route="/admini/users"
      />
      <SummaryCard 
        title="Expired Accounts" 
        count={expiredAccounts} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        }
        bgColor="bg-yellow-100"
        iconColor="text-yellow-500"
        route="/admini/users"
      />
    </div>
  );
};

// Updated PlansByUserChart Component
const UpdatedPlansByUserChart: React.FC<{ doctors: Doctor[] }> = ({ doctors }) => {
  // Count doctors by plan
  const planCounts: Record<string, number> = {};
  
  // Count doctors by plan
  doctors.forEach(doctor => {
    const planName = doctor.planName || "No plan";
    planCounts[planName] = (planCounts[planName] || 0) + 1;
  });
  
  // Format data for the chart
  const chartData = Object.entries(planCounts).map(([name, count], index) => {
    // Define colors for different plans
    const colors = ["#36A2EB", "#3586AF", "#5A47CE", "#4BC0C0", "#9966FF", "#FF9F40"];
    return {
      name,
      count,
      color: colors[index % colors.length]
    };
  });
  
  return <PlansByUserChart data={chartData} />;
};

// Updated RecentUsers Component
const UpdatedRecentUsers: React.FC<{ doctors: Doctor[] }> = ({ doctors }) => {
  // Format doctors data for RecentUsers component
  const recentUsers = doctors.map(doctor => {
    // Calculate time since joined
    const joinedDate = new Date(doctor.createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));

    let joinedText = "";
    if (diffInDays === 0) {
      joinedText = "Today";
    } else if (diffInDays === 1) {
      joinedText = "Yesterday";
    } else if (diffInDays < 30) {
      joinedText = `${diffInDays} days ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      joinedText = `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      joinedText = `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }

    return {
      name: doctor.name,
      email: doctor.email,
      status: (doctor.verified ? "verified" : "pending") as "verified" | "pending", // Type assertion
      plan: doctor.planName || "No plan",
      joined: joinedText
    };
  });

  return <RecentUsers users={recentUsers} />;
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        setApiData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-screen-xl flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-screen-xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2">Unable to load dashboard data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return null;
  }

  const { counts, doctors } = apiData;

  return (
    <div className="container mx-auto p-4 max-w-screen-xl">
      <DashboardSummaryCards 
        totalDoctors={counts.totalDoctors}
        verifiedDoctors={counts.verifiedDoctorsCount}
        pendingVerifications={counts.pendingVerifications}
        expiredAccounts={counts.expiredAccounts}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UpdatedRecentUsers doctors={doctors} />
        <UpdatedPlansByUserChart doctors={doctors} />
      </div>
    </div>
  );
};

export default Dashboard;