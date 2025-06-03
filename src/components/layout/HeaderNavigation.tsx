import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlassWater, Menu, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

const HeaderNavigation: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Explore', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Settings', path: '/settings' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <GlassWater className="h-8 w-8 text-primary dark:text-primary-dark" />
            <span className="text-xl font-semibold">SpiritSage</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary dark:text-primary-dark'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Menu className="h-6 w-6" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-200"
              />
              <Dialog.Content
                className="fixed inset-y-0 right-0 w-[80vw] max-w-sm bg-white dark:bg-gray-900 shadow-xl z-50 transition-transform duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
              >
                <div className="flex flex-col h-full p-6">
                  <div className="flex items-center justify-between mb-8">
                    <Link
                      to="/"
                      className="flex items-center space-x-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <GlassWater className="h-8 w-8 text-primary dark:text-primary-dark" />
                      <span className="text-xl font-semibold">SpiritSage</span>
                    </Link>
                    <Dialog.Close className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <X className="h-6 w-6" />
                    </Dialog.Close>
                  </div>

                  <div className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
};

export default HeaderNavigation;