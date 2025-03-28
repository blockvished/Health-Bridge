"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  accountVerification: 'Pending' | 'Verified';
  chambers: string;
  package: string;
  paymentStatus: 'Pending' | 'Completed';
  accountStatus: 'Active' | 'Inactive';
  joined: string;
  avatarUrl?: string; // Optional avatar URL
}

const Users: React.FC = () => {
  const allUsers: User[] = [
    { id: 1, name: 'Lmao', email: 'postpostman123@gmail.com', accountVerification: 'Pending', chambers: 'Clinic Name', package: 'BASIC', paymentStatus: 'Pending', accountStatus: 'Active', joined: '22 Mar 2025', avatarUrl: 'https://github.com/shadcn.png' },
    { id: 2, name: 'John Doe', email: 'john.doe@example.com', accountVerification: 'Verified', chambers: 'City Clinic', package: 'STANDARD', paymentStatus: 'Completed', accountStatus: 'Active', joined: '15 Jan 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?portrait' },
    { id: 3, name: 'Jane Smith', email: 'jane.smith@email.com', accountVerification: 'Verified', chambers: 'Town Hospital', package: 'PREMIUM', paymentStatus: 'Completed', accountStatus: 'Active', joined: '01 Feb 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?woman' },
    { id: 4, name: 'Robert Jones', email: 'robert.jones@test.com', accountVerification: 'Pending', chambers: 'County Clinic', package: 'BASIC', paymentStatus: 'Pending', accountStatus: 'Inactive', joined: '10 Mar 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?man' },
    { id: 5, name: 'Mary Brown', email: 'mary.brown@sample.com', accountVerification: 'Verified', chambers: 'State Hospital', package: 'STANDARD', paymentStatus: 'Completed', accountStatus: 'Active', joined: '05 Mar 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?female' },
    { id: 6, name: 'Michael Davis', email: 'michael.davis@email.com', accountVerification: 'Verified', chambers: 'Private Clinic', package: 'PREMIUM', paymentStatus: 'Completed', accountStatus: 'Active', joined: '28 Feb 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?male' },
    { id: 7, name: 'Jennifer Wilson', email: 'jennifer.wilson@test.com', accountVerification: 'Pending', chambers: 'Community Health', package: 'BASIC', paymentStatus: 'Pending', accountStatus: 'Inactive', joined: '20 Mar 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?girl' },
     { id: 8, name: 'David Garcia', email: 'david.garcia@example.com', accountVerification: 'Verified', chambers: 'Wellness Center', package: 'STANDARD', paymentStatus: 'Completed', accountStatus: 'Active', joined: '12 Jan 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?boy' },
    { id: 9, name: 'Linda Rodriguez', email: 'linda.rodriguez@email.com', accountVerification: 'Verified', chambers: 'Family Clinic', package: 'PREMIUM', paymentStatus: 'Completed', accountStatus: 'Active', joined: '08 Feb 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?lady' },
    { id: 10, name: 'Christopher Williams', email: 'chris.williams@test.com', accountVerification: 'Pending', chambers: 'Urgent Care', package: 'BASIC', paymentStatus: 'Pending', accountStatus: 'Inactive', joined: '18 Mar 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?guy' },
    { id: 11, name: 'Angela Garcia', email: 'angela.garcia@sample.com', accountVerification: 'Verified', chambers: 'Specialty Clinic', package: 'STANDARD', paymentStatus: 'Completed', accountStatus: 'Active', joined: '03 Mar 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?woman' },
    { id: 12, name: 'Brian Martinez', email: 'brian.martinez@email.com', accountVerification: 'Verified', chambers: 'Medical Center', package: 'PREMIUM', paymentStatus: 'Completed', accountStatus: 'Active', joined: '25 Feb 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?male' },
    { id: 13, name: 'Nicole Robinson', email: 'nicole.robinson@test.com', accountVerification: 'Pending', chambers: 'Health Services', package: 'BASIC', paymentStatus: 'Pending', accountStatus: 'Inactive', joined: '15 Mar 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?girl' },
      { id: 14, name: 'Kevin Patel', email: 'kevin.patel@example.com', accountVerification: 'Verified', chambers: 'General Hospital', package: 'STANDARD', paymentStatus: 'Completed', accountStatus: 'Active', joined: '20 Jan 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?indian' },
    { id: 15, name: 'Priya Sharma', email: 'priya.sharma@email.com', accountVerification: 'Verified', chambers: 'Ayurvedic Clinic', package: 'PREMIUM', paymentStatus: 'Completed', accountStatus: 'Active', joined: '10 Feb 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?indianfemale' },
    { id: 16, name: 'Amit Singh', email: 'amit.singh@test.com', accountVerification: 'Pending', chambers: 'Homeopathy Center', package: 'BASIC', paymentStatus: 'Pending', accountStatus: 'Inactive', joined: '01 Apr 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?indianboy' },
    { id: 17, name: 'Anjali Joshi', email: 'anjali.joshi@sample.com', accountVerification: 'Verified', chambers: 'Dental Clinic', package: 'STANDARD', paymentStatus: 'Completed', accountStatus: 'Active', joined: '28 Feb 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?indiangirl' },
    { id: 18, name: 'Rohan Kapoor', email: 'rohan.kapoor@email.com', accountVerification: 'Verified', chambers: 'Eye Care Clinic', package: 'PREMIUM', paymentStatus: 'Completed', accountStatus: 'Active', joined: '18 Mar 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?indianmale' },
    { id: 19, name: 'Deepika Mehta', email: 'deepika.mehta@test.com', accountVerification: 'Pending', chambers: 'Child Clinic', package: 'BASIC', paymentStatus: 'Pending', accountStatus: 'Inactive', joined: '05 Mar 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?indianwoman' },
    { id: 20, name: 'Kunal Verma', email: 'kunal.verma@example.com', accountVerification: 'Verified', chambers: 'Neuro Clinic', package: 'STANDARD', paymentStatus: 'Completed', accountStatus: 'Active', joined: '12 Mar 2025', avatarUrl: 'https://source.unsplash.com/random/100x100/?indianman' },
  ];

  const [sortByPackage, setSortByPackage] = useState('');
  const [sortByStatus, setSortByStatus] = useState('');
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10); // Default to 10

  // Simulated package options
  const packageOptions = ['All', 'BASIC', 'STANDARD', 'PREMIUM'];
  const statusOptions = ['All', 'Verified', 'Pending', 'Expired'];

  // Convert accountVerification to a sortable format
  const getVerificationStatus = (status: 'Pending' | 'Verified') => {
    if (status === 'Verified') return 2;
    if (status === 'Pending') return 1;
    return 0;
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortByPackage && sortByPackage !== 'All') {
      const packageComparison = a.package.localeCompare(b.package);
      if (packageComparison !== 0) {
        return packageComparison;
      }
    }
    if (sortByStatus && sortByStatus !== 'All') {
      const statusComparison = getVerificationStatus(a.accountVerification) - getVerificationStatus(b.accountVerification);
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
                pages.push('...');
                pages.push(totalPages - 1);
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push(2);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            }
            else {
                pages.push(1);
                pages.push(2);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages - 1);
                pages.push(totalPages);
            }
        }
        return pages;
    };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Select onValueChange={setSortByPackage} value={sortByPackage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by Packages" />
          </SelectTrigger>
          <SelectContent>
            {packageOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSortByStatus} value={sortByStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by name"
          className="w-[200px]"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Select onValueChange={(value) => {
            setEntriesPerPage(parseInt(value, 10));
            setCurrentPage(1); // Reset to the first page when changing page size
          }}
          value={String(entriesPerPage)}
        >
          <SelectTrigger className="w-[180px]">
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
            <TableHead className="w-[100px]">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Account Verification</TableHead>
            <TableHead>Chambers</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Account Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div>
                  <div>{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </TableCell>
              <TableCell>
                {user.accountVerification === 'Pending' ? (
                  <span className="text-red-500">Pending</span>
                ) : (
                  <span className="text-green-500 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Verified
                  </span>
                )}
              </TableCell>
              <TableCell>{user.chambers}</TableCell>
              <TableCell>{user.package}</TableCell>
              <TableCell>
                {user.paymentStatus === 'Pending' ? (
                  <span className="text-yellow-500">Pending</span>
                ) : (
                  <span className="text-green-500">Completed</span>
                )}
              </TableCell>
              <TableCell>
                {user.accountStatus === 'Active' ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-red-500">Inactive</span>
                )}
              </TableCell>
              <TableCell>{user.joined}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, sortedUsers.length)} of {sortedUsers.length} entries
        </div>
        <div className="flex items-center">
          <Button
            className="bg-gray-200 rounded-lg p-1 text-xs mr-1"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
           {getPageNumbers().map((page, index) =>
             page === '...' ? (
                <span key={`ellipsis-${index}`} className="mx-1 text-sm">...</span>
              ) : (
                <button
                  key={page}
                  className={`rounded-lg p-1 text-xs mr-1 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => paginate(page as number)}
                  disabled={currentPage === page}
                >
                  {page}
                </button>
              )
          )}
          <Button
            className="bg-gray-200 rounded-lg p-1 text-xs"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Users;
