"use client";

import React, { useState } from "react";

interface SocialMediaOption {
  id: string;
  label: string;
  isSelected: boolean;
}

function AddPostForm() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [socialMediaOptions, setSocialMediaOptions] = useState<
    SocialMediaOption[]
  >([
    { id: "facebook", label: "Facebook", isSelected: false },
    { id: "instagram", label: "Instagram", isSelected: false },
    { id: "twitter", label: "Twitter", isSelected: false },
    { id: "google", label: "Google", isSelected: false },
    { id: "linkedin", label: "LinkedIn", isSelected: false },
  ]);
  const [scheduleTime, setScheduleTime] = useState("");
  const [error, setError] = useState("");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSocialMediaChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setSocialMediaOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, isSelected: e.target.checked } : option
      )
    );
  };

  const handleScheduleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScheduleTime(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSocialMedia = socialMediaOptions
      .filter((option) => option.isSelected)
      .map((option) => option.id);

    if (selectedSocialMedia.length === 0) {
      setError("Please select at least one social media platform.");
      return;
    }

    console.log({
      content,
      image,
      socialMedia: selectedSocialMedia,
      scheduleTime,
    });
    setContent("");
    setImage(null);
    setSocialMediaOptions((prevOptions) =>
      prevOptions.map((option) => ({ ...option, isSelected: false }))
    );
    setScheduleTime("");
    setError("");
  };

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full bg-white p-6 rounded-lg shadow-md my-4">
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
              Content Image (Optional)
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
              Social Media*
            </label>
            <div className="grid grid-cols-3 gap-2">
              {socialMediaOptions.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={option.isSelected}
                    onChange={(e) => handleSocialMediaChange(e, option.id)}
                    className="mr-2"
                  />
                  <label htmlFor={option.id} className="text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label
              htmlFor="schedule-time"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Schedule Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              id="schedule-time"
              value={scheduleTime}
              onChange={handleScheduleTimeChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="YYYY-MM-DD hh:mm"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md"
          >
            Add Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPostForm;