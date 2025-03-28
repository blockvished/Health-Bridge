"use client"
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const PayoutCompleted = () => {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample payout requests data
  const payoutRequests = [
    {
      id: 2,
      user: 'Jane Smith',
      amount: 7500,
      status: 'Approved',
      date: '2025-03-16'
    },
  ];

  const handleAddPayout = () => {
    router.push('/admin/payouts/add');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'text-yellow-600';
      case 'Approved': return 'text-green-600';
      case 'Rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRequests = payoutRequests.filter(request => {
    const filterMatch = filter === 'All' || request.status === filter;
    const searchMatch = request.user.toLowerCase().includes(searchQuery.toLowerCase());
    return filterMatch && searchMatch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm ring-1 ring-gray-200/5 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Payout Completed</h1>
        <Button 
          onClick={handleAddPayout} 
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
        >
          Add Payout
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4 p-2 bg-gray-50 rounded-md">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white">
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
          className="w-full sm:w-[250px] bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-gray-600 font-semibold">User</TableHead>
              <TableHead className="text-gray-600 font-semibold">Amount</TableHead>
              <TableHead className="text-gray-600 font-semibold">Status</TableHead>
              <TableHead className="text-gray-600 font-semibold">Date</TableHead>
              <TableHead className="text-gray-600 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id} className="hover:bg-gray-50">
                <TableCell className="max-w-[150px] truncate">{request.user}</TableCell>
                <TableCell>₹{request.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full sm:w-auto border-gray-300 hover:bg-gray-100"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PayoutCompleted;