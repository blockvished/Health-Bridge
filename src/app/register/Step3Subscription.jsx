import React, { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa";

const Step3Subscription = ({
  availablePlans,
  subscriptionPlan,
  setSubscriptionPlan,
  handlePrevStep,
  handleNextStep,
}) => {
  // Add state to track billing period (monthly/yearly)
  const [billingPeriods, setBillingPeriods] = useState({});

  useEffect(() => {
    console.log("Available plans:", availablePlans);
    
    // Initialize all plans to monthly billing by default
    if (availablePlans && availablePlans.length > 0) {
      const initialBillingPeriods = {};
      availablePlans.forEach(plan => {
        initialBillingPeriods[plan.id] = 'monthly';
      });
      setBillingPeriods(initialBillingPeriods);
    }
  }, [availablePlans]);

  // If no plans are available yet, show loading state
  if (!availablePlans || availablePlans.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Loading Subscription Plans...
        </h3>
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const renderFeatures = (plan) => {
    if (!Array.isArray(plan.features)) return null;
    
    // Get all enabled features
    const enabledFeatures = plan.features.filter(f => f.enabled);
    
    // Show all features without arbitrary limit
    return (
      <ul className="text-sm text-gray-600 space-y-2">
        {enabledFeatures.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">
              <FaCheck size={12} />
            </span>
            <span className="text-sm">{feature.featureName}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Toggle billing period for a specific plan
  const toggleBillingPeriod = (e, planId) => {
    e.stopPropagation(); // Prevent card selection when clicking toggle
    setBillingPeriods(prev => ({
      ...prev,
      [planId]: prev[planId] === 'monthly' ? 'yearly' : 'monthly'
    }));
  };

  // Calculate savings percentage for yearly billing
  const calculateSavings = (monthlyPrice, yearlyPrice) => {
    const monthlyCostForYear = monthlyPrice * 12;
    const savings = monthlyCostForYear - yearlyPrice;
    const savingsPercentage = (savings / monthlyCostForYear) * 100;
    return Math.round(savingsPercentage);
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Choose Your Subscription
      </h3>
      <p className="text-gray-500 mb-6">Select the plan that best fits your practice needs</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {availablePlans.map((plan) => {
          const isMonthly = billingPeriods[plan.id] === 'monthly';
          const activePrice = isMonthly ? plan.monthlyPrice : plan.yearlyPrice;
          const savingsPercentage = calculateSavings(plan.monthlyPrice, plan.yearlyPrice);
          
          return (
            <div
              key={plan.id}
              onClick={() => setSubscriptionPlan(plan.id)}
              className={`relative border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg ${
                subscriptionPlan === plan.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {/* Plan header with background */}
              <div className="p-4 bg-gray-50">
                <h4 className="font-bold text-lg uppercase tracking-wide">{plan.name}</h4>
                
                {/* Billing toggle */}
                <div className="mt-3 flex items-center justify-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={(e) => toggleBillingPeriod(e, plan.id)}
                    className={`text-xs font-medium py-1.5 px-3 rounded ${
                      isMonthly 
                        ? "bg-blue-500 text-white" 
                        : "text-gray-600 hover:bg-gray-200"
                    } transition`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={(e) => toggleBillingPeriod(e, plan.id)}
                    className={`text-xs font-medium py-1.5 px-3 rounded ${
                      !isMonthly 
                        ? "bg-blue-500 text-white" 
                        : "text-gray-600 hover:bg-gray-200"
                    } transition`}
                  >
                    Yearly
                    {savingsPercentage > 0 && (
                      <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                        Save {savingsPercentage}%
                      </span>
                    )}
                  </button>
                </div>
                
                {/* Price */}
                <div className="mt-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{activePrice}
                    <span className="text-sm font-normal ml-1 text-gray-500">
                      / {isMonthly ? 'month' : 'year'}
                    </span>
                  </div>
                  {!isMonthly && (
                    <div className="text-xs text-gray-500 mt-1">
                      That's just ₹{Math.round(plan.yearlyPrice / 12)} per month
                    </div>
                  )}
                </div>
              </div>
              
              {/* Features section */}
              <div className="p-4">
                <div className="mb-3 font-medium text-gray-700">What's included:</div>
                <div className="overflow-y-auto max-h-60 pr-1">
                  {renderFeatures(plan)}
                </div>
              </div>
              
              {/* Button section with background */}
              <div className="p-4 bg-gray-50 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSubscriptionPlan(plan.id);
                  }}
                  className={`w-full py-2.5 rounded-lg text-center transition-colors font-medium ${
                    subscriptionPlan === plan.id
                      ? "bg-blue-500 text-white"
                      : "border border-blue-500 text-blue-500 hover:bg-blue-50"
                  }`}
                >
                  {subscriptionPlan === plan.id ? "Selected" : "Select Plan"}
                </button>
              </div>
              
              {/* Selected indicator */}
              {subscriptionPlan === plan.id && (
                <div className="absolute top-4 right-4 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  <FaCheck size={12} className="text-blue-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Navigation buttons with improved styling */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handlePrevStep}
          className="flex items-center px-6 py-2.5 rounded-lg text-blue-500 border border-blue-500 hover:bg-blue-50 transition font-medium"
        >
          <FaArrowLeft className="mr-2" /> Previous
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          disabled={!subscriptionPlan}
          className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium ${
            !subscriptionPlan ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } transition`}
        >
          Continue <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step3Subscription;