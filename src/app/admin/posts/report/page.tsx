// report/page.tsx

import React from 'react';
import Report from '../report/Report';
import Layout from '../layout';

export default function ReportsPage() {
  return (
    <Layout title="Reports"> {/* Pass title to Layout */}
      <Report /> {/* No extra div here */}
    </Layout>
  );
}