import React, { ReactNode } from 'react';
import HeaderNavigation from './HeaderNavigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-200">
      <HeaderNavigation />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;