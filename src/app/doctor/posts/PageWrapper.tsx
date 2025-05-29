// components/PageWrapper.tsx

import React, { ReactNode, ReactElement } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  button?: ReactElement;
}

export default function PageWrapper({ children, title, button }: PageWrapperProps) {
  return (
    <div className="flex flex-col">
      {title && (
        <header className="bg-white-500 text-blue p-4 mt-0 flex items-center justify-between"> 
          <h1 className="text-xl font-semibold">{title}</h1>
          {button && button} 
        </header>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}