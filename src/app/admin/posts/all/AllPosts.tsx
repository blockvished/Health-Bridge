"use client";
import React, { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: number;
  content: string;
  imageLocalLink?: string;
  status: string;
  createdAt: string;
  interactions?: number;
  publishedBy?: string;
  publishedByAvatar?: string;
  scheduledTime?: string;
  scheduledBy?: string;
  scheduledByAvatar?: string;
  postSocialPlatforms?: string[];
}

function Posts() {
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/auth/connections/get_all_posts");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch posts: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        if (data && data.posts) {
          const published = data.posts.filter(
            (post: Post) => post.status !== "scheduled"
          );
          const scheduled = data.posts.filter(
            (post: Post) => post.status === "scheduled"
          );
          setPublishedPosts(published);
          setScheduledPosts(scheduled);
        } else {
          setPublishedPosts([]);
          setScheduledPosts([]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error("Error fetching posts:", err);
        } else {
          setError("An unknown error occurred.");
          console.error("An unknown error occurred:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Social platform icons with improved design
  const SocialIcons = ({ platforms }: { platforms: string[] }) => (
    <div className="flex space-x-2">
      {platforms?.includes("facebook") && (
        <FaFacebook className="w-6 h-6 text-blue-600" />
      )}
      {platforms?.includes("twitter") && (
        <FaTwitter className="w-6 h-6 text-blue-600" />
      )}
      {platforms?.includes("instagram") && (
        <FaInstagram className="w-6 h-6 text-pink-600" />
      )}
      {platforms?.includes("linkedin") && (
        <FaLinkedin className="w-6 h-6 text-blue-800" />
      )}
    </div>
  );

  // Empty state with improved styling
  const renderEmptyState = () => (
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
        No Scheduled posts found
      </h3>
      <p className="text-gray-500 mb-4">
        Get started by creating your first scheduled post
      </p>
      <div className="flex justify-center">
        <Link
          href="/admin/posts/add-new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium flex items-center"
        >
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
        </Link>
      </div>
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
                  {/* <th className="text-center px-4 py-3 font-medium">
                    INTERACTIONS
                  </th> */}
                  <th className="text-left px-4 py-3 font-medium">
                    PUBLISHED BY
                  </th>
                  <th className="text-left px-4 py-3 font-medium">PLATFORMS</th>
                </tr>
              </thead>
              <tbody>
                {publishedPosts.map((post: Post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-100 hover:bg-gray-50 text-sm"
                  >
                    <td className="px-4 py-4 text-gray-800 font-medium">
                      {new Date(post.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {post.imageLocalLink && (
                          <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 flex-shrink-0 shadow-sm overflow-hidden relative">
                            <Image
                              src={post.imageLocalLink}
                              alt=""
                              fill
                              className="object-cover rounded-md"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <p className="text-gray-800 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    </td>
                    {/* <td className="px-4 py-4">
                      <div className="text-center bg-blue-50 rounded-md px-3 py-1 inline-block font-medium text-blue-700 mx-auto">
                        {post.interactions || 0}
                      </div>
                    </td> */}
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <span className="ml-2 text-gray-800">
                          {post.publishedBy || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <SocialIcons platforms={post.postSocialPlatforms || []} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            renderEmptyState()
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
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="flex items-start mb-3">
                      {post.imageLocalLink && (
                        <div className="w-16 h-16 bg-gray-100 rounded-md mr-3 flex-shrink-0 shadow-sm overflow-hidden relative">
                          <Image
                            src={post.imageLocalLink}
                            alt=""
                            fill
                            className="object-cover rounded-md"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <p className="font-medium text-gray-800 line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="text-center bg-blue-50 rounded-md px-2 py-1 text-xs font-medium text-blue-700 mr-2">
                          {post.interactions || 0}
                        </div>
                        <span className="text-xs text-gray-500">
                          Interactions
                        </span>
                      </div>
                      <div className="flex items-center">
                        <SocialIcons
                          platforms={post.postSocialPlatforms || []}
                        />
                        <span className="ml-2 text-xs text-gray-700">
                          {post.publishedBy || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState()
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
                {/* <th className="text-center px-4 py-3 font-medium">ACTIONS</th> */}
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
                        {post.scheduledTime
                          ? new Date(post.scheduledTime).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {post.scheduledTime
                          ? new Date(post.scheduledTime).toLocaleTimeString(
                              "en-IN",
                              { hour: "2-digit", minute: "2-digit" }
                            )
                          : "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {post.imageLocalLink && (
                        <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 flex-shrink-0 shadow-sm overflow-hidden relative">
                          <Image
                            src={post.imageLocalLink}
                            alt=""
                            fill
                            className="object-cover rounded-md"
                            sizes="48px"
                          />
                        </div>
                      )}
                      <p className="text-gray-800 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <SocialIcons platforms={post.postSocialPlatforms || []} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <span className="ml-2 text-gray-800">
                        {post.publishedBy || "N/A"}
                      </span>
                    </div>
                  </td>
                  {/* <td className="px-4 py-4 text-center">
                    <ActionButton />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
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
                          {post.scheduledTime
                            ? new Date(post.scheduledTime).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {post.scheduledTime
                            ? new Date(post.scheduledTime).toLocaleTimeString(
                                "en-IN",
                                { hour: "2-digit", minute: "2-digit" }
                              )
                            : "N/A"}
                        </div>
                      </div>
                      <ActionButton />
                    </div>

                    <div className="flex items-start mb-3">
                      {post.imageLocalLink && (
                        <div className="w-16 h-16 bg-gray-100 rounded-md mr-3 flex-shrink-0 shadow-sm overflow-hidden relative">
                          <Image
                            src={post.imageLocalLink}
                            alt=""
                            fill
                            className="object-cover rounded-md"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <p className="font-medium text-gray-800 line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <SocialIcons platforms={post.postSocialPlatforms || []} />
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Scheduled
                      </span>
                    </div>

                    <div className="flex justify-end items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <span className="ml-2 text-xs text-gray-700">
                          {post.publishedBy || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center min-h-screen flex items-center justify-center">
        Error loading posts: {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      {publishedPosts.length > 0 ? (
        <>
          {publishedPosts.length > 0 && renderPublishedPostsSection()}
          {scheduledPosts.length > 0 && renderScheduledPostsSection()}
        </>
      ) : (
        <>
          {scheduledPosts.length > 0 && renderScheduledPostsSection()}
          {publishedPosts.length > 0 && renderPublishedPostsSection()}
        </>
      )}
      {publishedPosts.length === 0 &&
        scheduledPosts.length === 0 &&
        renderEmptyState()}
    </div>
  );
}

export default Posts;
