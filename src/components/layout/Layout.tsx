import React, { ReactNode } from 'react';
import HeaderNavigation from './HeaderNavigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <HeaderNavigation />
      <main className="container mx-auto px-4 py-8 mt-20 text-gray-900 dark:text-gray-100">
        {children}
      </main>
    </div>
  );
};

export default Layout;