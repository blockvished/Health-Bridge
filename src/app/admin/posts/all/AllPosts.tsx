"use client";
import React, { useState } from 'react';

interface Post {
  id: number;
  content: string;
  image: string;
  status: string;
  date: string;
  action: string;
}

function Posts() {
  const dummyPosts: Post[] = [
    { id: 1, content: 'Comprehensive tools to manage efficient and effective health care practice.', image: 'image1.jpg', status: 'Published', date: '2023-01-01', action: 'Edit' },
    { id: 2, content: 'Our all-in-one healthcare practice management system is designed to simplify and optimize your clinical operations while enhancing your marketing and promotional efforts.', image: 'image2.jpg', status: 'Draft', date: '2023-01-05', action: 'Delete' },
    // Add more posts as needed
  ];

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const toggleSelectAll = () => {
    if (selectedItems.length === dummyPosts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(dummyPosts.map(post => post.id));
    }
  };

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const hasPosts = dummyPosts.length > 0;
  const startItem = hasPosts ? 1 : 0;
  const endItem = dummyPosts.length;
  const totalItems = dummyPosts.length;

  // Mobile-specific rendering for posts with improved styles
  const renderMobilePost = (post: Post) => (
    <div key={post.id} className="mb-4 bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="p-4 flex items-start border-b border-gray-100">
        <input 
          type="checkbox" 
          className="mr-3 h-5 w-5 mt-1 flex-shrink-0" 
          checked={selectedItems.includes(post.id)}
          onChange={() => toggleSelectItem(post.id)}
        />
        <div className="flex-1">
          <p className="font-medium text-gray-800 mb-2 line-clamp-2">{post.content}</p>
          <div className="text-xs text-gray-500">{post.image}</div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center">
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {post.status}
          </span>
          <span className="text-xs text-gray-500 ml-2">{post.date}</span>
        </div>
        <div className="flex space-x-3">
          <button className="text-blue-600 text-sm font-medium">
            {post.action}
          </button>
          {post.action === 'Edit' && (
            <button className="text-red-600 text-sm font-medium">Delete</button>
          )}
        </div>
      </div>
    </div>
  );

  // Empty state with improved styling
  const renderEmptyState = () => (
    <div className="py-8 text-center">
      <svg 
        className="w-16 h-16 text-gray-300 mb-4 mx-auto" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
      <h3 className="text-lg font-medium text-gray-700 mb-1">No posts found</h3>
      <p className="text-gray-500 mb-4">Get started by creating your first post</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium">
        Create New Post
      </button>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-5xl mx-auto">
        {/* Header with title and select all */}
        {hasPosts && (
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="font-semibold text-gray-800 text-lg">Posts</h2>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2 h-4 w-4"
                checked={selectedItems.length === dummyPosts.length && dummyPosts.length > 0}
                onChange={toggleSelectAll}
              />
              <span className="text-sm text-gray-600 hidden sm:inline">Select All</span>
              <span className="text-sm text-gray-600 sm:hidden">All</span>
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="p-3 sm:p-4">
          {/* Desktop Table View - Hidden on Mobile */}
          <div className="hidden sm:block overflow-x-auto">
            {hasPosts ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-600">
                    <th className="text-left px-3 py-2 font-medium">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2 h-4 w-4"
                          checked={selectedItems.length === dummyPosts.length && dummyPosts.length > 0}
                          onChange={toggleSelectAll}
                        />
                        <span>Content</span>
                      </div>
                    </th>
                    <th className="text-left px-3 py-2 font-medium">Image</th>
                    <th className="text-left px-3 py-2 font-medium">Status</th>
                    <th className="text-left px-3 py-2 font-medium">Date</th>
                    <th className="text-left px-3 py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyPosts.map((post: Post) => (
                    <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                      <td className="px-3 py-3">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2 h-4 w-4"
                            checked={selectedItems.includes(post.id)}
                            onChange={() => toggleSelectItem(post.id)}
                          />
                          <span className="text-gray-800">{post.content}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-600">{post.image}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-600">{post.date}</td>
                      <td className="px-3 py-3">
                        <button className="text-blue-600 mr-3 font-medium">{post.action}</button>
                        {post.action === 'Edit' && (
                          <button className="text-red-600 font-medium">Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              renderEmptyState()
            )}
          </div>
          
          {/* Mobile List View */}
          <div className="sm:hidden">
            {hasPosts ? (
              <div>
                {dummyPosts.map(renderMobilePost)}
              </div>
            ) : (
              renderEmptyState()
            )}
          </div>
        </div>
        
        {/* Pagination Section */}
        {hasPosts && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-gray-600 text-sm">
                Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalItems}</span> entries
              </div>
              <div className="flex">
                <button className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  ← Prev
                </button>
                <button className="px-3 py-1 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-100 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Posts;