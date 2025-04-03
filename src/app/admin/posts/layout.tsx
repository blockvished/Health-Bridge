// layout.tsx

import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string; // Make title optional
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {title && ( // Check if title has a value
        <header className="bg-blue-500 text-white p-4">
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>
      )}
      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
  );
}