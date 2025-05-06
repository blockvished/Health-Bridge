// report/page.tsx

import React from 'react';
import Main from '../settings/main';
import PageWrapper from "../PageWrapper";  // Update import path as needed


export default function ReportsPage() {
  return (
    <PageWrapper title="Settings"> {/* Pass title to Layout */}
      <Main /> {/* No extra div here */}
    </PageWrapper>
  );
}