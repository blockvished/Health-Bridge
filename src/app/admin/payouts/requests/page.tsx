"use client";
import React, { useState } from "react";
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
import { totalmem } from "os";

const PayoutRequests = () => {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample payout requests data
  const payoutRequests = [
    {
      id: 1,
      user: "John Doe",
      amount: 5000,
      total: 5000,
      method: "UPI",
      status: "Pending",
      date: "2025-03-15",
    },
    {
      id: 2,
      user: "Jane Smith",
      amount: 7500,
      total: 5000,
      method: "NEFT",
      status: "Approved",
      date: "2025-03-16",
    },
    {
      id: 3,
      user: "Mike Johnson",
      total: 5000,
      amount: 3000,
      method: "UPI",
      status: "Rejected",
      date: "2025-03-17",
    },
    {
      id: 4,
      user: "John Smith",
      total: 5000,
      amount: 3500,
      method: "UPI",
      status: "Pending",
      date: "2025-03-18",
    },
  ];

  const handleAddPayout = () => {
    router.push("/admin/payouts/add");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600";
      case "Approved":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredRequests = payoutRequests.filter((request) => {
    const filterMatch = filter === "All" || request.status === filter;
    const searchMatch = request.user
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return filterMatch && searchMatch;
  });

  return (
    <div className="mx-auto p-4 bg-white shadow rounded-lg border border-gray-200 w-full md:max-w-3xl">
      {" "}
      {/* Adjusted max-width */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Payout Requests</h1>
        <Button onClick={handleAddPayout}>Add Payout</Button>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search users"
          className="w-full sm:w-[250px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Req. Amount</TableHead>
              <TableHead>Total Amt.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.user}</TableCell>
                <TableCell>₹{request.amount.toLocaleString()}</TableCell>
                <TableCell>₹{request.total.toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${getStatusColor(request.status)}`}
                  >
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>{request.method}</TableCell>
                <TableCell>{request.date}</TableCell>
                {/* <TableCell>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PayoutRequests;
