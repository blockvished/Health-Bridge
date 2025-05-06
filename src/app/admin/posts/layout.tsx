import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  button?: ReactNode;
}

export default function Layout({ children, pageTitle, button }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {pageTitle && (
        <header className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          {button && <div>{button}</div>}
        </header>
      )}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}