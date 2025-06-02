"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

// This is a client component that safely uses useSearchParams
function PaymentStatusChecker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const merchantOrderId = searchParams.get("merchantOrderId");
  const appointmentId = searchParams.get("appointmentId");

  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [statusDetails, setStatusDetails] = useState<string | null>(null);

  useEffect(() => {
    const checkPayment = async () => {
      // Debug logs to help troubleshoot
      console.log("UserId from URL:", userId);
      console.log("MerchantOrderId from URL:", merchantOrderId);

      if (!userId || !merchantOrderId) {
        setPaymentStatus("error");
        setStatusDetails("Missing user ID or order ID.");
        return; // Exit early if required parameters are missing.
      }

      setPaymentStatus("loading");
      try {
        const response = await fetch(
          `/api/status-patient/?merchantOrderId=${merchantOrderId}&userId=${userId}&appointmentId=${appointmentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ merchantOrderId, userId, appointmentId }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setPaymentStatus("success");
          setStatusDetails(data.details);
          setTimeout(() => {
            router.push(
              `/patient/appointments/`
            );
          }, 3000); // 3-second delay to allow user to see success message
        } else {
          setPaymentStatus("error");
          setStatusDetails(data.error || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setPaymentStatus("error");
        setStatusDetails("Failed to connect to the server.");
      }
    };

    checkPayment();
  }, [userId, merchantOrderId, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {paymentStatus === "loading" && (
          <>
            <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment status.
            </p>
          </>
        )}

        {paymentStatus === "success" && (
          <>
            <FaCheckCircle className="text-green-500 text-5xl mb-4" />
            <h2 className="text-2xl font-semibold text-green-600 mb-3">
              Payment Successful!
            </h2>
            {statusDetails && (
              <div className="text-left text-gray-700">
                <h3 className="font-semibold mb-2">Order Details:</h3>
                <pre className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-wrap break-words">
                  {JSON.stringify(statusDetails, null, 2)}
                </pre>
              </div>
            )}
            <p className="text-gray-600 mt-4">
              Thank you for your subscription! You will be redirected shortly...
            </p>
          </>
        )}

        {paymentStatus === "error" && (
          <>
            <FaTimesCircle className="text-red-500 text-5xl mb-4" />
            <h2 className="text-2xl font-semibold text-red-600 mb-3">
              Payment Failed
            </h2>
            <p className="text-red-700 mb-4">{statusDetails}</p>
            <p className="text-gray-600">
              Please try again or contact support if the issue persists.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback to show while the client component is being hydrated
function PaymentStatusLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Loading Payment Status...
        </h2>
        <p className="text-gray-600">Please wait a moment.</p>
      </div>
    </div>
  );
}

// The main component that wraps the client component with Suspense
export default function CheckPaymentStatus() {
  return (
    <Suspense fallback={<PaymentStatusLoadingFallback />}>
      <PaymentStatusChecker />
    </Suspense>
  );
}
