"use client"

import { useState, useEffect } from 'react';

const Subscription = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/doctor/subscription');
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscription data');
        }
        
        const data = await response.json();
        setSubscriptionData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Calculate days remaining
  const calculateDaysRemaining = (expireDate) => {
    const today = new Date();
    const expireAt = new Date(expireDate);
    const diffTime = expireAt.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format price to currency format (converting from paisas to rupees)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!subscriptionData) {
    return null;
  }

  const { doctorPlan, planDetails } = subscriptionData;
  const daysRemaining = calculateDaysRemaining(doctorPlan.expireAt);
  const isPlanExpiringSoon = daysRemaining <= 30;

  return (
    <div className="flex flex-col md:items-start p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm border border-gray-200">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-3">Subscription</h2>
          <div className="border-t border-gray-300 pt-3 space-y-1">
            <p className="text-gray-700 font-medium">
              Subscription: <span className="font-normal">{planDetails.name}</span>
            </p>
            <p className="text-gray-700 font-medium">
              Price: <span className="font-normal">
                {formatPrice(doctorPlan.planType === "monthly" ? planDetails.monthlyPrice : planDetails.yearlyPrice)}
              </span>
            </p>
            <p className="text-gray-700 font-medium">
              Billing Cycle: <span className="font-normal capitalize">{doctorPlan.planType}</span>
            </p>
            <p className="text-gray-700 font-medium">
              Last Billing: <span className="font-normal">{formatDate(doctorPlan.paymentAt)}</span>
            </p>
            <p className="text-gray-700 font-medium">
              Expire:{" "}
              <span className={isPlanExpiringSoon ? "text-red-600" : "text-green-600"}>
                {formatDate(doctorPlan.expireAt)} ({daysRemaining} Days left)
              </span>
            </p>
            {planDetails.staffLimit && (
              <p className="text-gray-700 font-medium">
                Staff Limit: <span className="font-normal">{planDetails.staffLimit}</span>
              </p>
            )}
            {planDetails.chamberLimit && (
              <p className="text-gray-700 font-medium">
                Chamber Limit: <span className="font-normal">{planDetails.chamberLimit}</span>
              </p>
            )}
          </div>
        </div>
        <div className={`border-t border-gray-300 flex items-center justify-between w-full rounded-b-lg ${doctorPlan.paymentStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          <span className="p-3">Payment Status:</span>
          <span className="font-semibold p-3">
            {doctorPlan.paymentStatus ? "✔ Verified" : "❌ Not Verified"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Subscription;