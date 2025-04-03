// layout.tsx

import React, { ReactNode, ReactElement } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  button?: ReactElement;
}

export default function Layout({ children, title, button }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {title && (
        <header className="bg-white-500 text-blue p-4 mt-0 flex items-center justify-between"> 
          <h1 className="text-xl font-semibold">{title}</h1>
          {button && button} 
        </header>
      )}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}