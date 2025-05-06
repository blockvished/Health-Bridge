// report/page.tsx

import React from 'react';
import Report from '../report/Report';
import PageWrapper from "../PageWrapper";  // Update import path as needed


export default function ReportsPage() {
  return (
    <PageWrapper title="Reports"> {/* Pass title to Layout */}
      <Report /> {/* No extra div here */}
    </PageWrapper>
  );
}