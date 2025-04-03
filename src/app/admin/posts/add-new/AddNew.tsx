"use client";

import React, { useState } from 'react';

function AddPostForm() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [activeTab, setActiveTab] = useState('facebook');

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to an API)
    console.log({ content, image, link });
    // Reset form fields
    setContent('');
    setImage(null);
    setLink('');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-5xl bg-white p-8 rounded shadow-sm my-4">
        <h2 className="text-2xl font-semibold mb-6">Add Content*</h2>
        <form onSubmit={handleSubmit}>
          {/* Content textarea */}
          <div className="mb-6">
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              rows={5}
              placeholder="Enter content here..."
              required
            />
            <p className="text-sm text-gray-500 mt-2">{content.length} Characters</p>
          </div>

          {/* Content Image */}
          <div className="mb-6">
            <label className="block text-base text-gray-700 mb-2">Content Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded cursor-pointer"
            >
              + Browse...
            </label>
            {image && (
              <span className="ml-3 text-sm text-gray-600">
                {image.name}
              </span>
            )}
          </div>

          {/* Link */}
          <div className="mb-6">
            <label className="block text-base text-gray-700 mb-2">Link</label>
            <input
              type="url"
              value={link}
              onChange={handleLinkChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Content share link"
            />
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                className={`flex-1 py-3 px-4 font-medium text-base ${
                  activeTab === 'facebook' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('facebook')}
              >
                Facebook
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-4 font-medium text-base ${
                  activeTab === 'instagram' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('instagram')}
              >
                Instagram
              </button>
            </div>

            {activeTab === 'facebook' && (
              <div className="mt-6 space-y-4">
                {/* Facebook specific fields */}
                <select className="w-full p-3 border border-gray-300 rounded-md bg-white">
                  <option>Unpublished</option>
                </select>

                <select className="w-full p-3 border border-gray-300 rounded-md bg-white">
                  <option>Post To My Facebook Accounts?</option>
                </select>

                <div className="flex gap-4 mt-4">
                  <button 
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded"
                  >
                    Select All
                  </button>
                  <button 
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded"
                  >
                    Select None
                  </button>
                </div>

                <select className="w-full p-3 border border-gray-300 rounded-md bg-white">
                  <option>More posting groups?</option>
                </select>

                <input 
                  type="text" 
                  placeholder="Custom link" 
                  className="w-full p-3 border border-gray-300 rounded-md" 
                />

                <textarea 
                  placeholder="Custom message" 
                  className="w-full p-3 border border-gray-300 rounded-md" 
                  rows={4} 
                />

                <select className="w-full p-3 border border-gray-300 rounded-md bg-white">
                  <option>Schedule in Individual?</option>
                </select>

                <input 
                  type="datetime-local" 
                  className="w-full p-3 border border-gray-300 rounded-md" 
                />

                <input 
                  type="number" 
                  placeholder="Schedule button" 
                  className="w-full p-3 border border-gray-300 rounded-md" 
                />

                <p className="text-sm text-gray-500 mt-2">
                  Note: Make sure to schedule it at least 5 minutes of the current time.
                </p>
              </div>
            )}

            {activeTab === 'instagram' && (
              <div className="mt-6">
                <p className="text-center text-gray-500 py-8">Coming Soon</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-8 rounded"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPostForm;