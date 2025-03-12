import React from 'react';

const Topbar: React.FC = () => (
    <div className="flex justify-between items-center mb-6">
    <button className="p-2 rounded-full hover:bg-gray-100">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
      </svg>
    </button>
    
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
        </svg>
        Create as New
      </button>
      
      <div className="flex items-center gap-2">
        <img src="https://via.placeholder.com/32" alt="Profile" className="w-8 h-8 rounded-full" />
        <span>Dr...</span>
      </div>
    </div>
  </div>
)

export default Topbar;