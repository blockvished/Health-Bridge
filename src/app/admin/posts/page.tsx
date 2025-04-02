"use client";
import React from 'react';

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
    { id: 1, content: 'Post 1', image: 'image1.jpg', status: 'Published', date: '2023-01-01', action: 'Edit' },
    { id: 2, content: 'Post 2', image: 'image2.jpg', status: 'Draft', date: '2023-01-05', action: 'Delete' },
    // Add more posts as needed
  ];

  const hasPosts = dummyPosts.length > 0;
  const startItem = hasPosts ? 1 : 0;
  const endItem = dummyPosts.length;
  const totalItems = dummyPosts.length;

  return (
    <div className="bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3">
                  <input type="checkbox" className="mr-2" />
                  Content
                </th>
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">
                  Status <span className="text-xs ml-1">▼</span>
                </th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">
                  Action <span className="text-xs ml-1">↕</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {hasPosts ? (
                dummyPosts.map((post: Post) => (
                  <tr key={post.id} className="border-b border-gray-200">
                    <td className="p-3">{post.content}</td>
                    <td className="p-3">{post.image}</td>
                    <td className="p-3">{post.status}</td>
                    <td className="p-3">{post.date}</td>
                    <td className="p-3">{post.action}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8">
                    <div className="py-6">
                      <svg 
                        className="w-16 h-16 text-gray-300 mb-4" 
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
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                        Create New Post
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-5 flex justify-between items-center border-t border-gray-200">
          <div className="text-gray-600">
            {hasPosts 
              ? `Showing ${startItem} to ${endItem} of ${totalItems} entries`
              : `Showing 0 entries`
            }
          </div>
          <div>
            <button 
              className={`px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-100 ${!hasPosts ? 'opacity-50 cursor-not-allowed' : ''}`} 
              disabled={!hasPosts}
            >
              ← Previous
            </button>
            <button 
              className={`px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 ${!hasPosts ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!hasPosts}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Posts;