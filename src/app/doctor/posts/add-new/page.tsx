// page.tsx

import React from "react";
import Link from "next/link";
import AddNew from "../add-new/AddNew";
import PageWrapper from "../PageWrapper";  // Update import path as needed

export default function AddNewPage() {
  return (
    <PageWrapper
      title="Multi Posting"
      button={
        <Link
          href="/admin/posts/all"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Back
        </Link>
      }
    >
      <AddNew />
    </PageWrapper>
  );
}