import React, { ReactElement } from 'react';

export interface PageHeaderProps {
  title?: string;
  button?: ReactElement;
}

export const PageHeader = ({ title, button }: PageHeaderProps) => {
  if (!title) return null;
  
  return (
    <header className="bg-white-500 text-blue p-4 mt-0 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>
      {button && button}
    </header>
  );
};

export default PageHeader;