"use client"
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PayoutForm = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('Swift');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add payout submission logic here
    console.log({
      user: selectedUser,
      amount,
      withdrawalMethod
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Add Payout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Users <span className="text-red-500">*</span>
          </label>
          <Select 
            value={selectedUser} 
            onValueChange={setSelectedUser}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">User 1</SelectItem>
              <SelectItem value="user2">User 2</SelectItem>
              <SelectItem value="user3">User 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (INR) <span className="text-red-500">*</span>
          </label>
          <Input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Withdrawal Method <span className="text-red-500">*</span>
          </label>
          <Select 
            value={withdrawalMethod} 
            onValueChange={setWithdrawalMethod}
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Swift">Swift</SelectItem>
              <SelectItem value="NEFT">NEFT</SelectItem>
              <SelectItem value="IMPS">IMPS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PayoutForm;