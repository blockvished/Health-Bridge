// app/success/page.tsx (or page.ts / page.js)
import { Suspense } from 'react';
import Success from './Success'; // Import your client component

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Success />
    </Suspense>
  );
}