import React from "react";
import { Bar } from "react-chartjs-2";

const months = [
  "March 24",
  "February 24",
  "January 24",
  "December 24",
  "November 24",
  "October 24",
  "September 24",
  "August 24",
  "July 24",
  "June 24",
  "May 24",
  "April 24",
];

const chartData = {
  labels: months,
  datasets: [
    {
      label: "Income",
      data: [0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0],
      backgroundColor: "#2563eb",
      borderRadius: 4,
      barThickness: 20,
    },
  ],
};

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 1500,
      ticks: {
        stepSize: 500,
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
  maintainAspectRatio: false,
};

const IncomeChart: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Last 12 months Income</h2>
    <div className="h-72">
      <Bar data={chartData} options={chartOptions} />
    </div>
  </div>
);

export default IncomeChart;
