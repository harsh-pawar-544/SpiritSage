import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { GlassWater, Moon, Sun } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, updatePreferences } = useUserPreferences();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    updatePreferences({
      theme: newTheme,
      language: 'en',
      preferredSpirit: null
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GlassWater className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">SpiritSage</span>
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}