"use client";
// Transactions.tsx
import React, { useState, useEffect } from 'react';

interface Transaction {
  id: number;
  doctorName: string;
  doctorEmail: string;
  planName: string;
  planType: string;
  transactionAmount: number;
  transactionStatus: string;
  transactionDate: string;
  expireAt: string;
  isExpired: boolean;
}

interface ApiTransaction {
  doctorName: string;
  doctorEmail: string;
  planName: string;
  planType: string;
  transactionAmount: number;
  transactionStatus: string;
  transactionDate: string;
  expireAt: string;
}

interface ApiResponse {
  success: boolean;
  data: ApiTransaction[];
}

const Transactions: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/transactions');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error('API returned unsuccessful response');
      }
      
      // Transform API data to match component interface
      const transformedTransactions: Transaction[] = result.data.map((transaction, index) => {
        const currentTime = new Date();
        const expireTime = new Date(transaction.expireAt);
        const isExpired = currentTime > expireTime;
        
        return {
          id: index + 1,
          doctorName: transaction.doctorName,
          doctorEmail: transaction.doctorEmail,
          planName: transaction.planName,
          planType: transaction.planType,
          transactionAmount: transaction.transactionAmount,
          transactionStatus: transaction.transactionStatus,
          transactionDate: new Date(transaction.transactionDate).toISOString().split('T')[0], // Format as YYYY-MM-DD
          expireAt: transaction.expireAt,
          isExpired: isExpired
        };
      });
      
      setAllTransactions(transformedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = allTransactions.filter((transaction) => {
    return (
      transaction.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.doctorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.planName.toLowerCase().includes(searchQuery.toLowerCase())
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
      } else {
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

  const getStatusColor = (status: string, isExpired: boolean) => {
    if (isExpired) {
      return 'bg-gray-100 text-gray-700';
    }
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDisplayStatus = (status: string, isExpired: boolean) => {
    if (isExpired) {
      return 'Expired';
    }
    return status;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading transactions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
        <div className="text-center text-red-600 py-8">
          <p className="mb-4">Error loading transactions: {error}</p>
          <button
            onClick={fetchTransactions}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <h2 className="text-lg font-semibold mr-4">Payments</h2>
          <button
            onClick={fetchTransactions}
            className="bg-blue-100 text-blue-700 rounded-lg px-3 py-1 text-sm hover:bg-blue-200"
          >
            Refresh
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="flex items-center mb-2 md:mb-0 md:mr-4">
            <label className="mr-2 text-sm">Show</label>
            <select
              className="border rounded-lg p-1 text-sm"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <label className="ml-2 text-sm">entries</label>
          </div>
          <div className="flex items-center">
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
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2">#</th>
              <th className="py-2">Doctor</th>
              <th className="py-2">Plan</th>
              <th className="py-2">Billing Cycle</th>
              <th className="py-2">Price</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
              <th className="py-2">Expires</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              currentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-2">{transaction.id}</td>
                  <td className="py-2">
                    <div className="flex items-center">
                      {transaction.doctorName && transaction.doctorEmail ? (
                        <>
                          <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                            {transaction.doctorName.charAt(0)}
                          </span>
                          <div>
                            <div>{transaction.doctorName}</div>
                            <div className="text-xs text-gray-500">{transaction.doctorEmail}</div>
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
                  <td className="py-2">{transaction.planName}</td>
                  <td className="py-2">{transaction.planType}</td>
                  <td className="py-2">₹{transaction.transactionAmount.toFixed(2)}</td>
                  <td className="py-2">
                    <span className={`${getStatusColor(transaction.transactionStatus, transaction.isExpired)} rounded-lg p-1 text-xs`}>
                      {getDisplayStatus(transaction.transactionStatus, transaction.isExpired)}
                    </span>
                  </td>
                  <td className="py-2">{transaction.transactionDate}</td>
                  <td className="py-2">
                    <span className={`text-xs ${transaction.isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                      {new Date(transaction.expireAt).toLocaleDateString()}
                    </span>
                  </td>
                
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-4">
        <div className="text-sm text-gray-500 mb-2 md:mb-0">
          Showing {filteredTransactions.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} entries
        </div>
        {totalPages > 0 && (
          <div className="flex items-center">
            <button
              className="bg-gray-200 rounded-lg p-1 text-xs mr-1 disabled:opacity-50"
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
              className="bg-gray-200 rounded-lg p-1 text-xs disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <div className="mt-4">
        <hr className="border-t border-gray-300" />
      </div>
    </div>
  );
};

export default Transactions;