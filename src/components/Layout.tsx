import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlassWater } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const navigation = [
    { name: 'Explore', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <GlassWater className="w-8 h-8 text-indigo-600" />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">SpiritSage</span>
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    } transition-colors`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}