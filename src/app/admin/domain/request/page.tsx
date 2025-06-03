"use client"
import React, { useState, useEffect } from "react";

interface DomainRequest {
  id: number;
  currentDomain: string;
  customDomain: string;
  date: string;
  status: string;
  action: string;
}

const CustomDomainRequest: React.FC = () => {
  const [domainRequests, setDomainRequests] = useState<DomainRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{currentDomain: string, status: string}>({
    currentDomain: '',
    status: ''
  });

  useEffect(() => {
    const fetchDomainRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/doctor_custom_domains');
        
        if (!response.ok) {
          throw new Error('Failed to fetch domain requests');
        }
        
        const data = await response.json();
        setDomainRequests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDomainRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'active':
        return 'bg-green-200 text-green-800';
      case 'inactive':
        return 'bg-red-200 text-red-800';
      case 'approved':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const handleEdit = (request: DomainRequest) => {
    setEditingId(request.id);
    setEditValues({
      currentDomain: request.currentDomain,
      status: request.status.toLowerCase() // Ensure consistent casing
    });
  };

  const handleSave = async (id: number) => {
    try {
      console.log('Saving with values:', editValues); // Debug log
      
      // Make API call to save the changes
      const response = await fetch(`/api/admin/doctor_custom_domains/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentDomain: editValues.currentDomain,
          status: editValues.status
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData); // Debug log
        throw new Error('Failed to save changes');
      }

      const responseData = await response.json();
      console.log('Server response data:', responseData); // Debug log

      // Update the local state
      setDomainRequests(prev => 
        prev.map(request => 
          request.id === id 
            ? { ...request, currentDomain: editValues.currentDomain, status: editValues.status }
            : request
        )
      );

      setEditingId(null);
      setEditValues({ currentDomain: '', status: '' });
    } catch (err) {
      console.error('Save error:', err); // Debug log
      setError('Failed to save changes');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ currentDomain: '', status: '' });
  };

  const handleStatusChange = (newStatus: string) => {
    console.log('Status changed to:', newStatus); // Debug log
    setEditValues(prev => ({ ...prev, status: newStatus }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Domain Request</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading domain requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Domain Request</h2>
        <div className="text-red-600 text-center py-8">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Domain Request</h2>
      {domainRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No domain requests found</p>
        </div>
      ) : (
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2 px-2 sm:px-4 whitespace-nowrap">#</th> 
              <th className="py-2 px-2 sm:px-4 whitespace-nowrap">Current Domain</th>
              <th className="py-2 px-2 sm:px-4 whitespace-nowrap">Custom Domain</th>
              <th className="py-2 px-2 sm:px-4 whitespace-nowrap">Date</th>
              <th className="py-2 px-2 sm:px-4 whitespace-nowrap">Status</th>
              <th className="py-2 px-2 sm:px-4 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {domainRequests.map((request) => (
              <tr key={request.id} className="border-t">
                <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{request.id}</td>
                
                {/* Editable Current Domain */}
                <td className="py-2 px-2 sm:px-4">
                  {editingId === request.id ? (
                    <input
                      type="text"
                      value={editValues.currentDomain}
                      onChange={(e) => setEditValues(prev => ({ ...prev, currentDomain: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter domain URL"
                    />
                  ) : (
                    <a 
                      href={request.currentDomain} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {request.currentDomain}
                    </a>
                  )}
                </td>
                
                <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{request.customDomain}</td>
                <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{request.date}</td>
                
                {/* Editable Status */}
                <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
                  {editingId === request.id ? (
                    <select
                      value={editValues.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                    </select>
                  ) : (
                    <span className={`${getStatusColor(request.status)} rounded-full px-2 py-1 text-xs`}>
                      {request.status}
                    </span>
                  )}
                </td>
                
                {/* Action Buttons */}
                <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
                  {editingId === request.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(request.id)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(request)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomDomainRequest;