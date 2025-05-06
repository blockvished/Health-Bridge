// report/page.tsx

import React from 'react';
import AllPosts from '../all/AllPosts';
import PageWrapper from "../PageWrapper";  // Update import path as needed
import Link from 'next/link'; // Import Link

export default function ReportsPage() {
  return (
    <PageWrapper
      title="Multi Posting"
      button={
        <Link href="/admin/posts/add-new" className="bg-blue-500 text-white p-2 rounded">
          Add New
        </Link>
      }
    >
      <AllPosts />
    </PageWrapper>
  );
}