"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

// Define interface based on API response structure
interface Feature {
  id: number;
  planId: number;
  featureName: string;
  enabled: boolean;
}

interface ApiPlan {
  id: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  staffLimit: number;
  chamberLimit: number;
  isActive: boolean;
  features: Feature[];
}

interface ApiResponse {
  success: boolean;
  data: ApiPlan[];
  error?: string;
}

// Interface for our component state
interface Plan {
  id: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: { name: string; included: boolean }[];
  staffCount: number;
  chamberCount: number;
  active: boolean;
  hidden: boolean;
}

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plans');
      
      if (!response.ok) {
        throw new Error(`Error fetching plans: ${response.status}`);
      }
      
      const apiData: ApiResponse = await response.json();
      
      if (apiData.success && apiData.data) {
        // Transform API data to match our component state format
        const transformedPlans: Plan[] = apiData.data.map(apiPlan => ({
          id: apiPlan.id,
          name: apiPlan.name,
          monthlyPrice: apiPlan.monthlyPrice,
          yearlyPrice: apiPlan.yearlyPrice,
          features: apiPlan.features.map(feature => ({
            name: feature.featureName,
            included: feature.enabled
          })),
          staffCount: apiPlan.staffLimit,
          chamberCount: apiPlan.chamberLimit,
          active: apiPlan.isActive,
          hidden: false // This property doesn't exist in API, defaulting to false
        }));
        
        setPlans(transformedPlans);
      } else {
        throw new Error(apiData.error || 'Failed to fetch plans data');
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleHidePlan = async (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: plan.hidden }),
      });

      if (!response.ok) {
        throw new Error(`Error updating plan status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setPlans(
          plans.map((plan) =>
            plan.id === planId ? { ...plan, active: !plan.hidden, hidden: !plan.hidden } : plan
          )
        );
        setNotification({
          type: 'success',
          message: `Plan ${plan.hidden ? "activated" : "deactivated"} successfully`,
        });
        
        // Auto-clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      } else {
        throw new Error(data.error || 'Failed to update plan status');
      }
    } catch (err) {
      console.error('Error updating plan status:', err);
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update plan status',
      });
      
      // Auto-clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
  };

  const handleSaveEdit = async () => {
    if (!editingPlan) return;
    
    try {
      setSubmitting(true);
      
      // Prepare the data in the format the API expects
      const apiPlan = {
        name: editingPlan.name,
        monthlyPrice: editingPlan.monthlyPrice,
        yearlyPrice: editingPlan.yearlyPrice,
        staffLimit: editingPlan.staffCount,
        chamberLimit: editingPlan.chamberCount,
        isActive: editingPlan.active,
        features: editingPlan.features.map((feature) => ({
          featureName: feature.name,
          enabled: feature.included
        }))
      };

      const response = await fetch(`/api/plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPlan),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating plan: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setPlans(
          plans.map((plan) =>
            plan.id === editingPlan.id ? editingPlan : plan
          )
        );
        setEditingPlan(null);
        setNotification({
          type: 'success',
          message: "Plan updated successfully",
        });
        
        // Auto-clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      } else {
        throw new Error(data.error || 'Failed to update plan');
      }
    } catch (err) {
      console.error('Error saving plan:', err);
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update plan',
      });
      
      // Auto-clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editingPlan) return;

    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "number") {
      setEditingPlan({
        ...editingPlan,
        [name]: parseInt(value, 10),
      });
    } else {
      setEditingPlan({
        ...editingPlan,
        [name]: value,
      });
    }
  };

  const handleFeatureChange = (featureIndex: number) => {
    if (!editingPlan) return;

    const updatedFeatures = [...editingPlan.features];
    updatedFeatures[featureIndex] = {
      ...updatedFeatures[featureIndex],
      included: !updatedFeatures[featureIndex].included,
    };

    setEditingPlan({
      ...editingPlan,
      features: updatedFeatures,
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md relative">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="flex items-start">
            <div className="ml-3">
              <p className="text-sm font-medium">
                {notification.type === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="mt-1 text-sm">
                {notification.message}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setNotification(null)}
                  className={`inline-flex rounded-md p-1.5 ${
                    notification.type === 'success' ? 'bg-green-50 text-green-500 hover:bg-green-200' : 'bg-red-50 text-red-500 hover:bg-red-200'
                  }`}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-lg font-semibold mb-4 text-center">Manage Plans</h2>
      
      {loading ? (
        <div className="text-center py-10">
          <p>Loading plans...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>Error: {error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => fetchPlans()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
          <div key={plan.id} className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <Switch 
                  checked={!plan.hidden} 
                  onCheckedChange={() => handleHidePlan(plan.id)} 
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {plan.hidden ? "Show" : "Hide"}
                </span>
              </label>
              <span className="text-xs text-gray-500 mt-1">
                {plan.hidden 
                  ? "Enable to show this plan" 
                  : "Disable to hide this plan"
                }
              </span>
            </div>
            
            <div className={`border rounded-lg p-4 w-full text-center shadow-sm ${plan.hidden ? 'opacity-50' : ''}`}>
              <span className={`${plan.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-full px-2 py-1 text-xs`}>
                {plan.active ? "Active" : "Inactive"}
              </span>
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
              <button 
                className="bg-blue-500 text-white rounded-lg p-2 w-full hover:bg-blue-600 transition-colors"
                onClick={() => handleEditPlan(plan)}
              >
                Edit Plan
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit {editingPlan.name} Plan</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingPlan.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Price (₹)</label>
                <input
                  type="number"
                  name="monthlyPrice"
                  value={editingPlan.monthlyPrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Yearly Price (₹)</label>
                <input
                  type="number"
                  name="yearlyPrice"
                  value={editingPlan.yearlyPrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Staff Count</label>
                <input
                  type="number"
                  name="staffCount"
                  value={editingPlan.staffCount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Chamber Count</label>
                <input
                  type="number"
                  name="chamberCount"
                  value={editingPlan.chamberCount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="active"
                  value={editingPlan.active ? "true" : "false"}
                  onChange={(e) => {
                    setEditingPlan({
                      ...editingPlan,
                      active: e.target.value === "true",
                    });
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="space-y-2 border border-gray-200 rounded-md p-3">
                  {editingPlan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span>{feature.name}</span>
                      <Switch
                        checked={feature.included}
                        onCheckedChange={() => handleFeatureChange(idx)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={handleCancelEdit}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={submitting}
                className="px-4 py-2 bg-blue-500 rounded-md text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;