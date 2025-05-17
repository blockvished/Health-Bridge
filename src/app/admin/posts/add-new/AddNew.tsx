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
  const [postOption, setPostOption] = useState<"now" | "schedule">("now");
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

  const handlePostOptionChange = (option: "now" | "schedule") => {
    setPostOption(option);
    setError(""); // Clear any previous errors when switching options
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSocialMedia = socialMediaOptions
      .filter((option) => option.isSelected)
      .map((option) => option.id);

    if (selectedSocialMedia.length === 0) {
      setError("Please select at least one social media platform.");
      return;
    }

    if (postOption === "schedule" && !scheduleTime) {
      setError("Please select a schedule date and time.");
      return;
    }

    const postData = {
      content,
      image,
      socialMedia: selectedSocialMedia,
      ...(postOption === "schedule" && { scheduleTime }),
    };

    const apiUrl =
      postOption === "now"
        ? "/api/auth/connections/post"
        : "/api/auth/connections/schedule";

    console.log("Posting data:", postData, "to:", apiUrl);

    // In a real application, you would make an API call here
    // try {
    //   const response = await fetch(apiUrl, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(postData),
    //   });
    //   if (response.ok) {
    //     console.log('Post successful!');
    //     setContent("");
    //     setImage(null);
    //     setSocialMediaOptions((prevOptions) =>
    //       prevOptions.map((option) => ({ ...option, isSelected: false }))
    //     );
    //     setScheduleTime("");
    //     setError("");
    //     setPostOption("now"); // Reset to default
    //   } else {
    //     console.error('Post failed:', response.status);
    //     setError('Failed to add post.');
    //   }
    // } catch (error: any) {
    //   console.error('Error posting:', error);
    //   setError('An error occurred while adding the post.');
    // }
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

          <div className="flex items-center space-x-4 mb-4">
            <div>
              <input
                type="radio"
                id="post-now"
                name="postOption"
                value="now"
                checked={postOption === "now"}
                onChange={() => handlePostOptionChange("now")}
                className="mr-2"
              />
              <label htmlFor="post-now" className="text-sm font-medium text-gray-700">
                Post Now
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="schedule-later"
                name="postOption"
                value="schedule"
                checked={postOption === "schedule"}
                onChange={() => handlePostOptionChange("schedule")}
                className="mr-2"
              />
              <label htmlFor="schedule-later" className="text-sm font-medium text-gray-700">
                Schedule for Later
              </label>
            </div>
          </div>

          {postOption === "schedule" && (
            <div>
              <label
                htmlFor="schedule-time"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Schedule Date & Time*
              </label>
              <input
                type="datetime-local"
                id="schedule-time"
                value={scheduleTime}
                onChange={handleScheduleTimeChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="YYYY-MM-DD hh:mm"
                required={postOption === "schedule"}
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md"
          >
            {postOption === "now" ? "Post Now" : "Schedule Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPostForm;