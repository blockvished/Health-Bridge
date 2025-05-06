import React from "react";
import Link from "next/link";
import AddNew from "../add-new/AddNew";
import Layout from "../layout";

export default function AddNewPage() {
  return (
    <Layout
      pageTitle="Multi Posting" 
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
    </Layout>
  );
}
