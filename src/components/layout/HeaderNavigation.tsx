import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, GlassWater, Moon, Sun } from 'lucide-react';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

const HeaderNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, updatePreferences } = useUserPreferences();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      const button = document.getElementById('menu-button');
      if (
        menu &&
        button &&
        !menu.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    updatePreferences({
      theme: newTheme,
      language: 'en',
      preferredSpirit: null
    });
  };

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Contact', path: '/contact' },
    { name: 'Settings', path: '/settings' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 shadow-lg z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:text-indigo-300 transition-colors"
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
                      ? 'text-indigo-300'
                      : 'text-gray-300 hover:text-indigo-300'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-300 hover:text-indigo-300 transition-colors"
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
            id="menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-indigo-300 transition-colors"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
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

        <div
          id="mobile-menu"
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 rounded-b-lg shadow-lg">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-900/50 text-indigo-300'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-indigo-300'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <button
              onClick={toggleTheme}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-indigo-300 transition-colors"
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
      </nav>
    </header>
  );
};

export default HeaderNavigation;