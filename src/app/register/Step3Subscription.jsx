import React, { useState } from "react";
import { FaArrowRight, FaArrowLeft, FaCheck, FaSpinner } from "react-icons/fa";

const Step3Subscription = ({
  availablePlans,
  subscriptionPlan,
  setSubscriptionPlan,
  billingPeriod,
  setBillingPeriod,
  handlePrevStep,
  userId,
  handleSendDataToBackend, // Add this prop to receive the signup function from parent
}) => {
  const [loading, setLoading] = useState(false);

  // If no plans are available yet, show loading state
  if (!availablePlans || availablePlans.length === 0) {
    return (
      <div className="w-full py-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Loading Subscription Plans...
        </h3>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const renderFeatures = (plan) => {
    if (!Array.isArray(plan.features)) return null;

    // Get all enabled features
    const enabledFeatures = plan.features.filter((f) => f.enabled);

    return (
      <ul className="text-sm text-gray-600 space-y-3">
        {enabledFeatures.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-green-500 mr-3 mt-0.5 flex-shrink-0">
              <FaCheck size={14} />
            </span>
            <span>{feature.featureName}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Calculate savings percentage for yearly billing
  const calculateSavings = (monthlyPrice, yearlyPrice) => {
    const monthlyCostForYear = monthlyPrice * 12;
    const savings = monthlyCostForYear - yearlyPrice;
    const savingsPercentage = (savings / monthlyCostForYear) * 100;
    return Math.round(savingsPercentage);
  };

  // Get the selected plan
  const selectedPlan = availablePlans.find(plan => plan.id === subscriptionPlan);

  // Determine the amount based on selected plan and billing period
  const getSelectedAmount = () => {
    if (!selectedPlan) return 0;
    return billingPeriod === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, call handleSignup to ensure subscription details are set
      const signupResult = await handleSendDataToBackend(true);
      
      // If signup was not successful, stop payment process
      if (!signupResult) {
        setLoading(false);
        return;
      }

      // Get the amount based on the selected plan and billing period
      const amount = getSelectedAmount()

      const data = {
        amount: amount,
      };

      console.log("Payment data:", data);

      const response = await fetch(`/api/order/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData);

      // Redirect user to PhonePe payment page
      if (
        responseData &&
        responseData.checkoutPageUrl
      ) {
        window.location.href =
          responseData.checkoutPageUrl;
      }
    } catch (err) {
      console.log(err);
      alert("Error initiating payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-4">
      <h3 className="text-2xl font-semibold text-gray-800 mb-3">
        Choose Your Subscription
      </h3>
      <p className="text-gray-600 mb-8 text-lg">
        Select the plan that best fits your practice needs
      </p>

      {/* Global billing toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setBillingPeriod("monthly")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              billingPeriod === "monthly"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod("yearly")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ml-1 ${
              billingPeriod === "yearly"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Yearly Billing
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Save up to 20%
            </span>
          </button>
        </div>
      </div>

      {/* Subscription plans cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {availablePlans.map((plan) => {
          const isMonthly = billingPeriod === "monthly";
          const activePrice = isMonthly ? plan.monthlyPrice : plan.yearlyPrice;
          const savingsPercentage = calculateSavings(
            plan.monthlyPrice,
            plan.yearlyPrice
          );

          return (
            <div
              key={plan.id}
              onClick={() => setSubscriptionPlan(plan.id)}
              className={`relative border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
                subscriptionPlan === plan.id
                  ? "border-blue-500 bg-blue-50 shadow-lg transform scale-105"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {/* Plan header */}
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                <h4 className="font-bold text-xl tracking-wide text-gray-800">
                  {plan.name}
                </h4>

                {/* Price */}
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-blue-600">
                      ₹{activePrice}
                    </span>
                    <span className="text-sm ml-2 text-gray-500">
                      / {isMonthly ? "month" : "year"}
                    </span>
                  </div>

                  {!isMonthly && (
                    <div className="text-sm text-green-600 mt-1 font-medium">
                      Save {savingsPercentage}% with yearly billing
                    </div>
                  )}
                </div>

                {/* Individual plan billing toggle */}
                <div className="mt-4">
                  <div className="inline-flex bg-gray-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBillingPeriod("monthly");
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded ${
                        isMonthly
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:bg-gray-200"
                      } transition`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBillingPeriod("yearly");
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded ${
                        !isMonthly
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:bg-gray-200"
                      } transition`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
              </div>

              {/* Features section */}
              <div className="p-6 border-t border-gray-100">
                <h5 className="font-semibold text-gray-700 mb-4">
                  What's included:
                </h5>
                <div className="overflow-y-auto max-h-64 pr-1">
                  {renderFeatures(plan)}
                </div>
              </div>

              {/* Button section */}
              <div className="p-6 bg-gray-50 mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSubscriptionPlan(plan.id);
                  }}
                  className={`w-full py-3 rounded-xl text-center transition-colors font-semibold ${
                    subscriptionPlan === plan.id
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {subscriptionPlan === plan.id ? "Selected" : "Select Plan"}
                </button>
              </div>

              {/* Selected indicator */}
              {subscriptionPlan === plan.id && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  <FaCheck size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handlePrevStep}
          className="flex items-center px-8 py-3 rounded-xl text-blue-600 border-2 border-blue-500 hover:bg-blue-50 transition font-medium"
          disabled={loading}
        >
          <FaArrowLeft className="mr-2" size={16} /> Previous
        </button>
        <button
          type="button"
          onClick={handlePayment}
          disabled={!subscriptionPlan || loading}
          className={`flex items-center px-8 py-3 rounded-xl text-white font-medium ${
            !subscriptionPlan || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition shadow-md`}
        >
          {loading ? (
            <>
              <FaSpinner className="mr-2 animate-spin" size={16} />
              Processing...
            </>
          ) : (
            <>
              Proceed to Payment <FaArrowRight className="ml-2" size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step3Subscription;
