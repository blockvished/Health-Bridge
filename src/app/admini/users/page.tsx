"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  paymentStatus: boolean;
  image_link: string | null;
  planId: number;
  planName: string;
  createdAt: string;
  expireAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortByPackage, setSortByPackage] = useState("");
  const [sortByStatus, setSortByStatus] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Simulated package options
  const packageOptions = ["All", "BASIC", "STANDARD", "PREMIUM"];
  const statusOptions = ["All", "Verified", "Pending"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/users");

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.doctors);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Convert verification status to a sortable format
  const getVerificationStatus = (verified: boolean) => {
    return verified ? 2 : 1;
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortByPackage && sortByPackage !== "All") {
      const packageComparison = (a.planName || "No plan").localeCompare(
        b.planName || "No plan"
      );
      if (packageComparison !== 0) {
        return packageComparison;
      }
    }
    if (sortByStatus && sortByStatus !== "All") {
      const statusComparison =
        getVerificationStatus(a.verified) - getVerificationStatus(b.verified);
      if (statusComparison !== 0) {
        return statusComparison;
      }
    }

    return a.name.localeCompare(b.name);
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(sortedUsers.length / entriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(2);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(2);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages - 1);
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading users data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        <h3 className="font-semibold">Error loading users</h3>
        <p>{error}</p>
        <Button
          className="mt-2 bg-red-600 hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-wrap items-center gap-4 mb-4 justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Select onValueChange={setSortByPackage} value={sortByPackage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by Packages" />
            </SelectTrigger>
            <SelectContent>
              {packageOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSortByStatus} value={sortByStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search by name"
            className="w-[200px]"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <Select
          onValueChange={(value) => {
            setEntriesPerPage(parseInt(value, 10));
            setCurrentPage(1); // Reset to the first page when changing page size
          }}
          value={String(entriesPerPage)}
        >
          <SelectTrigger className="w-[180px] justify-end">
            <SelectValue placeholder="Entries per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Account Verification</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Expire At</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>

                <TableCell>
                  <div>
                    <div>{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.verified ? (
                    <span className="text-green-500 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Verified
                    </span>
                  ) : (
                    <span className="text-red-500">Pending</span>
                  )}
                </TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.planName || "No plan"}</TableCell>
                <TableCell>
                  {user.paymentStatus ? (
                    <span className="text-green-500">Completed</span>
                  ) : (
                    <span className="text-yellow-500">Pending</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(user.expireAt)}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <Link
                    href={`/admini/users/${user.id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md transition-colors"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {sortedUsers.length > 0 ? indexOfFirstEntry + 1 : 0} to{" "}
          {Math.min(indexOfLastEntry, sortedUsers.length)} of{" "}
          {sortedUsers.length} entries
        </div>
        <div className="flex items-center">
          <Button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg p-1 text-xs mr-1"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1 || sortedUsers.length === 0}
          >
            Previous
          </Button>
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="mx-1 text-sm">
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`rounded-lg p-1 text-xs mr-1 ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                onClick={() => paginate(page as number)}
                disabled={currentPage === page || sortedUsers.length === 0}
              >
                {page}
              </button>
            )
          )}
          <Button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg p-1 text-xs"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || sortedUsers.length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Users;
