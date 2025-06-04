import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, GlassWater, Moon, Sun } from 'lucide-react';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

const HeaderNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useUserPreferences();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Contact', path: '/contact' },
    { name: 'Settings', path: '/settings' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-text-light dark:text-text-dark hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <GlassWater className="w-8 h-8" />
            <span className="text-xl font-semibold">SpiritSage</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-text-light dark:text-text-dark hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-light dark:text-text-dark hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-text-light dark:text-text-dark hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            aria-expanded={isMenuOpen}
            aria-label="Main menu"
          >
            <span className="sr-only">
              {isMenuOpen ? 'Close menu' : 'Open menu'}
            </span>
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-gray-900 z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                        : 'text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              
              <button
                onClick={toggleTheme}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 mr-2" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default HeaderNavigation;