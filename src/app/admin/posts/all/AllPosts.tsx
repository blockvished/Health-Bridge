"use client";
import React from "react";

interface Post {
  id: number;
  content: string;
  image: string;
  status: string;
  date: string;
  action?: string;
  interactions?: number;
  publishedBy?: string;
  publishedByAvatar?: string;
  scheduledFor?: string;
  scheduledTime?: string;
  scheduledBy?: string;
  scheduledByAvatar?: string;
}

function Posts() {
  // const publishedPosts: Post[] = [];
  // const scheduledPosts: Post[] = [];
  // Sample data for published posts
  const publishedPosts: Post[] = [
    {
      id: 1,
      content:
        "Comprehensive tools to manage efficient and effective health care practice.",
      image: "image1.jpg",
      status: "Published",
      date: "15 Jun 2023",
      interactions: 24,
      publishedBy: "Dr. Smith",
      publishedByAvatar: "/avatar1.jpg",
    },
    {
      id: 2,
      content:
        "Our all-in-one healthcare practice management system is designed to simplify and optimize your clinical operations while enhancing your marketing and promotional efforts.",
      image: "image2.jpg",
      status: "Published",
      date: "12 Jun 2023",
      interactions: 18,
      publishedBy: "Dr. Johnson",
      publishedByAvatar: "/avatar2.jpg",
    },
  ];

  // // Sample data for scheduled posts
  const scheduledPosts: Post[] = [
    {
      id: 3,
      content:
        "5 Clinic Owners Use Doctors Method to Make [Post] increase revenue by 200% in 6 months through…",
      image: "scheduled1.jpg",
      status: "Scheduled",
      date: "Today",
      action: "Edit",
      scheduledFor: "Today",
      scheduledTime: "07:00 PM EST",
      scheduledBy: "Owner",
      scheduledByAvatar: "/avatar3.jpg",
    },
    {
      id: 4,
      content:
        "3 Red Flags Your Practice is Falling Behind: [Spending hours on WhatsApp]",
      image: "scheduled2.jpg",
      status: "Scheduled",
      date: "Tomorrow",
      action: "Edit",
      scheduledFor: "Tomorrow",
      scheduledTime: "08:00 AM EST",
      scheduledBy: "Owner",
      scheduledByAvatar: "/avatar4.jpg",
    },
  ];

  // Social platform icons with improved design
  const SocialIcons = () => (
    <div className="flex space-x-2">
      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs shadow-sm">
        f
      </div>
      <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs shadow-sm">
        t
      </div>
      <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs shadow-sm">
        i
      </div>
    </div>
  );

  // Render the avatar with improved design
  const renderAvatar = (avatarUrl: string) => (
    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );

  // Empty state with improved styling
  const renderEmptyState = (section: string) => (
    <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
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
      <h3 className="text-lg font-medium text-gray-700 mb-1">
        No {section} posts found
      </h3>
      <p className="text-gray-500 mb-4">
        Get started by creating your first {section.toLowerCase()} post
      </p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium flex items-center mx-auto">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        Create New Post
      </button>
    </div>
  );

  // Action button with improved design
  const ActionButton = () => (
    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm">
      <span>Edit</span>
      <svg
        className="w-4 h-4 ml-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        ></path>
      </svg>
    </button>
  );

  // Published Posts Section
  const renderPublishedPostsSection = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-5xl mx-auto mb-8">
      {/* Header with title */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <h2 className="font-semibold text-gray-800 text-xl">Published Posts</h2>
      </div>

      {/* Content area */}
      <div className="p-4 sm:p-6">
        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden sm:block overflow-x-auto">
          {publishedPosts.length > 0 ? (
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b-2 border-gray-100 text-sm text-gray-600">
                  <th className="text-left px-4 py-3 font-medium w-1/6">
                    PUBLISHED ON
                  </th>
                  <th className="text-left px-4 py-3 font-medium w-1/2">
                    POST CONTENT
                  </th>
                  <th className="text-center px-4 py-3 font-medium">
                    INTERACTIONS
                  </th>
                  <th className="text-left px-4 py-3 font-medium">
                    PUBLISHED BY
                  </th>
                </tr>
              </thead>
              <tbody>
                {publishedPosts.map((post: Post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-100 hover:bg-gray-50 text-sm"
                  >
                    <td className="px-4 py-4 text-gray-800 font-medium">
                      {post.date}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 flex-shrink-0 shadow-sm overflow-hidden">
                          <img
                            src={post.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-gray-800 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-center bg-blue-50 rounded-md px-3 py-1 inline-block font-medium text-blue-700 mx-auto">
                        {post.interactions}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {post.publishedByAvatar &&
                          renderAvatar(post.publishedByAvatar)}
                        <span className="ml-2 text-gray-800">
                          {post.publishedBy}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            renderEmptyState("Published")
          )}
        </div>

        {/* Mobile List View for Published Posts */}
        <div className="sm:hidden">
          {publishedPosts.length > 0 ? (
            <div className="space-y-4">
              {publishedPosts.map((post: Post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="p-4">
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700">
                        {post.date}
                      </div>
                    </div>

                    <div className="flex items-start mb-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-3 flex-shrink-0 shadow-sm overflow-hidden">
                        <img
                          src={post.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-medium text-gray-800 line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="text-center bg-blue-50 rounded-md px-2 py-1 text-xs font-medium text-blue-700 mr-2">
                          {post.interactions}
                        </div>
                        <span className="text-xs text-gray-500">
                          Interactions
                        </span>
                      </div>
                      <div className="flex items-center">
                        {post.publishedByAvatar &&
                          renderAvatar(post.publishedByAvatar)}
                        <span className="ml-2 text-xs text-gray-700">
                          {post.publishedBy}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState("Published")
          )}
        </div>
      </div>
    </div>
  );

  // Scheduled Posts Section
  const renderScheduledPostsSection = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-5xl mx-auto">
      {/* Header with title */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <h2 className="font-semibold text-gray-800 text-xl">Scheduled Posts</h2>
      </div>

      {/* Content area */}
      <div className="p-4 sm:p-6">
        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden sm:block overflow-x-auto">
          {scheduledPosts.length > 0 ? (
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b-2 border-gray-100 text-sm text-gray-600">
                  <th className="text-left px-4 py-3 font-medium w-1/6">
                    SCHEDULED FOR
                  </th>
                  <th className="text-left px-4 py-3 font-medium w-2/5">
                    POST CONTENT
                  </th>
                  <th className="text-left px-4 py-3 font-medium">PLATFORMS</th>
                  <th className="text-left px-4 py-3 font-medium">
                    SCHEDULED BY
                  </th>
                  <th className="text-center px-4 py-3 font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {scheduledPosts.map((post: Post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-100 hover:bg-gray-50 text-sm"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-gray-800 font-medium">
                          {post.scheduledFor}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {post.scheduledTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 flex-shrink-0 shadow-sm overflow-hidden">
                          <img
                            src={post.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-gray-800 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <SocialIcons />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {post.scheduledByAvatar &&
                          renderAvatar(post.scheduledByAvatar)}
                        <span className="ml-2 text-gray-800">
                          {post.scheduledBy || "Owner"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <ActionButton />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            renderEmptyState("Scheduled")
          )}
        </div>

        {/* Mobile List View for Scheduled Posts */}
        <div className="sm:hidden">
          {scheduledPosts.length > 0 ? (
            <div className="space-y-4">
              {scheduledPosts.map((post: Post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {post.scheduledFor}
                        </div>
                        <div className="text-xs text-gray-500">
                          {post.scheduledTime}
                        </div>
                      </div>
                      <ActionButton />
                    </div>

                    <div className="flex items-start mb-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-3 flex-shrink-0 shadow-sm overflow-hidden">
                        <img
                          src={post.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-medium text-gray-800 line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <SocialIcons />
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Owner Scheduled
                      </span>
                    </div>

                    <div className="flex justify-end items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        {post.scheduledByAvatar &&
                          renderAvatar(post.scheduledByAvatar)}
                        <span className="ml-2 text-xs text-gray-700">
                          {post.scheduledBy || "Owner"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState("Scheduled")
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      {/* Published Posts Section */}
      {renderPublishedPostsSection()}

      {/* Scheduled Posts Section */}
      {renderScheduledPostsSection()}
    </div>
  );
}

export default Posts;
