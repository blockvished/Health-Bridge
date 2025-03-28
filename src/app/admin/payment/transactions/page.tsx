"use client"
// Transactions.tsx
import React, { useState } from 'react';

interface Transaction {
  id: number;
  name: string;
  email: string;
  plan: string;
  frequency: string;
  amount: number;
  status: string;
  date: string;
}

const Transactions: React.FC = () => {
  const allTransactions: Transaction[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', plan: 'BASIC', frequency: 'monthly', amount: 39.99, status: 'Pending', date: '2024-03-22' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', plan: 'PREMIUM', frequency: 'yearly', amount: 299.00, status: 'Completed', date: '2024-02-08' },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', plan: 'BASIC', frequency: 'monthly', amount: 39.99, status: 'Pending', date: '2024-03-25' },
    { id: 4, name: 'Bob Williams', email: 'bob.williams@example.com', plan: 'STANDARD', frequency: 'yearly', amount: 199.00, status: 'Completed', date: '2024-01-15' },
    { id: 5, name: 'Charlie Brown', email: 'charlie.brown@example.com', plan: 'BASIC', frequency: 'monthly', amount: 39.99, status: 'Pending', date: '2024-03-27' },
    { id: 6, name: 'Diana Miller', email: 'diana.miller@example.com', plan: 'PREMIUM', frequency: 'yearly', amount: 299.00, status: 'Completed', date: '2024-02-20' },
    { id: 7, name: 'Ethan Davis', email: 'ethan.davis@example.com', plan: 'STANDARD', frequency: 'yearly', amount: 199.00, status: 'Completed', date: '2024-01-22' },
    { id: 8, name: 'Fiona Wilson', email: 'fiona.wilson@example.com', plan: 'BASIC', frequency: 'monthly', amount: 39.99, status: 'Pending', date: '2024-03-29' },
    { id: 9, name: 'George Garcia', email: 'george.garcia@example.com', plan: 'PREMIUM', frequency: 'yearly', amount: 299.00, status: 'Completed', date: '2024-02-28' },
    { id: 10, name: 'Hannah Rodriguez', email: 'hannah.rodriguez@example.com', plan: 'STANDARD', frequency: 'yearly', amount: 199.00, status: 'Completed', date: '2024-01-29' },
    { id: 11, name: 'Isaac Martinez', email: 'isaac.martinez@example.com', plan: 'BASIC', frequency: 'monthly', amount: 39.99, status: 'Pending', date: '2024-03-31' },
    { id: 12, name: 'Lmao', email: 'Postpostman123@gmail.com', plan: 'BASIC', frequency: 'monthly', amount: 3990.00, status: 'Pending', date: '2025-03-22' },
    { id: 13, name: '', email: '', plan: 'BASIC', frequency: 'monthly', amount: 2990.00, status: 'Pending', date: '2025-02-08' },
    { id: 14, name: '', email: '', plan: 'BASIC', frequency: 'monthly', amount: 2990.00, status: 'Pending', date: '2025-02-09' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = allTransactions.filter((transaction) => {
    return (
      transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredTransactions.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Payments</h2>
        <div className="flex items-center">
          <label className="mr-2 text-sm">Show</label>
          <select
            className="border rounded-lg p-1 text-sm mr-4"
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(parseInt(e.target.value));
              setCurrentPage(1); // Reset to first page when changing entries per page
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <label className="mr-2 text-sm">entries</label>
          <label className="mr-2 text-sm">Search:</label>
          <input
            type="text"
            className="border rounded-lg p-1 text-sm"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
            }}
          />
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500">
            <th className="py-2">#</th>
            <th className="py-2">User</th>
            <th className="py-2">Plan</th>
            <th className="py-2">Billing Cycle</th>
            <th className="py-2">Price</th>
            <th className="py-2">Status</th>
            <th className="py-2">Date</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="py-2">{transaction.id}</td>
              <td className="py-2">
                <div className="flex items-center">
                  {transaction.name && transaction.email ? (
                    <>
                      <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                        {transaction.name.charAt(0)}
                      </span>
                      <div>
                        <div>{transaction.name}</div>
                        <div className="text-xs text-gray-500">{transaction.email}</div>
                      </div>
                    </>
                  ) : (
                    <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </span>
                  )}
                </div>
              </td>
              <td className="py-2">{transaction.plan}</td>
              <td className="py-2">{transaction.frequency}</td>
              <td className="py-2">₹{transaction.amount.toFixed(2)}</td>
              <td className="py-2">
                <span className="bg-red-100 text-red-700 rounded-lg p-1 text-xs">
                  {transaction.status}
                </span>
              </td>
              <td className="py-2">{transaction.date}</td>
              <td className="py-2">
                <button className="bg-green-100 text-green-700 rounded-lg p-1 text-xs">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} entries
        </div>
        <div className="flex items-center">
          <button
            className="bg-gray-200 rounded-lg p-1 text-xs mr-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {getPageNumbers().map((page, index) =>
             page === '...' ? (
                <span key={`ellipsis-${index}`} className="mx-1 text-sm">...</span>
              ) : (
                <button
                  key={page}
                  className={`rounded-lg p-1 text-xs mr-1 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handlePageChange(page as number)}
                  disabled={currentPage === page}
                >
                  {page}
                </button>
              )
          )}
          <button
            className="bg-gray-200 rounded-lg p-1 text-xs"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <div className="mt-4">
        <hr className="border-t border-gray-300" />
      </div>
    </div>
  );
};

export default Transactions;
