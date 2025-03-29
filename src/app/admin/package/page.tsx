"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";

interface Plan {
  id: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: { name: string; included: boolean }[];
  staffCount: number;
  chamberCount: number;
}

const Plans: React.FC = () => {
  const plans: Plan[] = [
    {
      id: 1,
      name: "BASIC",
      monthlyPrice: 3990,
      yearlyPrice: 43890,
      features: [
        { name: "Services", included: true },
        { name: "Blogs", included: false },
        { name: "Custom Domain", included: false },
        { name: "Online Consultation", included: false },
        { name: "Patients", included: true },
        { name: "Advise", included: false },
        { name: "Diagnosis", included: false },
        { name: "Prescription", included: true },
        { name: "Appointments", included: true },
        { name: "Profile page", included: true },
      ],
      staffCount: 2,
      chamberCount: 1,
    },
    {
      id: 2,
      name: "CLASSIC",
      monthlyPrice: 5490,
      yearlyPrice: 60390,
      features: [
        { name: "Services", included: true },
        { name: "Blogs", included: false },
        { name: "Custom Domain", included: false },
        { name: "Online Consultation", included: false },
        { name: "Patients", included: true },
        { name: "Advise", included: false },
        { name: "Diagnosis", included: false },
        { name: "Prescription", included: true },
        { name: "Appointments", included: true },
        { name: "Profile page", included: true },
      ],
      staffCount: 4,
      chamberCount: 2,
    },
    {
      id: 3,
      name: "PREMIUM",
      monthlyPrice: 8990,
      yearlyPrice: 98890,
      features: [
        { name: "Services", included: true },
        { name: "Blogs", included: true },
        { name: "Custom Domain", included: true },
        { name: "Online Consultation", included: true },
        { name: "Patients", included: true },
        { name: "Advise", included: true },
        { name: "Diagnosis", included: true },
        { name: "Prescription", included: true },
        { name: "Appointments", included: true },
        { name: "Profile page", included: true },
      ],
      staffCount: 6,
      chamberCount: 3,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-center">Manage Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <Switch />
                <span className="ml-3 text-sm font-medium text-gray-900">Hide</span>
              </label>
              <span className="text-xs text-gray-500 mt-1">Disable to hide this plan</span>
            </div>
            <div className="border rounded-lg p-4 w-full text-center shadow-sm">
              <span className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs">Active</span>
              <h3 className="font-bold text-xl mt-2">{plan.name}</h3>
              <div className="flex flex-col items-center justify-center mt-2">
                <span className="text-2xl font-semibold">
                  ₹{plan.monthlyPrice} <span className="text-sm font-normal">/ Month</span>
                </span>
                <span className="text-2xl font-semibold text-blue-500">
                  ₹{plan.yearlyPrice} <span className="text-sm font-normal">/ Year</span>
                </span>
              </div>
              <ul className="my-4 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{feature.name}</span>
                    {feature.included ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">x</span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="text-sm flex justify-center gap-4 mb-4">
                <span>{plan.staffCount} Staffs</span>
                <span>{plan.chamberCount} Chambers</span>
              </div>
              <button className="bg-blue-500 text-white rounded-lg p-2 w-full hover:bg-blue-600 transition-colors">
                Edit Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
