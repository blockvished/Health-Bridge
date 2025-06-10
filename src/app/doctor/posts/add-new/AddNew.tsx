"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface SocialMediaOption {
  id: string;
  label: string;
  isSelected: boolean;
}

async function fetchSocialMediaPlatforms(): Promise<SocialMediaOption[]> {
  try {
    const response = await fetch(
      "/api/auth/connections/get_all_social_platforms"
    );
    if (!response.ok) {
      console.error("Failed to fetch social media platforms:", response.status);
      return [];
    }
    const data = await response.json();
    // Assuming the API returns an array of objects with 'id' and 'name' properties
    return data.map((platform: { id: number; name: string }) => ({
      id: platform.id.toString(),
      label: platform.name,
      isSelected: false,
    }));
  } catch (error) {
    console.error("Error fetching social media platforms:", error);
    return [];
  }
}

function AddPostForm() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [socialMediaOptions, setSocialMediaOptions] = useState<
    SocialMediaOption[]
  >([]);
  const [scheduleTime, setScheduleTime] = useState("");
  const [postOption, setPostOption] = useState<"now" | "schedule">("now");
  const [error, setError] = useState("");
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const loadPlatforms = async () => {
      const platforms = await fetchSocialMediaPlatforms();
      setSocialMediaOptions(platforms);
      setLoadingPlatforms(false);
    };

    loadPlatforms();
  }, []);

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

  const handleSelectAll = () => {
    setSocialMediaOptions((prevOptions) =>
      prevOptions.map((option) => ({ ...option, isSelected: true }))
    );
  };

  const handleDeselectAll = () => {
    setSocialMediaOptions((prevOptions) =>
      prevOptions.map((option) => ({ ...option, isSelected: false }))
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

    setIsSubmitting(true); // Disable the button while submitting

    const postData = new FormData();
    postData.append("content", content);
    if (image) {
      postData.append("image", image);
    }
    postData.append("socialMedia", JSON.stringify(selectedSocialMedia));
    if (postOption === "schedule") {
      postData.append("scheduleTime", scheduleTime);
    }

    const apiUrl =
      postOption === "now"
        ? "/api/auth/connections/post_new"
        : "/api/auth/connections/schedule";

    // Log the data being sent
    const formDataEntries: [string, FormDataEntryValue][] = Array.from(
      postData.entries()
    );
    const formDataObject = Object.fromEntries(formDataEntries);
    console.log("Posting data:", formDataObject, "to:", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: postData,
      });
      if (response.ok) {
        console.log("Post successful!");
        setContent("");
        setImage(null);
        setSocialMediaOptions((prevOptions) =>
          prevOptions.map((option) => ({ ...option, isSelected: false }))
        );
        setScheduleTime("");
        setError("");
        setPostOption("now"); // Reset to default
        setShowSuccessPopup(true); // Show success popup
      } else {
        console.error("Post failed:", response.status);
        const errorData = await response.json();
        setError(errorData?.message || "Failed to add post.");
      }
    } catch (error: unknown) {
      console.error("Error posting:", error);
      if (error instanceof Error) {
        setError(`An error occurred: ${error.message}`);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
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
            {!loadingPlatforms && (
              <div className="mb-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-1 px-3 rounded-md mr-2 text-sm"
                >
                  Select All
                </button>

                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-1 px-3 rounded-md text-sm"
                >
                  Deselect All
                </button>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {loadingPlatforms && `Loading social media platforms...`}
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
                    {option.label.charAt(0).toUpperCase() +
                      option.label.slice(1).toLowerCase()}
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
              <label
                htmlFor="post-now"
                className="text-sm font-medium text-gray-700"
              >
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
              <label
                htmlFor="schedule-later"
                className="text-sm font-medium text-gray-700"
              >
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
            disabled={isSubmitting}
            className={`font-medium py-2 px-6 rounded-md ${
              isSubmitting
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isSubmitting
              ? "Processing..."
              : postOption === "now"
              ? "Post Now"
              : "Schedule Post"}
          </button>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {postOption === "now"
                ? "Post Successfully Created!"
                : "Post Successfully Scheduled!"}
            </h3>
            <p className="mb-6">
              {postOption === "now"
                ? "Your content has been posted to the selected platforms."
                : "Your content has been scheduled for the selected platforms."}
            </p>
            <div className="flex justify-end">
              <Link
                href="/admin/posts/all"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddPostForm;
