import React, { ReactNode } from 'react';
import HeaderNavigation from './HeaderNavigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <HeaderNavigation />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20 text-gray-900 dark:text-white">
        {children}
      </main>
    </div>
  );
};

export default Layout;