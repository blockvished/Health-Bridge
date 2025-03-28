// Plans.tsx
import React from 'react';

interface Plan {
  id: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: {
    name: string;
    included: boolean;
  }[];
  staffCount: number;
  chamberCount: number;
}

const Plans: React.FC = () => {
  const plans: Plan[] = [
    {
      id: 1,
      name: 'BASIC',
      monthlyPrice: 3990,
      yearlyPrice: 43890,
      features: [
        { name: 'Services', included: true },
        { name: 'Blogs', included: false },
        { name: 'Custom Domain', included: false },
        { name: 'Online Consultation', included: false },
        { name: 'Patients', included: true },
        { name: 'Advise', included: false },
        { name: 'Diagnosis', included: false },
        { name: 'Prescription', included: true },
        { name: 'Appointments', included: true },
        { name: 'Profile page', included: true },
      ],
      staffCount: 2,
      chamberCount: 1,
    },
    {
      id: 2,
      name: 'CLASSIC',
      monthlyPrice: 5490,
      yearlyPrice: 60390,
      features: [
        { name: 'Services', included: true },
        { name: 'Blogs', included: false },
        { name: 'Custom Domain', included: false },
        { name: 'Online Consultation', included: false },
        { name: 'Patients', included: true },
        { name: 'Advise', included: false },
        { name: 'Diagnosis', included: false },
        { name: 'Prescription', included: true },
        { name: 'Appointments', included: true },
        { name: 'Profile page', included: true },
      ],
      staffCount: 4,
      chamberCount: 2,
    },
    {
      id: 3,
      name: 'PREMIUM',
      monthlyPrice: 8990,
      yearlyPrice: 98890,
      features: [
        { name: 'Services', included: true },
        { name: 'Blogs', included: false },
        { name: 'Custom Domain', included: false },
        { name: 'Online Consultation', included: false },
        { name: 'Patients', included: true },
        { name: 'Advise', included: false },
        { name: 'Diagnosis', included: false },
        { name: 'Prescription', included: true },
        { name: 'Appointments', included: true },
        { name: 'Profile page', included: true },
      ],
      staffCount: 6,
      chamberCount: 3,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Manage Plans</h2>
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="flex flex-col">
            <div className="flex flex-col items-center mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:p-1 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">Hide</span>
              </label>
              <span className="text-xs text-gray-500 mt-1">
                Disable to hide this plan
              </span>
            </div>
            <div className="border rounded-lg p-4 mt-2"> {/* Added mt-2 for margin */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    {plan.staffCount}
                  </span>
                  <span className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs">
                    Active
                  </span>
                </div>
                <span className="font-bold text-xl">{plan.name}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-semibold">
                  ₹{plan.monthlyPrice}
                  <span className="text-sm font-normal">/ Month</span>
                </span>
                <span className="text-2xl font-semibold text-blue-500">
                  ₹{plan.yearlyPrice}
                  <span className="text-sm font-normal">/ Year</span>
                </span>
              </div>
              <ul className="mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-sm">{feature.name}</span>
                    {feature.included ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">x</span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">{plan.staffCount} Staffs</span>
                <span className="text-sm">{plan.chamberCount} Chambers</span>
              </div>
              <button className="bg-blue-500 text-white rounded-lg p-2 w-full">
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