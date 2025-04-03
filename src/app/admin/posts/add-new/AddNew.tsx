"use client";

import React, { useState } from "react";

function AddPostForm() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [activeTab, setActiveTab] = useState("facebook");
  const [customLink, setCustomLink] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleValue, setScheduleValue] = useState("");

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

  const handleCustomLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomLink(e.target.value);
  };

  const handleCustomMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomMessage(e.target.value);
  };

  const handleScheduleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScheduleTime(e.target.value);
  };

  const handleScheduleValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScheduleValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      tab: activeTab,
      content,
      image,
      link,
      customLink,
      customMessage,
      scheduleTime,
      scheduleValue,
    });
    setContent("");
    setImage(null);
    setLink("");
    setCustomLink("");
    setCustomMessage("");
    setScheduleTime("");
    setScheduleValue("");
  };

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full  bg-white p-6 rounded-lg shadow-md my-4">
        <h2 className="text-2xl font-semibold mb-4">Add Content*</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              rows={4}
              placeholder="Enter content here..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {content.length} Characters
            </p>
          </div>

          <div>
            <label
              htmlFor="image-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content Image
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md cursor-pointer"
              >
                + Browse...
              </label>
              {image && (
                <span className="text-sm text-gray-600">{image.name}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link
            </label>
            <input
              type="url"
              value={link}
              onChange={handleLinkChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Content share link"
            />
          </div>

          <div>
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                className={`flex-1 py-2 px-3 font-medium text-sm ${
                  activeTab === "facebook"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("facebook")}
              >
                Facebook
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 font-medium text-sm ${
                  activeTab === "instagram"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("instagram")}
              >
                Instagram
              </button>
            </div>

            {activeTab === "facebook" && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-col">
                  <label className="text-blue-600 text-sm font-medium mb-1">
                    Status
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700">
                    <option>Unpublished</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-blue-600 text-sm font-medium mb-1">
                    Post To This Facebook Account(s)
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700">
                    <option>Select account</option>
                  </select>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md text-sm"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md text-sm"
                  >
                    Select None
                  </button>
                </div>

                <div className="flex flex-col">
                  <label className="text-blue-600 text-sm font-medium mb-1">
                    Share posting type
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700">
                    <option>Link posting</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-blue-600 text-sm font-medium mb-1">
                    Custom Link
                  </label>
                  <input
                    type="text"
                    value={customLink}
                    onChange={handleCustomLinkChange}
                    placeholder="Custom Link"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-blue-600 text-sm font-medium mb-1">
                    Custom Message
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={handleCustomMessageChange}
                    placeholder="Custom message"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-blue-600 text-sm font-medium mb-1">
                    Schedule Individually
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={handleScheduleTimeChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="YYYY-MM-DD hh:mm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-blue-600 text-sm font-medium mb-1">
                    Schedule Global
                  </label>
                  <div className="flex border border-gray-300 rounded-md bg-white">
                    <div className="py-2 px-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <input
                      type="number"
                      value={scheduleValue}
                      onChange={handleScheduleValueChange}
                      className="w-full p-2 border-0 focus:ring-0"
                    />
                  </div>
                </div>

                <div className="bg-gray-100 p-3 rounded-md flex items-center">
                  <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                    i
                  </span>
                  <p className="text-sm text-gray-600">
                    Note: You can only schedule the content if the current
                    status set to unpublished.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "instagram" && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-blue-600 mb-1">
                    Status
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                    <option>Unpublished</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-blue-600 mb-1">
                    Post To This Instagram
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                    <option>Select Instagram Account</option>
                  </select>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md text-sm"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md text-sm"
                  >
                    Select None
                  </button>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-blue-600 mb-1">
                    Share posting type
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                    <option>Image posting</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-blue-600 mb-1">
                    Post Image
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="instagram-image-upload"
                    />
                    <label
                      htmlFor="instagram-image-upload"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md cursor-pointer"
                    >
                      + Browse...
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-blue-600 mb-1">
                    Custom Message
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={handleCustomMessageChange}
                    placeholder="Enter custom message"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-blue-600 mb-1">
                    Schedule Individually
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={handleScheduleTimeChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="YYYY-MM-DD hh:mm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-blue-600 mb-1">
                    Schedule Global
                  </label>
                  <input
                    type="number"
                    value={scheduleValue}
                    onChange={handleScheduleValueChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="bg-gray-100 p-3 rounded-md flex items-center">
                  <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                    i
                  </span>
                  <p className="text-sm text-gray-600">
                    Note: You can only schedule the content if the current
                    status set to unpublished.
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {!activeTab.includes("instagram") && (
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md"
            >
              Add
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddPostForm;