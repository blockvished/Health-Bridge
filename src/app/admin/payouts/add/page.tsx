"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Type definitions
interface PayoutRequest {
  id: string | number;
  doctorId: string | number;
  doctorName?: string;
  amount: number;
  balanceAtRequest?: number;
  amountPaid?: number;
  commissionDeduct?: number;
  requestedMethod?: string;
  status: "pending" | "completed" | string;
  createdAt: string;
}

interface ApiResponse {
  data?: PayoutRequest[];
  payoutRequests?: PayoutRequest[];
}

interface PayoutApiResponse {
  message: string;
  payoutRequest: PayoutRequest;
  details: {
    originalAmount: number;
    commissionDeducted: number;
    finalPayoutAmount: number;
    paymentMethod: string;
  };
}

interface BankDetails {
  upiId?: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  error?: string;
}

type FilterStatus = "All" | "Pending" | "Completed";
type PaymentMethod = "UPI" | "NEFT" | "IMPS";

const AddPayouts: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatus>("Pending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    Record<string | number, PaymentMethod>
  >({});
  const [processingRequestId, setProcessingRequestId] = useState<
    string | number | null
  >(null);
  const [bankDetails, setBankDetails] = useState<
    Record<string | number, BankDetails>
  >({});
  const [loadingBankDetails, setLoadingBankDetails] = useState<
    Record<string | number, boolean>
  >({});

  // Fetch payout requests from API
  useEffect(() => {
    const fetchPayoutRequests = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch("/api/doctor/payout/request");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PayoutRequest[] | ApiResponse = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setPayoutRequests(data);
        } else if (data && Array.isArray(data.data)) {
          // Handle case where API returns { data: [...] }
          setPayoutRequests(data.data);
        } else if (data && Array.isArray(data.payoutRequests)) {
          // Handle case where API returns { payoutRequests: [...] }
          setPayoutRequests(data.payoutRequests);
        } else {
          // If no array found, set empty array
          console.warn("API response is not an array:", data);
          setPayoutRequests([]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching payout requests:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        setPayoutRequests([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutRequests();
  }, []);

  // Fetch bank details based on payment method
  const fetchBankDetails = async (
    doctorId: string | number,
    method: PaymentMethod,
    requestId: string | number
  ): Promise<void> => {
    try {
      setLoadingBankDetails((prev) => ({
        ...prev,
        [requestId]: true,
      }));

      const response = await fetch(
        `/api/admin/users/bank_data?type=${method}&doctorId=${doctorId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json();
          setBankDetails((prev) => ({
            ...prev,
            [requestId]: { error: errorData.message },
          }));
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const bankData: BankDetails = await response.json();
      setBankDetails((prev) => ({
        ...prev,
        [requestId]: bankData,
      }));
    } catch (err) {
      console.error("Error fetching bank details:", err);
      setBankDetails((prev) => ({
        ...prev,
        [requestId]: { error: "Failed to load bank details" },
      }));
    } finally {
      setLoadingBankDetails((prev) => ({
        ...prev,
        [requestId]: false,
      }));
    }
  };

  const handlePaymentMethodChange = (
    requestId: string | number,
    method: PaymentMethod
  ): void => {
    setSelectedPaymentMethods((prev) => ({
      ...prev,
      [requestId]: method,
    }));

    // Find the request to get doctorId
    const request = payoutRequests.find((req) => req.id === requestId);
    if (request) {
      fetchBankDetails(request.doctorId, method, requestId);
    }
  };

  const handlePay = async (request: PayoutRequest): Promise<void> => {
    const selectedMethod = selectedPaymentMethods[request.id];

    if (!selectedMethod) {
      toast.warning("Please select a payment method first", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      setProcessingRequestId(request.id);

      const response = await fetch("/api/admin/payout/fulfill-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: request.id,
          amount: request.amount,
          selectedMethod: selectedMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result: PayoutApiResponse = await response.json();

      // Check if the response has a message (indicating success)
      if (result.message) {
        // Show success toast with payment details
        const SuccessMessage = () => (
          <div>
            <div className="font-semibold text-green-800 mb-2">Payment Processed Successfully!</div>
            <div className="text-sm space-y-1">
              <div><strong>Request ID:</strong> #{request.id}</div>
              <div><strong>Original Amount:</strong> ₹{result.details.originalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
              <div><strong>Commission Deducted:</strong> ₹{result.details.commissionDeducted.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
              <div><strong>Final Payout:</strong> ₹{result.details.finalPayoutAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
              <div><strong>Payment Method:</strong> {result.details.paymentMethod}</div>
            </div>
          </div>
        );

        toast.success(<SuccessMessage />, {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            minWidth: '350px',
          }
        });

        // Update the local state with the updated payout request from API response
        setPayoutRequests((prev) =>
          prev.map((req) =>
            req.id === request.id
              ? {
                  ...req,
                  status: "completed",
                  amountPaid: result.details.finalPayoutAmount,
                  commissionDeduct: result.details.commissionDeducted,
                  paymentMethod: result.details.paymentMethod,
                }
              : req
          )
        );

        // Clear the selected payment method and bank details for this request
        setSelectedPaymentMethods((prev) => {
          const updated = { ...prev };
          delete updated[request.id];
          return updated;
        });

        setBankDetails((prev) => {
          const updated = { ...prev };
          delete updated[request.id];
          return updated;
        });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      
      toast.error(`Failed to process payment: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  const getStatusColor = (status: string | undefined): string => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const formatCurrency = (amount: number | undefined | null): string => {
    if (!amount && amount !== 0) return "—";
    return `₹${parseFloat(amount.toString()).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit", // Add this for hour
      minute: "2-digit", // Add this for minute
      second: "2-digit", // Add this for second
      hour12: true, // Use 12-hour format with AM/PM
    });
  };

  const renderBankDetailsRow = (requestId: string | number) => {
    const details = bankDetails[requestId];
    const isLoading = loadingBankDetails[requestId];
    const selectedMethod = selectedPaymentMethods[requestId];

    if (!selectedMethod && !isLoading && !details) return null;

    return (
      <TableRow key={`bank-${requestId}`} className="bg-gray-50">
        <TableCell colSpan={7} className="py-3">
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading bank details...</span>
            </div>
          )}

          {details?.error && (
            <div className="flex items-center space-x-2 text-red-600">
              <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-xs">!</span>
              </div>
              <span>{details.error}</span>
            </div>
          )}

          {selectedMethod === "UPI" && details?.upiId && (
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">U</span>
                </div>
                <span className="font-semibold text-blue-800">
                  UPI Payment Details
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-blue-700">UPI ID:</span>
                  <span className="ml-2 text-blue-900 font-mono">
                    {details.upiId}
                  </span>
                </div>
              </div>
            </div>
          )}

          {(selectedMethod === "NEFT" || selectedMethod === "IMPS") &&
            details?.accountNumber && (
              <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                  <span className="font-semibold text-green-800">
                    Bank Transfer Details ({selectedMethod})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-green-700">
                      Account Holder:
                    </span>
                    <span className="ml-2 text-green-900">
                      {details.accountHolderName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">
                      Bank Name:
                    </span>
                    <span className="ml-2 text-green-900">
                      {details.bankName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">
                      Account Number:
                    </span>
                    <span className="ml-2 text-green-900 font-mono">
                      {details.accountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">
                      IFSC Code:
                    </span>
                    <span className="ml-2 text-green-900 font-mono">
                      {details.ifscCode}
                    </span>
                  </div>
                </div>
              </div>
            )}
        </TableCell>
      </TableRow>
    );
  };

  const filteredRequests: PayoutRequest[] = Array.isArray(payoutRequests)
    ? payoutRequests.filter((request: PayoutRequest) => {
        const filterMatch =
          filter === "All" ||
          request.status?.toLowerCase() === filter.toLowerCase();

        // Search in doctor name or doctor ID
        const searchMatch =
          !searchQuery ||
          request.doctorName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          request.doctorId?.toString().includes(searchQuery);

        return filterMatch && searchMatch;
      })
    : [];

  if (loading) {
    return (
      <div className="mx-auto p-4 bg-white shadow rounded-lg border border-gray-200 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading payout requests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-4 bg-white shadow rounded-lg border border-gray-200 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">
            Error loading payout requests: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 bg-white shadow rounded-lg border border-gray-200 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">
          Fulfill Payout Requests
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <Select
          value={filter}
          onValueChange={(value: FilterStatus) => setFilter(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by doctor name or ID"
          className="w-full sm:w-[300px]"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Req Amount</TableHead>
              <TableHead>Req Pay Method</TableHead>
              <TableHead>Pay Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No payout requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.flatMap((request: PayoutRequest) =>
                [
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {request.doctorName ||
                            `Doctor ID: ${request.doctorId}`}
                        </div>
                        {request.doctorName && (
                          <div className="text-sm text-gray-500">
                            ID: {request.doctorId}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(request.amount)}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {request.requestedMethod?.toUpperCase() || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={selectedPaymentMethods[request.id] || ""}
                        onValueChange={(value: PaymentMethod) =>
                          handlePaymentMethodChange(request.id, value)
                        }
                        disabled={
                          processingRequestId !== null ||
                          request.status?.toLowerCase() === "completed"
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="NEFT">NEFT</SelectItem>
                          <SelectItem value="IMPS">IMPS</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium capitalize ${getStatusColor(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(request.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handlePay(request)}
                        disabled={
                          processingRequestId !== null ||
                          request.status?.toLowerCase() === "completed"
                        }
                        className={`${
                          request.status?.toLowerCase() === "completed"
                            ? "bg-gray-400 cursor-not-allowed"
                            : processingRequestId === request.id
                              ? "bg-blue-500 cursor-not-allowed"
                              : processingRequestId !== null
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {processingRequestId === request.id
                          ? "Processing..."
                          : request.status?.toLowerCase() === "completed"
                            ? "Paid"
                            : "Pay"}
                      </Button>
                    </TableCell>
                  </TableRow>,
                  renderBankDetailsRow(request.id),
                ].filter(Boolean)
              )
            )}
          </TableBody>
        </Table>
      </div>

      {filteredRequests.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredRequests.length} of{" "}
          {Array.isArray(payoutRequests) ? payoutRequests.length : 0} payout
          requests
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ 
          zIndex: 9999999,
          top: '20px',
          right: '20px'
        }}
        toastStyle={{ 
          zIndex: 9999999,
          fontSize: '14px',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        limit={3}
      />
    </div>
  );
};

export default AddPayouts;