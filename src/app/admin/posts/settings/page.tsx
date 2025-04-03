// report/page.tsx

import React from 'react';
import Main from '../settings/main';
import Layout from '../layout';

export default function ReportsPage() {
  return (
    <Layout title="Settings"> {/* Pass title to Layout */}
      <Main /> {/* No extra div here */}
    </Layout>
  );
}