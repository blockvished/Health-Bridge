// report/page.tsx

import React from 'react';
import AllPosts from '../all/AllPosts';
import Layout from '../layout';

export default function ReportsPage() {
  return (
    <Layout title="Multi Posting"> {/* Pass title to Layout */}
      <AllPosts /> {/* No extra div here */}
    </Layout>
  );
}