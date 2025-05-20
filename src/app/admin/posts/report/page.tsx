"use client";
import React from "react"; // Added React import for JSX namespace
import {
  ArrowUp,
  ArrowDown,
  Activity,
  Users,
  MessageSquare,
  Eye,
} from "lucide-react";

// Define TypeScript interface for our platform data
interface SocialPlatformData {
  platform: string;
  icon: string;
  color: string;
  totalFollowers: number;
  totalFollowersChange: number;
  newFollowers: number;
  newFollowersChange: number;
  posts: number;
  postsChange: number;
  reach: number;
  reachChange: number;
  engagement: number;
  engagementChange: number;
}

export default function SocialMediaDashboard() {
  // Sample data - this would be replaced with API data in the future
  const socialData: SocialPlatformData[] = [
    {
      platform: "Facebook",
      icon: "facebook",
      color: "#1877F2",
      totalFollowers: 221,
      totalFollowersChange: 0.5,
      newFollowers: 4,
      newFollowersChange: 25.0,
      posts: 60,
      postsChange: 0.0,
      reach: 51,
      reachChange: 7.9,
      engagement: 36,
      engagementChange: 41.0,
    },
    {
      platform: "X (formerly Twitter)",
      icon: "twitter",
      color: "#000000",
      totalFollowers: 105,
      totalFollowersChange: -2.8,
      newFollowers: 2,
      newFollowersChange: -50.0,
      posts: 57,
      postsChange: 5.0,
      reach: 32,
      reachChange: -8.6,
      engagement: 26,
      engagementChange: -15.5,
    },
    {
      platform: "LinkedIn",
      icon: "linkedin",
      color: "#0A66C2",
      totalFollowers: 186,
      totalFollowersChange: 20.0,
      newFollowers: 11,
      newFollowersChange: 120.0,
      posts: 47,
      postsChange: -5.0,
      reach: 78,
      reachChange: 14.3,
      engagement: 40,
      engagementChange: 33.3,
    },
    {
      platform: "Instagram",
      icon: "instagram",
      color: "#E4405F",
      totalFollowers: 341,
      totalFollowersChange: 8.0,
      newFollowers: 12,
      newFollowersChange: 100.0,
      posts: 35,
      postsChange: 16.7,
      reach: 122,
      reachChange: 30.0,
      engagement: 92,
      engagementChange: 28.8,
    },
    {
      platform: "TikTok",
      icon: "tiktok",
      color: "#000000",
      totalFollowers: 408,
      totalFollowersChange: 35.5,
      newFollowers: 22,
      newFollowersChange: 175.0,
      posts: 28,
      postsChange: 40.0,
      reach: 215,
      reachChange: 56.2,
      engagement: 125,
      engagementChange: 67.3,
    },
  ];

  // Function to render the change indicator - fixed with proper typing
  const renderChangeIndicator = (value: number): React.ReactElement => {
    if (value > 0) {
      return (
        <span className="flex items-center text-green-600 text-sm font-medium">
          <ArrowUp size={14} className="mr-1" />
          {value.toFixed(1)}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="flex items-center text-red-600 text-sm font-medium">
          <ArrowDown size={14} className="mr-1" />
          {Math.abs(value).toFixed(1)}%
        </span>
      );
    } else {
      return <span className="text-gray-500 text-sm font-medium">0.0%</span>;
    }
  };

  // Function to render platform icon
  const renderPlatformIcon = (platform: string): React.ReactElement | null => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <span className="text-blue-600 font-bold">f</span>
          </div>
        );
      case "x (formerly twitter)":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <span className="text-black font-bold">𝕏</span>
          </div>
        );
      case "linkedin":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <span className="text-blue-700 font-bold">in</span>
          </div>
        );
      case "instagram":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100">
            <span className="text-pink-600 font-bold">Ig</span>
          </div>
        );
      case "tiktok":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <span className="text-black font-bold">T</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Social Media Analytics
        </h2>
        <p className="text-gray-500">Performance overview across platforms</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channels
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  Total Followers
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  New Followers
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <MessageSquare size={14} className="mr-1" />
                  No. of Posts
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  Reach
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Activity size={14} className="mr-1" />
                  Engagement
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {socialData.map((platform, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {renderPlatformIcon(platform.platform)}
                    <span className="ml-3 font-medium text-gray-900">
                      {platform.platform}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {platform.totalFollowers}
                    </div>
                    {renderChangeIndicator(platform.totalFollowersChange)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {platform.newFollowers}
                    </div>
                    {renderChangeIndicator(platform.newFollowersChange)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {platform.posts}
                    </div>
                    {renderChangeIndicator(platform.postsChange)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {platform.reach}
                    </div>
                    {renderChangeIndicator(platform.reachChange)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {platform.engagement}
                    </div>
                    {renderChangeIndicator(platform.engagementChange)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Last updated: May 20, 2025 • Next update: May 27, 2025</p>
      </div>
    </div>
  );
}