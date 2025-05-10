import React from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Step3Subscription = ({
  availablePlans,
  subscriptionPlan,
  setSubscriptionPlan,
  handlePrevStep,
  handleNextStep,
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Select a Subscription Plan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {availablePlans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSubscriptionPlan(plan.id)}
            className={`border rounded-lg p-4 cursor-pointer transition ${
              subscriptionPlan === plan.id
                ? "border-2 border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-lg">{plan.name}</h4>
              {subscriptionPlan === plan.id && (
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  ✓
                </div>
              )}
            </div>
            <div className="text-lg font-medium text-blue-500 mb-3">
              ₹{plan.monthlyPrice} / month
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <span
                    className={`mr-2 ${
                      feature.enabled ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {feature.enabled ? "✓" : "✕"}
                  </span>
                  {feature.featureName}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handlePrevStep}
          className="flex items-center px-6 py-2 rounded-lg text-blue-500 border border-blue-500 hover:bg-blue-50 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          disabled={!subscriptionPlan}
          className={`flex items-center px-6 py-2 rounded-lg text-white ${
            !subscriptionPlan ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } transition`}
        >
          Next <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step3Subscription;