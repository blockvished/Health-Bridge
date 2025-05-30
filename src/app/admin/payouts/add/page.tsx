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

type FilterStatus = "All" | "Pending" | "Completed";
type PaymentMethod = "UPI" | "NEFT" | "IMPS";

const AddPayouts: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatus>("Pending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<Record<string | number, PaymentMethod>>({});
  const [processingRequestId, setProcessingRequestId] = useState<string | number | null>(null);

  // Fetch payout requests from API
  useEffect(() => {
    const fetchPayoutRequests = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('/api/doctor/payout/request');
        
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
          console.warn('API response is not an array:', data);
          setPayoutRequests([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching payout requests:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setPayoutRequests([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutRequests();
  }, []);

  const handlePaymentMethodChange = (requestId: string | number, method: PaymentMethod): void => {
    setSelectedPaymentMethods(prev => ({
      ...prev,
      [requestId]: method
    }));
  };

  const handlePay = async (request: PayoutRequest): Promise<void> => {
    const selectedMethod = selectedPaymentMethods[request.id];
    
    if (!selectedMethod) {
      alert('Please select a payment method first');
      return;
    }

    try {
      setProcessingRequestId(request.id);
      
      const response = await fetch('/api/admin/payout/fulfill-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: request.id,
          amount: request.amount,
          selectedMethod: selectedMethod,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: PayoutApiResponse = await response.json();
      
      // Check if the response has a message (indicating success)
      if (result.message) {
        // Show success message with payment details
        alert(
          `Payment processed successfully!\n\n` +
          `Request ID: #${request.id}\n` +
          `Original Amount: ₹${result.details.originalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` +
          `Commission Deducted: ₹${result.details.commissionDeducted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` +
          `Final Payout: ₹${result.details.finalPayoutAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` +
          `Payment Method: ${result.details.paymentMethod}`
        );
        
        // Update the local state with the updated payout request from API response
        setPayoutRequests(prev => 
          prev.map(req => 
            req.id === request.id 
              ? { 
                  ...req, 
                  status: 'completed',
                  amountPaid: result.details.finalPayoutAmount,
                  commissionDeduct: result.details.commissionDeducted,
                  paymentMethod: result.details.paymentMethod
                }
              : req
          )
        );
        
        // Clear the selected payment method for this request
        setSelectedPaymentMethods(prev => {
          const updated = { ...prev };
          delete updated[request.id];
          return updated;
        });
      } else {
        throw new Error('Unexpected response format');
      }
      
    } catch (error) {
      console.error('Error processing payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to process payment: ${errorMessage}`);
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
    return `₹${parseFloat(amount.toString()).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredRequests: PayoutRequest[] = Array.isArray(payoutRequests) ? payoutRequests.filter((request: PayoutRequest) => {
    const filterMatch = filter === "All" || 
      request.status?.toLowerCase() === filter.toLowerCase();
    
    // Search in doctor name or doctor ID
    const searchMatch = !searchQuery || 
      (request.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       request.doctorId?.toString().includes(searchQuery));
    
    return filterMatch && searchMatch;
  }) : [];

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
          <div className="text-red-600">Error loading payout requests: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 bg-white shadow rounded-lg border border-gray-200 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Fulfill Payout Requests</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <Select value={filter} onValueChange={(value: FilterStatus) => setFilter(value)}>
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No payout requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request: PayoutRequest) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {request.doctorName || `Doctor ID: ${request.doctorId}`}
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
                      {request.requestedMethod?.toUpperCase() || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={selectedPaymentMethods[request.id] || ""}
                      onValueChange={(value: PaymentMethod) => handlePaymentMethodChange(request.id, value)}
                      disabled={processingRequestId !== null || request.status?.toLowerCase() === 'completed'}
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
                      disabled={processingRequestId !== null || request.status?.toLowerCase() === 'completed'}
                      className={`${
                        request.status?.toLowerCase() === 'completed' 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : processingRequestId === request.id
                          ? 'bg-blue-500 cursor-not-allowed'
                          : processingRequestId !== null
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {processingRequestId === request.id 
                        ? 'Processing...' 
                        : request.status?.toLowerCase() === 'completed' 
                        ? 'Paid' 
                        : 'Pay'
                      }
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredRequests.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredRequests.length} of {Array.isArray(payoutRequests) ? payoutRequests.length : 0} payout requests
        </div>
      )}
    </div>
  );
};

export default AddPayouts;