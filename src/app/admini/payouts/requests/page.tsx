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
import { useRouter } from "next/navigation";

// Type definitions
interface PayoutRequest {
  id: string | number;
  doctorId: string | number;
  doctorName?: string;
  amount: number;
  balanceAtRequest?: number;
  amountPaid?: number;
  commissionDeduct?: number;
  method?: string;
  status: "pending" | "completed" | string;
  createdAt: string;
}

interface ApiResponse {
  data?: PayoutRequest[];
  payoutRequests?: PayoutRequest[];
}

type FilterStatus = "All" | "Pending" | "Completed";

const PayoutRequests: React.FC = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>("Pending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleAddPayout = (): void => {
    router.push("/admin/payouts/add");
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
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Payout Requests</h1>
        <Button onClick={handleAddPayout}>Add Payout</Button>
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
              <TableHead>ID</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Requested Amt</TableHead>
              <TableHead>Bal at Req</TableHead>
              <TableHead>Amt Paid</TableHead>
              <TableHead>Commission Deduct</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No payout requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request: PayoutRequest) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">
                    #{request.id}
                  </TableCell>
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
                    {formatCurrency(request.balanceAtRequest)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(request.amountPaid)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(request.commissionDeduct)}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {request.method?.toUpperCase()}
                    </span>
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

export default PayoutRequests;