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

const PayoutRequests = () => {
  const router = useRouter();
  const [filter, setFilter] = useState('All');

  // Sample payout requests data
  const payoutRequests = [
    {
      id: 1,
      user: 'John Doe',
      amount: 5000,
      status: 'Pending',
      date: '2025-03-15'
    },
    {
      id: 2,
      user: 'Jane Smith',
      amount: 7500,
      status: 'Approved',
      date: '2025-03-16'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      amount: 3000,
      status: 'Rejected',
      date: '2025-03-17'
    }
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payout Requests</h1>
        <Button onClick={handleAddPayout}>
          Add Payout
        </Button>
      </div>

      <div className="flex space-x-4 mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
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
          className="w-[250px]"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payoutRequests
            .filter(request => 
              filter === 'All' || request.status === filter
            )
            .map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.user}</TableCell>
                <TableCell>₹{request.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayoutRequests;