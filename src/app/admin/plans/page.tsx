"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState<string>("active"); // Default to "active" tab - changed here

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
          hidden: !apiPlan.isActive // Hidden is the opposite of isActive
        }));
        
        // Sort plans by ID in ascending order
        transformedPlans.sort((a, b) => a.id - b.id);
        
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
        // Update local state with the correct hidden state
        setPlans(
          plans.map((plan) =>
            plan.id === editingPlan.id ? {...editingPlan, hidden: !editingPlan.active} : plan
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

  // Get the ordered plans for display - lowest ID is first item, middle ID is the middle item, highest ID is last item
  const getOrderedPlansForDisplay = () => {
    if (plans.length !== 3) {
      // If not exactly 3 plans, just return them in sorted order
      return plans;
    }
    
    // Sort plans by ID
    const sortedPlans = [...plans].sort((a, b) => a.id - b.id);
    
    // Rearrange for display: lowest ID (index 0) on right, middle ID (index 1) in middle, highest ID (index 2) on left
    return [sortedPlans[0], sortedPlans[1], sortedPlans[2]];
  };

  // Filter plans based on active tab
  const getFilteredPlans = () => {
    if (activeTab === "show") {
      return getOrderedPlansForDisplay();
    } else {
      return getOrderedPlansForDisplay().filter(plan => 
        activeTab === "active" ? plan.active : !plan.active
      );
    }
  };

  return (
    <>
      {editingPlan ? (
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
                      <input
                        type="checkbox"
                        checked={feature.included}
                        onChange={() => handleFeatureChange(idx)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
      ) : (
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="show">All Plans</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
          
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
          ) : getFilteredPlans().length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No plans to display.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getFilteredPlans().map((plan) => (
                <div key={plan.id} className="flex flex-col items-center">
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
        </div>
      )}
    </>
  );
};

export default Plans;
