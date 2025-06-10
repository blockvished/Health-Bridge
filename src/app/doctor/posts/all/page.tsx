// report/page.tsx

import React from "react";
import AllPosts from "./AllPosts";
import PageWrapper from "../PageWrapper"; // Update import path as needed
import Link from "next/link"; // Import Link

export default function ReportsPage() {
  return (
    <PageWrapper
      title="Multi Posting"
      button={
        <Link href="/doctor/posts/add-new">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm flex items-center">
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
            Add New
          </button>
        </Link>
      }
    >
      <AllPosts />
    </PageWrapper>
  );
}
